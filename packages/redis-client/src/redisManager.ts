import Redis from 'ioredis';

export type EachMessagePayload = {
  topic: string;
  partition: number;
  message: {
    key: Buffer | null;
    value: Buffer | null;
    timestamp: string;
    offset: string;
  };
};

type RedisManagerConfig = {
  url: string;
};

export class RedisManager {
  private static instance: RedisManager;

  private redis: Redis;
  private subscribers: Map<string, { running: boolean; consumerName: string }> = new Map();

  constructor(config: RedisManagerConfig) {
    this.redis = new Redis(config.url);
  }

  public static getInstance(config: RedisManagerConfig) {
    if (!RedisManager.instance) {
      RedisManager.instance = new RedisManager(config);
    }
    return RedisManager.instance;
  }

  async connectAdmin() {
    try {
      console.log('Connecting Redis admin...');
      await this.redis.ping();
      console.log('Redis admin connected.');
    } catch (error) {
      console.error('Failed to connect Redis admin:', error);
    }
  }

  async disconnectAdmin() {
    try {
      console.log('Disconnecting Redis admin...');
      console.log('Redis admin disconnected.');
    } catch (error) {
      console.error('Failed to disconnect Redis admin:', error);
    }
  }

  async topicExists(topic: string): Promise<boolean> {
    try {
      const exists = await this.redis.exists(topic);
      return exists === 1;
    } catch (error) {
      console.error("Failed to check if topic exists:", error);
      return false;
    }
  }

  async initializeConsumer(topic: string, groupId: string, eachMessageHandler: (payload: EachMessagePayload) => Promise<void>) {
    try {
      const consumerName = `${groupId}-${process.pid}`;
      console.log(`Connecting consumer for topic: ${topic}`);

      try {
        await this.redis.xgroup('CREATE', topic, groupId, '0', 'MKSTREAM');
        console.log(`Consumer group ${groupId} created for topic: ${topic}`);
      } catch (err: any) {
        if (!err.message?.includes('BUSYGROUP')) {
          throw err;
        }
      }

      console.log(`Subscribed to topic ${topic}`);

      this.subscribers.set(topic, { running: true, consumerName });

      const poll = async () => {
        while (this.subscribers.get(topic)?.running) {
          try {
            const results = await this.redis.xreadgroup(
              'GROUP', groupId, consumerName,
              'COUNT', '10',
              'BLOCK', '1000',
              'STREAMS', topic, '>'
            );

            if (!results) continue;

            for (const result of results) {
              const [streamName, entries] = result as [string, [string, string[]][]];
              for (const entry of entries) {
                const [id, fields] = entry;
                const fieldMap: Record<string, string> = {};
                for (let i = 0; i < fields.length; i += 2) {
                  fieldMap[fields[i]!] = fields[i + 1]!;
                }

                const payload: EachMessagePayload = {
                  topic: streamName,
                  partition: 0,
                  message: {
                    key: fieldMap['key'] ? Buffer.from(fieldMap['key']) : null,
                    value: fieldMap['value'] ? Buffer.from(fieldMap['value']) : null,
                    timestamp: fieldMap['timestamp'] ?? Date.now().toString(),
                    offset: id,
                  },
                };

                await eachMessageHandler(payload);
                await this.redis.xack(topic, groupId, id);
              }
            }
          } catch (err) {
            if (this.subscribers.get(topic)?.running) {
              console.error(`Error polling stream ${topic}:`, err);
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
        }
      };

      poll();
    } catch (error) {
      console.error('Failed to initialize consumer:', error);
    }
  }

  async disconnectConsumer(topic: string) {
    const subscriber = this.subscribers.get(topic);

    if (subscriber) {
      try {
        console.log(`Disconnecting consumer for topic: ${topic}`);
        subscriber.running = false;
        console.log(`Consumer disconnected for topic: ${topic}`);
        this.subscribers.delete(topic);
      } catch (error) {
        console.error(`Failed to disconnect consumer for topic: ${topic}`, error);
      }
    } else {
      console.log(`No consumer found for topic: ${topic}`);
    }
  }

  async createTopics(topicConfig: { topic: string; numPartitions: number; replicationFactor: number }[]) {
    try {
      for (const config of topicConfig) {
        try {
          await this.redis.xgroup('CREATE', config.topic, '__init__', '0', 'MKSTREAM');
          await this.redis.xgroup('DELCONSUMER', config.topic, '__init__', '__init__');
          await this.redis.xgroup('DESTROY', config.topic, '__init__');
        } catch (err: any) {
          if (!err.message?.includes('BUSYGROUP')) {
            throw err;
          }
        }
      }
      console.log('Topics created successfully.');
    } catch (error) {
      console.error('Failed to create topics:', error);
    }
  }

  async deleteTopics(topics: string[]) {
    try {
      console.log('Deleting topics:', topics);
      for (const topic of topics) {
        await this.redis.del(topic);
      }
      console.log('Topics deleted successfully.');
    } catch (error) {
      console.error('Failed to delete topics:', error);
    }
  }

  async initializeProducer(topic: string, key: string, data: any) {
    try {
      await this.redis.xadd(
        topic, '*',
        'key', key,
        'value', typeof data === 'string' ? data : JSON.stringify(data),
        'timestamp', Date.now().toString(),
      );
    } catch (error) {
      console.error('Failed to produce message:', error);
    }
  }

  async disconnectProducer() {
    try {
      console.log("Disconnecting producer...");
      console.log("Producer disconnected successfully.");
    } catch (error) {
      console.error('Failed to disconnect producer:', error);
    }
  }

  async connectProducer() {
    try {
      console.log("Connecting producer...");
      await this.redis.ping();
      console.log("Producer connected successfully.");
    } catch (error) {
      console.error('Failed to connect producer:', error);
    }
  }

  async disconnect() {
    try {
      for (const [topic] of this.subscribers) {
        await this.disconnectConsumer(topic);
      }
      this.redis.disconnect();
      console.log("Redis client disconnected.");
    } catch (error) {
      console.error('Failed to disconnect Redis client:', error);
    }
  }
}
