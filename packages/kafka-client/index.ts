import { type EachMessagePayload, type KafkaConfig } from 'kafkajs';
import { KafkaManager } from './kafkaManager';

const kafkaConfig: KafkaConfig = { clientId: 'trade_engine', brokers: ['localhost:9092'] };

const kafkaManager = KafkaManager.getInstance(kafkaConfig);


// const initKafka = async () => {
//
//   await kafkaManager.connectAdmin();
//   await kafkaManager.createTopics([{ topic: 'your-topic-name', numPartitions: 2, replicationFactor: 1 }]);
//   await kafkaManager.connectProducer();
//
//   // await kafkaManager.deleteTopics(['user-service']);
//   // await kafkaManager.disconnectAdmin();
//
//   const eachMessageHandler = async (payload: EachMessagePayload) => {
//     const { topic, partition, message } = payload;
//     console.log({
//       topic,
//       partition,
//       key: message.key?.toString(),
//       value: message.value?.toString(),
//     });
//   };
//
//   await kafkaManager.initializeConsumer('your-topic-name', 'group-Id', eachMessageHandler);
//   await kafkaManager.disconnectConsumer('topic');
// };
//


export const produceMessage = async (topic: string, data: any) => {
  await kafkaManager.connectProducer();
  await kafkaManager.initializeProducer(topic, data);
  await kafkaManager.disconnectProducer();
};


export const consumeMessages = async (actionFn: any, topic: string, groupId: string) => {
  const eachMessageHandler = async (payload: EachMessagePayload) => {
    const { topic, partition, message } = payload;

    actionFn(topic, partition, message);

  };
  await kafkaManager.initializeConsumer(topic, groupId, eachMessageHandler);
}


export const disconnectKafka = async (topic: string) => {
  await kafkaManager.disconnectAdmin();
  await kafkaManager.disconnectProducer();
  await kafkaManager.disconnectConsumer(topic);
}
