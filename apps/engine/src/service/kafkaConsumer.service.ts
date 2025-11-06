import { consumeMessages, type EachMessagePayload } from "@repo/kafka-client/index";
import { closeTrade, createTrade } from "./trade.service";
import { createUser, getAllOpenOrders, getAllClosedOrders, getUserBalance, getUserByEmail, getUserById } from "./user.service";
import { updatePrice } from "../Store/PriceStore";

const topic = "trade_stream";
const groupId = "trade_stream_consumer";
export let offset: string = "";

export const startEngineKafkaConsumer = () => {

  try {
    consumeMessages(topic, groupId, eachMessageHandler);
  } catch (err) {
    console.error("Failed to start engine consumer : " + err);
  }

};


const requestHandlers: Record<string, (key: string, data: any) => Promise<any> | any> = {
  "trade-open": createTrade,
  "trade-close": closeTrade,
  "create-user": createUser,
  "get-balance": getUserBalance,
  "get-user-id": getUserById,
  "get-user-email": getUserByEmail,
  "get-all-open-orders": getAllOpenOrders,
  "get-all-closed-orders": getAllClosedOrders,
};

const eachMessageHandler = async ({ topic, partition, message }: EachMessagePayload) => {
  const rawValue = message.value?.toString();
  if (!rawValue) return;

  let value: any;
  try {
    const outer = JSON.parse(rawValue);
    if (outer && typeof outer === "object" && "value" in outer) {
      value = outer.value;
    } else {
      value = outer;
    }
    if (typeof value === "string") {
      value = JSON.parse(value);
    }
  } catch (err) {
    console.error("Invalid JSON received:", rawValue, err);
    return;
  }

  offset = message.offset;
  if (Array.isArray(value.price_updates)) {
    value.price_updates.forEach((update: { asset: string; price: number; decimal: number }) => {
      updatePrice(update.asset, update.price, update.decimal, Number(message.timestamp), message.offset);
    });
  }


  if (value.server_requests && typeof value.server_requests === "object") {
    let key: string | undefined;
    if (message.key) {
      key = message.key.toString();
    }
    if (!key) {
      console.log("no key in Kafka message");
      return;
    }
    const request = value.server_requests;
    console.log(`[Engine] Received request: action=${request.action}, key=${key}`);
    const handler = requestHandlers[request.action];
    if (handler) {
      try {
        console.log(`[Engine] Processing action: ${request.action} with data:`, request.data);
        await handler(key, request.data);
        console.log(`[Engine] Successfully processed action: ${request.action}`);
      } catch (err) {
        console.error(`[Engine] Error handling action ${request.action}:`, err);
      }
    } else {
      console.log(`[Engine] Invalid request action: ${request.action}`);
    }
  }
};

