import { consumeMessages, type EachMessagePayload } from "@repo/redis-client/index";

export const topic = "engine_stream";
export const groupId = "server_consumer_group";

const pendingRequests = new Map<string, (response: any) => void>();

export const startConsumer = () => {
  consumeMessages(topic, groupId, eachMessageHandler);
};

const eachMessageHandler = async ({ message }: EachMessagePayload) => {

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


  let key: string | undefined;
  if (message.key) {
    key = message.key.toString();
  }


  if (!key) {
    console.log("no key in message");
    return;
  }

  if (pendingRequests.has(key)) {
    console.log(`[Server Consumer] Resolving request with key=${key}, response:`, value.engine_responses ?? value);
    const resolve = pendingRequests.get(key)!;
    resolve(value.engine_responses ?? value);
    pendingRequests.delete(key);
  } else {
    console.log(`[Server Consumer] No pending request found for key=${key}, message value:`, value);
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
