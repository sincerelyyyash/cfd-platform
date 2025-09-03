import { Kafka, type EachMessagePayload } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'trade_engine',
  brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: "trade-group" })

await consumer.connect();

export const QueueSubscriber = async (topic: string, fromBeginning: boolean) => {


  await consumer.subscribe({
    topic: topic,
    fromBeginning: fromBeginning,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
      console.log({
        value: message.value?.toString(),
      })
    },
  })
}
