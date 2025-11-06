import { connectProducer, messageProducer } from "@repo/kafka-client/index";
import { type RequestTypes } from "@repo/kafka-client/request";


connectProducer();
const topic = "trade_stream";

export const requestProducer = async (key: string, request: RequestTypes) => {
  const payload =
    typeof (request as any).toJSON === "function"
      ? (request as any).toJSON()
      : request;

  console.log(`[Server Producer] Sending request to topic=${topic}, key=${key}, action=${payload.action}`);
  messageProducer(topic,
    String(key),
    JSON.stringify({ server_requests: payload }),
  );
  console.log(`[Server Producer] Request sent for key=${key}`);
}

