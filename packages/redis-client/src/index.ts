import { RedisManager, type EachMessagePayload } from './redisManager';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const redisManager = RedisManager.getInstance({ url: redisUrl });

export const connectProducer = async () => {
  try {
    console.log("Connecting producer...");
    await redisManager.connectProducer();
    console.log("Producer connected successfully.");
  } catch (error) {
    console.error('Failed to connect producer:', error);
  }
}

export const messageProducer = async (topic: string, key: string, data: any) => {
  try {
    const exists = await redisManager.topicExists(topic);
    if (!exists) {
      await redisManager.createTopics([{ topic, numPartitions: 1, replicationFactor: 1 }]);
    }

    await redisManager.initializeProducer(topic, key, data);
  } catch (err) {
    console.error("Failed to produce message: " + err);
  }
};


export const disconnectProducer = async () => {
  try {
    console.log("Disconnecting producer...")
    await redisManager.disconnectProducer();
  } catch (err) {
    console.error("Failed to disconnect producer: " + err);
  }
}


export const consumeMessages = async (
  topic: string,
  groupId: string,
  actionFn: (payload: EachMessagePayload) => Promise<void>
) => {
  const exists = await redisManager.topicExists(topic);
  if (!exists) {
    await redisManager.createTopics([{ topic, numPartitions: 1, replicationFactor: 1 }]);
  }

  await redisManager.initializeConsumer(topic, groupId, actionFn);
};

export const disconnectRedis = async (topic: string) => {
  await redisManager.disconnectAdmin();
  await redisManager.disconnectProducer();
  await redisManager.disconnectConsumer(topic);
}

export { type EachMessagePayload }
