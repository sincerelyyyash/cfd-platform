import { OrderStore, statusType, type Orders } from "../Store/OrderStore.ts";
import { UserStore } from "../Store/UserStore.ts";
import { Response } from "@repo/kafka-client/response";
import { getPrice } from "../Store/PriceStore.ts";
import { requestProducer, responseProducer } from "./kafkaProducer.service.ts";
import { KafkaRequest } from "@repo/kafka-client/request";

const BALANCE_DECIMAL = 100;      // 2 decimals
const PRICE_DECIMAL = 10_000;     // 4 decimals
const QUANTITY_DECIMAL = 10_000;  // 4 decimals 

const userStore = UserStore.getInstance();
const orderStore = OrderStore.getInstance();


function calculateOrderValue(quantity: number, entryPrice: number): number {
  return Math.floor((quantity * entryPrice * BALANCE_DECIMAL) / (QUANTITY_DECIMAL * PRICE_DECIMAL));
}

function calculateRequiredMargin(orderValue: number, leverage: number): number {
  if (leverage <= 0) {
    throw new Error("Invalid leverage: must be greater than 0");
  }

  return Math.floor(orderValue / leverage);
}

export const calculatePnL = async (order: Orders, entryPrice: number, currentPrice: number) => {
  // Both prices are in PRICE_DECIMAL scale
  // quantity is in QUANTITY_DECIMAL scale
  // We want PnL in BALANCE_DECIMAL scale (USD with 2 decimals)
  
  // Formula: (priceDiff / PRICE_DECIMAL) * (quantity / QUANTITY_DECIMAL) * BALANCE_DECIMAL
  // Simplified: (priceDiff * quantity * BALANCE_DECIMAL) / (PRICE_DECIMAL * QUANTITY_DECIMAL)
  
  let pnL: number = 0;
  const priceDiff = order.type === "long" 
    ? (currentPrice - entryPrice) 
    : (entryPrice - currentPrice);
  
  pnL = Math.floor((priceDiff * order.quantity * BALANCE_DECIMAL) / (PRICE_DECIMAL * QUANTITY_DECIMAL));
  
  return pnL;
}


export const createTrade = async (key: string, data: any) => {
  const { id, type, userId, quantity, asset, leverage } = data;

  const user = userStore.getUserById(userId);
  if (!user) {
    return responseProducer(key, new Response({
      statusCode: 400,
      success: false,
      message: "User does not exist.",
    })
    );
  }

  if (user.balance <= 0) {
    return responseProducer(key, new Response({
      statusCode: 400,
      success: false,
      message: "Insufficient balance to place order.",
    }));
  }


  const latest = getPrice(asset);
  if (!latest) {
    return responseProducer(key, new Response({
      statusCode: 400,
      success: false,
      message: `No price available for asset ${asset}.`,
    }));
  }

  const entryPrice = latest.price;
  // Scale quantity to QUANTITY_DECIMAL (e.g., 0.1 BTC -> 1000)
  const scaledQuantity = Math.floor(quantity * QUANTITY_DECIMAL);
  const orderValue = calculateOrderValue(scaledQuantity, entryPrice);
  const requiredMargin = calculateRequiredMargin(orderValue, leverage);

  try {
    if (type === "long") {
      if (requiredMargin > user.balance) {
        return responseProducer(key, new Response({
          statusCode: 400,
          success: false,
          message: "Insufficient margin to place LONG order.",
        }));
      }

      orderStore.createOrder({ ...data, quantity: scaledQuantity, entryPrice, margin: requiredMargin });
      user.balance -= requiredMargin;

      return responseProducer(key, new Response({
        statusCode: 200,
        success: true,
        message: "LONG order placed successfully",
        data: { orderId: id },
      }));
    }

    if (type === "short") {
      const shortMargin = Math.floor(requiredMargin * 1.1);

      if (shortMargin > user.balance) {
        return responseProducer(key, new Response({
          statusCode: 400,
          success: false,
          message: "Insufficient margin to place SHORT order.",
        }));
      }

      orderStore.createOrder({ ...data, quantity: scaledQuantity, entryPrice, margin: shortMargin });
      user.balance -= shortMargin;

      return responseProducer(key, new Response({
        statusCode: 200,
        success: true,
        message: "SHORT order placed successfully",
        data: { orderId: id },
      }));
    }

    return responseProducer(key, new Response({
      statusCode: 400,
      success: false,
      message: `Invalid order type: ${type}`,
    }));

  } catch (err) {
    return responseProducer(key, new Response({
      statusCode: 500,
      success: false,
      message: "Internal server error: " + (err as Error).message,
    }));
  }
};


