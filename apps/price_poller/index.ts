import WebSocket from "ws";
import { connectProducer, messageProducer } from "@repo/kafka-client/index";

const ws = new WebSocket("wss://ws.backpack.exchange");
connectProducer();


const topic = "trade_stream";
const latestPrices: Record<string, { price: number; decimal: number }> = {};

ws.on("open", () => {
  console.log("Connected to backpack exchange");

  const subscribeMessage = {
    method: "SUBSCRIBE",
    params: [
      "bookTicker.BTC_USDC",
      "bookTicker.ETH_USDC",
      "bookTicker.SOL_USDC",
    ],
    id: 1,
  };

  ws.send(JSON.stringify(subscribeMessage));
});

ws.on("message", (data: any) => {
  try {
    const parsed = JSON.parse(data.toString());
    const ticker = parsed?.data;

    if (!ticker) return;

    const [asset, _quote] = ticker.s.split("_");
    const price = parseFloat(ticker.a);


    latestPrices[asset] = {
      price: Math.floor(price * 10 ** 4),
      decimal: 4,
    };
  } catch (err) {
    console.error("Failed to parse message", err);
  }
});

setInterval(() => {
  if (Object.keys(latestPrices).length === 0) return;

  const snapshot = Object.entries(latestPrices).map(([asset, data]) => ({
    asset,
    price: data.price,
    decimal: data.decimal,
  }));

  messageProducer(topic,
    "asset_prices",
    JSON.stringify({ price_updates: snapshot }),
  );
}, 100);

ws.on("close", () => {
  console.log("Connection closed");
});

