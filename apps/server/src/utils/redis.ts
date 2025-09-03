import Redis from "ioredis";

export const redis = new Redis("redis://localhost:6379");

export async function RedisSubscriber(channelName: string) {
  try {
    await redis.subscribe(channelName, () => {
      console.log("Subscribed to asset prices");
    });

    redis.on("message", (_, message) => {


      console.log(JSON.parse(message))
    });
  } catch (err) {
    console.log("error subscribing to asset_prices")
  }
}
