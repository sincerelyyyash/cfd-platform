import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'main_server',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer()
await producer.connect()

type Trade = {
  id: string,
  userId: string,
  type: "long" | "short",
  status: "open" | "closed" | "pending"
  asset: string,
  entryPrice: number,
  leverage?: number,
  margin?: number,
  exitPrice?: number,
  pnL?: number,
  slippage?: number,
}

type Messages = {
  key: string,
  value: Trade
}

export const addToQueue = async (topic: string, messages: any[]) => {
  await producer.send({
    topic: topic,
    messages: messages,
  })
}
