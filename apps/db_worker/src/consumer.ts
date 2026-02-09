import { consumeMessages, type EachMessagePayload } from "@repo/redis-client/index";
import { storeClosedOrder } from "./order.db";
import { createNewUser, updateUserBalance } from "./user.db";

export const topic = "engine_stream";
export const groupId = "db_worker_consumer_group";

export const startDataBaseWorker = () => {

  try {
    consumeMessages(topic, groupId, eachMessageHandler);
  } catch (err) {
    console.error("Failed to start engine consumer : " + err);
  }

};


const requestHandlers: Record<string, (data: any) => Promise<any> | any> = {
  "store-close-order": storeClosedOrder,
  "store-new-user": createNewUser,
  "user-balance-update": updateUserBalance,
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



  if (value.db_requests && typeof value.db_requests === "object") {
    let key: string | undefined;
    if (message.key) {
      key = message.key.toString();
    }
    if (!key) {
      console.log("no key in message");
      return;
    }
    const request = value.db_requests;
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
  }
};
