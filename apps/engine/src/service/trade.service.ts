import { OrderStore, statusType, type Orders } from "../Store/OrderStore.ts";
import { UserStore } from "../Store/UserStore.ts";
import { Response } from "@repo/kafka-client/response";
import { getPrice } from "../Store/PriceStore.ts";
import { requestProducer, responseProducer } from "./kafkaProducer.service.ts";
import { KafkaRequest } from "@repo/kafka-client/request";

const BALANCE_DECIMAL = 100;      // 2 decimals
const PRICE_DECIMAL = 10_000;     // 4 decimals

const userStore = UserStore.getInstance();
const orderStore = OrderStore.getInstance();


function calculateOrderValue(quantity: number, entryPrice: number): number {
  const priceInBalanceScale = Math.floor(entryPrice / (PRICE_DECIMAL / BALANCE_DECIMAL));

  return quantity * priceInBalanceScale;
}

function calculateRequiredMargin(orderValue: number, leverage: number): number {
  if (leverage <= 0) {
    throw new Error("Invalid leverage: must be greater than 0");
  }

  return Math.floor(orderValue / leverage);
}

export const calculatePnL = async (order: Orders, entryPrice: number, currentPrice: number) => {
  let pnL: number = 0;
  if (order.type === "long") {
    pnL = (currentPrice - entryPrice) * order.quantity / PRICE_DECIMAL;
  } else if (order.type === "short") {
    pnL = (entryPrice - currentPrice) * order.quantity / PRICE_DECIMAL;
  }
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
  const orderValue = calculateOrderValue(quantity, entryPrice);
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

      orderStore.createOrder({ ...data, entryPrice });
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

      orderStore.createOrder({ ...data, entryPrice });
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
  responseProducer(key, new Response({
    statusCode: 200,
    success: true,
    message: "Order closed successfully",
    data: closedOrder,
  }));

  requestProducer("db", new KafkaRequest({
    service: "db",
    action: "user-balance-update",
    data: { userid: user?.id, balance: user?.balance },
    message: "Store updated user balance in database."
  }))

  requestProducer("db", new KafkaRequest({
    service: "db",
    action: "store-close-order",
    data: closedOrder,
    message: "Store closed order in database."
  }))
  orderStore.deleteOrderFromMemory(order.id);
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
