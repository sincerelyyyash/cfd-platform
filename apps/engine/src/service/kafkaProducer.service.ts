import { connectProducer, messageProducer } from "@repo/kafka-client/index";
import { type ResponseTypes } from "@repo/kafka-client/response";


connectProducer();
const topic = "engine_stream";


export const responseProducer = async (key: string, response: ResponseTypes) => {
  const payload =
    typeof (response as any).toJSON === "function"
      ? (response as any).toJSON()
      : response;

  messageProducer(topic,
    String(key),
    JSON.stringify({ engine_responses: payload }),
  );
}

