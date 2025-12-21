import type { BenchmarkConfig } from "./config";

export type OpenOrderPayload = {
  type: "long" | "short";
  status: "open";
  asset: string;
  quantity: number;
  entryPrice: number;
  leverage: number;
  slippage?: number;
  stopLoss?: number;
  takeProfit?: number;
};

export type CloseOrderPayload = {
  orderId: string;
};

type Rng = () => number;

const createRng = (seed: number): Rng => {
  let state = seed % 2147483647;
  if (state <= 0) {
    state += 2147483646;
  }
  return () => {
    state = (state * 16807) % 2147483647;
    return state / 2147483647;
  };
};

const normalizeAssetSymbol = (symbol: string) => {
  const trimmed = symbol.trim().toUpperCase();
  if (trimmed.endsWith("USDT") || trimmed.endsWith("USDC")) {
    return trimmed.slice(0, -4);
  }
  return trimmed;
};

export const createOrderFactory = (config: BenchmarkConfig) => {
  const rng = createRng(config.seed);
  const nextBetween = (min: number, max: number) => min + rng() * (max - min);
  const choose = <T>(items: T[]): T => items[Math.floor(rng() * items.length)];

  return () => {
    const quantity = Number(nextBetween(config.minQuantity, config.maxQuantity).toFixed(4));
    const leverage = Number(nextBetween(config.minLeverage, config.maxLeverage).toFixed(2));
    const entryPrice = Number((nextBetween(100, 70000)).toFixed(2));
    const direction = choose(["long", "short"]) as "long" | "short";
    const asset = normalizeAssetSymbol(choose(config.assets));

    const payload: OpenOrderPayload = {
      type: direction,
      status: "open",
      asset,
      quantity,
      entryPrice,
      leverage,
      slippage: Number(nextBetween(0, 5).toFixed(2)),
      stopLoss: Number(nextBetween(0.5, 5).toFixed(2)),
      takeProfit: Number(nextBetween(0.5, 10).toFixed(2)),
    };

    return payload;
  };
};

export const buildClosePayload = (orderId: string): CloseOrderPayload => ({
  orderId,
});

