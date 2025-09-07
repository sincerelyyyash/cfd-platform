import { consumeMessages, type EachMessagePayload } from "@repo/kafka-client/index";

const topic = "trade_stream";
const groupId = "trade_stream_consumer"
export const prices = new Map<string, { price: number; decimal: number }>()

const eachMessageHandler = async ({ topic, partition, message }: EachMessagePayload) => {
  const raw = message.value?.toString();
  if (!raw) return;

  let value: any;
  try {
    value = JSON.parse(raw);
    console.log("Message timestamp:", message.timestamp);
    console.log("Message key:", JSON.stringify(message.key?.toString()));
    console.log("Parsed value:", value);
  } catch (err) {
    console.error("Invalid JSON received:", raw);
    return;
  }

  // if (Array.isArray(value.price_updates)) {
  //   value.price_updates.forEach((update: { asset: string; price: number; decimal: number }) => {
  //     prices.set(update.asset, { price: update.price, decimal: update.decimal,timestamp: message.timestamp });
  //   });
  // }
  //
  // if (Array.isArray(value.server_requests)) {
  //   value.server_requests.forEach((request: any) => console.log(request));
  // } else if (value.server_requests && typeof value.server_requests === "object") {
  //   console.log("Server request:", value.server_requests, "Timestamp:", message.timestamp);
  // }

};

consumeMessages(topic, groupId, eachMessageHandler);