export const closeTrade = async (key: string, data: any) => {
  const { orderId } = data;

  const order = orderStore.getOrderById(orderId);
  if (!order) {
    return responseProducer(key, new Response({
      statusCode: 400,
      success: false,
      message: "Order not found.",
    }));
  }

  if (order.status !== statusType.open) {
    return responseProducer(key, new Response({
      statusCode: 400,
      success: false,
      message: "Order is not open.",
    }));
  }

  const latest = getPrice(order.asset);
  if (!latest) {
    return responseProducer(key, new Response({
      statusCode: 400,
      success: false,
      message: `No price available for asset ${order.asset}.`,
    }));
  }

  const currentPrice = latest.price;
  const entryPrice = order.entryPrice;

  const pnL = await calculatePnL(order, entryPrice, currentPrice)


  const user = userStore.getUserById(order.userId);
  if (user) {
    user.balance += (order.margin ?? 0) + pnL;
  }


  order.status = statusType.closed;
  order.exitPrice = currentPrice;
  order.pnL = pnL;
  order.liquidated = false;
  const closedOrder = orderStore.getOrderById(order.id);
  

  requestProducer("db", new KafkaRequest({
    service: "db",
    action: "store-close-order",
    data: closedOrder,
    message: "Store closed order in database."
  }))
  
  // Persist updated balance to database
  requestProducer("db", new KafkaRequest({
    service: "db",
    action: "user-balance-update",
    data: { userid: user?.id, balance: user?.balance },
    message: "Update user balance in database."
  }))
  
  // Log the balance update for debugging
  console.log(`[Engine] Order ${order.id} closed. User ${user?.id} new balance: ${user?.balance} (PnL: ${pnL})`);
  
  responseProducer(key, new Response({
    statusCode: 200,
    success: true,
    message: "Order closed successfully",
    data: closedOrder,
  }));
  
  return;
};

const getOpenOrderById = async (key: string, data: any) => {
  const { orderId } = data;
  try {
    const order = orderStore.getOrderById(orderId)
    if (!order) {
      return responseProducer(key, new Response({
        statusCode: 403,
        message: "Order not found",
        success: false
      }));
    }

    return responseProducer(key, new Response({
      statusCode: 200,
      success: true,
      message: "Open order fetched successfully",
      data: order
    }));
  }
  catch (err) {
    return responseProducer(key, new Response({
      statusCode: 400,
      success: false,
      message: "Unable to get open order."
    }));
  }
}

const getAllOpenOrders = async (key: string, data: any) => {
  const { userId } = data;

  const user = userStore.getUserById(userId);
  if (!user) {
    return responseProducer(key, new Response({
      statusCode: 403,
      message: "User not found",
      success: false
    }));
  }

  try {
    const openOrders = orderStore.getOpenOrders(userId);
    return responseProducer(key, new Response({
      statusCode: 200,
      success: true,
      message: "All Open orders fetched successfully",
      data: openOrders
    }));
  }
  catch (err) {
    return responseProducer(key, new Response({
      statusCode: 400,
      success: false,
      message: "Unable to get open orders."
    }));
  }
}
