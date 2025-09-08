import { getPrice } from "../Store/PriceStore.ts";
import { OrderStore } from "../Store/OrderStore";
import { UserStore } from "../Store/UserStore";
import { calculatePnL } from "./trade.service";
import { responseProducer } from "./kafkaProducer.service";
import { Response } from "@repo/kafka-client/response";


const userStore = UserStore.getInstance();
const orderStore = OrderStore.getInstance();

export const liquidationService = async () => {
  const openOrders = orderStore.getAllOpenOrders();
  if (openOrders.length < 1) return;
  try {
    for (const order of openOrders) {
      const latest = getPrice(order.asset);
      if (!latest) continue;

      const currentPrice = latest.price;
      const entryPrice = order.entryPrice;

      const pnl = await calculatePnL(order, entryPrice, currentPrice);
      const margin = order.margin;
      if (!margin) continue;

      const equity = margin + pnl;

      if (order.stopLoss) {

        if (
          (order.type === "long" && currentPrice <= order.stopLoss) ||
          (order.type === "short" && currentPrice >= order.stopLoss)
        ) {
          orderStore.closeOrder(order, currentPrice, pnl, true);

          const user = userStore.getUserById(order.userId);
          if (user && equity > 0) {
            user.balance += equity;
          }

          const closedOrder = orderStore.getOrderById(order.id)
          responseProducer(order.id, new Response({
            statusCode: 200,
            message: `Order: ${order.id} hit stoploss.`,
            success: true,
            data: closedOrder
          }))

          console.log(`Order ${order.id} stopped out at price ${currentPrice}`);
          continue;
        }
      }

      if (order.takeProfit) {
        if (
          (order.type === "long" && currentPrice >= order.takeProfit) ||
          (order.type === "short" && currentPrice <= order.takeProfit)
        ) {
          orderStore.closeOrder(order, currentPrice, pnl, false);

          const user = userStore.getUserById(order.userId);
          if (user && equity > 0) {
            user.balance += equity;
          }

          const closedOrder = orderStore.getOrderById(order.id)
          responseProducer(order.id, new Response({
            statusCode: 200,
            message: `Order: ${order.id} hit target take-profit.`,
            success: true,
            data: closedOrder
          }))

          console.log(`Order ${order.id} take-profit hit at price ${currentPrice}`);
          continue;
        }
      }

      if (equity <= 0) {
        orderStore.closeOrder(order, currentPrice, pnl, true);

        const user = userStore.getUserById(order.userId);
        if (user && equity > 0) {
          user.balance += equity;
        }

        const closedOrder = orderStore.getOrderById(order.id)
        responseProducer(order.id, new Response({
          statusCode: 200,
          message: `Order: ${order.id} liquidated due to margin call.`,
          success: true,
          data: closedOrder
        }))

        console.log(`Order ${order.id} liquidated at price ${currentPrice}`);
      }
    }
  } catch (err) {
    return responseProducer("liquidation_fail", new Response({
      statusCode: 500,
      message: "Engine liquidation service failed.",
      success: false,
      data: (err as Error).message,
    }))
  }
};

