import Redis from "ioredis";

export const redisSubscriber = new Redis("redis://localhost:6379");

export const latestPrices: Record<string, { price: number, decimal: number }> = {};

export async function RedisSubscriber() {
  try {
    await redisSubscriber.subscribe("asset_prices", () => {
      console.log("Subscribed to asset prices");
    });

    redisSubscriber.on("message", (_, message) => {

      const data = JSON.parse(message);
      latestPrices[data.asset], {
        price: data.price,
        decimal: data.decimal,
      }

    });
  } catch (err) {
    console.log("error subscribing to asset_prices")
  }
}


