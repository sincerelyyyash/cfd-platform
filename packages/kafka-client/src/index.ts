import { type EachMessagePayload, type KafkaConfig } from 'kafkajs';
import { KafkaManager } from './kafkaManager';

const kafkaConfig: KafkaConfig = { clientId: 'trade_engine', brokers: ['localhost:9092'] };

const kafkaManager = KafkaManager.getInstance(kafkaConfig);

export const connectProducer = async () => {
  try {
    console.log("Connecting producer...");
    await kafkaManager.connectProducer();
    console.log("Producer connected successfully.");
  } catch (error) {
    console.error('Failed to connect Kafka producer:', error);
  }
}

export const messageProducer = async (topic: string, key: string, data: any) => {
  try {
    const exists = await kafkaManager.topicExists(topic);
    if (!exists) {
      await kafkaManager.createTopics([{ topic, numPartitions: 1, replicationFactor: 1 }]);
    }

    await kafkaManager.initializeProducer(topic, key, data);
  } catch (err) {
    console.error("Failed to initialize Kafka producer: " + err);
  }
};


export const disconnectProducer = async () => {
  try {
    console.log("Disconnecting producer...")
    await kafkaManager.disconnectProducer();
  } catch (err) {
    console.error("Failed to disconnect kafka producer: " + err);
  }
}


export const consumeMessages = async (
  topic: string,
  groupId: string,
  actionFn: (payload: EachMessagePayload) => Promise<void>
) => {
  const exists = await kafkaManager.topicExists(topic);
  if (!exists) {
    await kafkaManager.createTopics([{ topic, numPartitions: 1, replicationFactor: 1 }]);
  }

  await kafkaManager.initializeConsumer(topic, groupId, actionFn);
};

export const disconnectKafka = async (topic: string) => {
  await kafkaManager.disconnectAdmin();
  await kafkaManager.disconnectProducer();
  await kafkaManager.disconnectConsumer(topic);
}

export { type EachMessagePayload }
