import { connectProducer, messageProducer } from "@repo/kafka-client/index";
import { type ResponseTypes } from "@repo/kafka-client/response";


connectProducer();
const topic = "engine_stream";


export const responseProducer = async (response: ResponseTypes) => {
  messageProducer(topic, {
    key: "engine_responses",
    value: JSON.stringify({ engine_responses: response }),
  });
}

