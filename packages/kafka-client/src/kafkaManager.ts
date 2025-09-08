import { Kafka, type Message, type Admin, type AdminConfig, type EachMessagePayload, type Producer, type KafkaConfig, type ConsumerConfig } from 'kafkajs';


export class KafkaManager {
  private static instance: KafkaManager;


  private kafka: Kafka;
  private admin: Admin;
  private producer: Producer;
  private consumers: Map<string, any> = new Map();


  constructor(kafkaConfig: KafkaConfig, adminConfig?: AdminConfig) {
    this.kafka = new Kafka(kafkaConfig);
    this.admin = this.kafka.admin(adminConfig);
    this.producer = this.kafka.producer();
  }

  public static getInstance(kafkaConfig: KafkaConfig, adminConfig?: AdminConfig) {
    if (!KafkaManager.instance) {
      KafkaManager.instance = new KafkaManager(kafkaConfig, adminConfig);
    }
    return KafkaManager.instance;
  }

  async connectAdmin() {
    try {
      console.log('Connecting Kafka admin...');
      await this.admin.connect();
      console.log('Kafka admin connected.');
    } catch (error) {
      console.error('Failed to connect Kafka admin:', error);
    }
  }

  async disconnectAdmin() {
    try {
      console.log('Disconnecting Kafka admin...');
      await this.admin.disconnect();
      console.log('Kafka admin disconnected.');
    } catch (error) {
      console.error('Failed to disconnect Kafka admin:', error);
    }
  }

  async topicExists(topic: string): Promise<boolean> {
    try {
      const topics = await this.admin.listTopics();
      return topics.includes(topic);
    } catch (error) {
      console.error("Failed to check if topic exists:", error);
      return false;
    }
  }

  async initializeConsumer(topic: string, groupId: string, eachMessageHandler: (payload: EachMessagePayload) => Promise<void>) {
    try {
      const consumerConfig: ConsumerConfig = { groupId: groupId };

      const consumer = this.kafka.consumer(consumerConfig);
      console.log(`Connecting Kafka consumer for topic: ${topic}`);

      await consumer.connect();
      console.log(`Kafka consumer connected for topic: ${topic}`);

      await consumer.subscribe({ topic, fromBeginning: true });
      console.log(`Subscribed to topic ${topic}`);

      await consumer.run({
        eachMessage: async (payload) => {
          await eachMessageHandler(payload);
        },
      });

      this.consumers.set(topic, consumer);

    } catch (error) {
      console.error('Failed to initialize Kafka consumer:', error);
    }
  }

  async disconnectConsumer(topic: string) {
    const consumer = this.consumers.get(topic);

    if (consumer) {
      try {
        console.log(`Disconnecting Kafka consumer for topic: ${topic}`);

        await consumer.disconnect();

        console.log(`Kafka consumer disconnected for topic: ${topic}`);
        this.consumers.delete(topic);

      } catch (error) {
        console.error(`Failed to disconnect Kafka consumer for topic: ${topic}`, error);
      }

    } else {
      console.log(`No consumer found for topic: ${topic}`);
    }
  }


  async createTopics(topicConfig: { topic: string; numPartitions: number; replicationFactor: number }[]) {
    try {
      const result = await this.admin.createTopics({
        topics: topicConfig,
        timeout: 30000,
        waitForLeaders: true,
      });
      if (result) {
        console.log('Kafka topics created successfully.');
      } else {
        console.log('Kafka topics were already created.');
      }
    } catch (error) {
      console.error('Failed to create Kafka topics:', error);
    }
  }

  async deleteTopics(topics: string[]) {
    try {
      console.log('Deleting Kafka topics:', topics);
      await this.admin.deleteTopics({
        topics: topics,
        timeout: 30000,
      });
      console.log('Kafka topics deleted successfully.');
    } catch (error) {
      console.error('Failed to delete Kafka topics:', error);
    }
  }

  async initializeProducer(topic: string, key: string, data: any) {
    try {
      const msg: Message = {
        key: key,
        value: JSON.stringify(data)
      }
      await this.producer.send({
        topic: topic,
        messages: [msg]
      })
      console.log(`Message sent to topic ${topic}`);
    } catch (error) {
      console.error('Failed to initialize producer:', error);
    }
  }


  async disconnectProducer() {
    try {
      console.log("Disconnecting producer...");
      await this.producer.disconnect();
      console.log("Producer disconnected successfully.");
    } catch (error) {
      console.error('Failed to disconnect Kafka producer:', error);
    }
  } async connectProducer() {
    try {
      console.log("Connecting producer...");
      await this.producer.connect();
      console.log("Producer connected successfully.");
    } catch (error) {
      console.error('Failed to connect Kafka producer:', error);
    }
  }

}
