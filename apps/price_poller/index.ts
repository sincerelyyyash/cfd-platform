import WebSocket, { WebSocketServer } from "ws";
import { connectProducer, messageProducer } from "@repo/kafka-client/index";

const ws = new WebSocket("wss://ws.backpack.exchange");
connectProducer();


const topic = "trade_stream";
type Latest = { bid: number; ask: number; decimals: number };
const latestPrices: Record<string, Latest> = {};

const WS_PORT = Number(process.env.WS_PORT ?? 8080);
const wss = new WebSocketServer({ port: WS_PORT });

wss.on("listening", () => {
  console.log(`Price WebSocket server listening on ws://localhost:${WS_PORT}`);
});

wss.on("connection", (socket) => {
  socket.send(JSON.stringify({ type: "hello", message: "connected" }));
});

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
    const ask = parseFloat(ticker.a);
    const bid = parseFloat(ticker.b);
    const mid = (ask + bid) / 2;
    const half = 0.01 / 2;
    const synthBid = mid * (1 - half);
    const synthAsk = mid * (1 + half);

    latestPrices[asset] = {
      ask: Math.floor(synthAsk * 10 ** 4),
      bid: Math.floor(synthBid * 10 ** 4),
      decimals: 4,
    };
  } catch (err) {
    console.error("Failed to parse message", err);
  }
});

setInterval(() => {
  if (Object.keys(latestPrices).length === 0) return;

  Object.entries(latestPrices).forEach(([asset, data]) => {
    const payload = JSON.stringify({
      asset,
      price: data.ask,
      bid: data.bid,
      ask: data.ask,
      decimals: data.decimals,
    });
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  });

  const snapshot = Object.entries(latestPrices).map(([asset, data]) => ({
    asset,
    price: data.ask,
    decimal: data.decimals,
  }));

  messageProducer(topic,
    "asset_prices",
    JSON.stringify({ price_updates: snapshot }),
  );
}, 100);

ws.on("close", () => {
  console.log("Connection closed");
});

