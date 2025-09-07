import { connectProducer, messageProducer } from "@repo/kafka-client/index";
import { type ResponseTypes } from "@repo/kafka-client/response";


connectProducer();
const topic = "engine_stream";


export const responseProducer = async (key: string, response: ResponseTypes) => {
  messageProducer(topic, {
    key: key,
    value: JSON.stringify({ engine_responses: response }),
  });
}

