import { connectProducer, messageProducer } from "@repo/kafka-client/index";
import { type RequestTypes } from "@repo/kafka-client/request";


connectProducer();
const topic = "trade_stream";

export const requestProducer = async (key: string, request: RequestTypes) => {
  messageProducer(topic, {
    key: key,
    value: JSON.stringify({ server_requests: request }),
  });
}

