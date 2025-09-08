import { consumeMessages, type EachMessagePayload } from "@repo/kafka-client/index";
import { closeTrade, createTrade } from "./trade.service";
import { createUser, getAllOpenOrders, getUserBalance, getUserByEmail, getUserById } from "./user.service";
import { updatePrice } from "../Store/PriceStore";

const topic = "trade_stream";
const groupId = "trade_stream_consumer";


const requestHandlers: Record<string, (data: any) => Promise<any> | any> = {
  "trade-open": createTrade,
  "trade-close": closeTrade,
  "create-user": createUser,
  "get-balance": getUserBalance,
  "get-user-id": getUserById,
  "get-user-email": getUserByEmail,
  "get-all-open-orders": getAllOpenOrders,
};


const eachMessageHandler = async ({ topic, partition, message }: EachMessagePayload) => {
  const rawValue = message.value?.toString();
  if (!rawValue) return;

  let value: any;
  try {
    const outer = JSON.parse(rawValue);
    value = JSON.parse(outer.value);
  } catch (err) {
    console.error("Invalid JSON received:", rawValue, err);
    return;
  }

  if (Array.isArray(value.price_updates)) {
    value.price_updates.forEach((update: { asset: string; price: number; decimal: number }) => {

      updatePrice(update.asset, update.price, update.decimal, Number(message.timestamp), message.offset);

    });
  }

  if (value.server_requests && typeof value.server_requests === "object") {

    const request = value.server_requests;

    const handler = requestHandlers[request.action];
    if (handler) {
      try {
        await handler(request.data);
      } catch (err) {
        console.error(`Error handling action ${request.action}:`, err);
      }
    } else {
      console.log("Invalid request action:", request.action);
    }
  } else {
    // console.log("No server_requests in this message");
  }
};

consumeMessages(topic, groupId, eachMessageHandler);
