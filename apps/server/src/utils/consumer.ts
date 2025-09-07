import { consumeMessages, type EachMessagePayload } from "@repo/kafka-client/index";


const topic = "engine_stream";
const groupId = "engine_stream_consumer"
// export const prices = new Map<string, { price: number; decimal: number }>()


const eachMessageHandler = async ({ topic, partition, message }: EachMessagePayload) => {
  const raw = message.value?.toString();
  console.log(raw)
  if (!raw) return;

  const messageValue = JSON.parse(raw);
  const value = JSON.parse(messageValue);

  // value.price_updates.forEach((update: { asset: string; price: number; decimal: number }) => {
  //   prices.set(update.asset, { price: update.price, decimal: update.decimal });
  // });


};

consumeMessages(topic, groupId, eachMessageHandler);

