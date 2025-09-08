import { consumeMessages, type EachMessagePayload } from "@repo/kafka-client/index";

export const topic = "engine_stream";
export const groupId = "engine_stream_consumer";

const pendingRequests = new Map<string, (response: any) => void>();

export const startConsumer = () => {
  consumeMessages(topic, groupId, eachMessageHandler);
};

const eachMessageHandler = async ({ message }: EachMessagePayload) => {
  const rawValue = message.value?.toString();
  if (!rawValue) return;

  let parsed: any;
  try {
    const outer = JSON.parse(rawValue);
    parsed = JSON.parse(outer.value);
    console.log(parsed)
  } catch (err) {
    console.error("Invalid JSON received:", rawValue, err);
    return;
  }


  let key: string | undefined;
  if (message.key) {
    try {
      key = JSON.parse(message.key.toString());
    } catch {
      key = message.key.toString();
    }
  }

  if (!key) {
    console.log("no key in Kafka message");
    return;
  }

  console.log("Kafka message key:", key);
  if (pendingRequests.has(key)) {
    const resolve = pendingRequests.get(key)!;
    resolve(parsed.engine_responses ?? parsed);
    pendingRequests.delete(key);
  }
};

export const waitForResponse = (id: string, timeout = 10000): Promise<any> => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      pendingRequests.delete(id);
      reject(new Error(`Timeout waiting for response for id: ${id}`));
    }, timeout);

    pendingRequests.set(id, (response) => {
      clearTimeout(timer);
      resolve(response);
    });
  });
};

