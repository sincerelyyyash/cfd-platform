import { OrderStore } from "../OrderStore";

type Orders = {
  id: string,
  userId: string,
  type: "long" | "short",
  status: "open" | "closed" | "pending"
  asset: string,
  entryPrice: number,
  leverage?: number,
  margin?: number,
  exitPrice?: number,
  pnL?: number,
  slippage?: number,
}

const orderStore = OrderStore.getInstance();

export const createTrade = async (data: any) => {
  const { type, status, asset, entryPrice, leverage, margin, exitPrice, slippage, stopLoss, takeProfit } = data;

  if (type === "long" && leverage <= 1) {

  }

}
