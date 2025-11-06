import { connectProducer, messageProducer } from "@repo/kafka-client/index";
import type { RequestTypes } from "@repo/kafka-client/request";
import { type ResponseTypes } from "@repo/kafka-client/response";


connectProducer();
const topic = "engine_stream";


export const responseProducer = async (key: string, response: ResponseTypes) => {
  const payload =
    typeof (response as any).toJSON === "function"
      ? (response as any).toJSON()
      : response;

  console.log(`[Engine Producer] Sending response to topic=${topic}, key=${key}, payload:`, payload);
  await messageProducer(topic,
    String(key),
    JSON.stringify({ engine_responses: payload }),
  );
  console.log(`[Engine Producer] Response sent for key=${key}`);
}

export const requestProducer = async (key: string, request: RequestTypes) => {
  const payload =
    typeof (request as any).toJSON === "function"
      ? (request as any).toJSON()
      : request;

  console.log(`[Engine Producer] Sending DB request to topic=${topic}, key=${key}, action=${payload.action}`);
  await messageProducer(topic,
    String(key),
    JSON.stringify({ db_requests: payload }),
  );
  console.log(`[Engine Producer] DB request sent for key=${key}`);
}

