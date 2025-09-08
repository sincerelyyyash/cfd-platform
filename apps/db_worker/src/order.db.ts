import { prisma } from "@repo/database";

type OrderType = {
  id: string,
  userId: string,
  type: "long" | "short",
  status: "open" | "closed" | "pending"
  asset: string,
  quantity: number,
  entryPrice: number,
  leverage: number,
  margin: number,
  exitPrice: number,
  pnL: number,
  stopLoss?: number,
  takeProfit: number,
  liquidated?: boolean,
}

export const storeClosedOrder = async (data: OrderType) => {

  if (!data) {
    return console.error("Error in data")
  }

  try {
    await prisma.existingTrade.create({
      data: {
        id: data.id,
        userId: data.userId,
        type: data.type,
        status: data.status,
        assetId: data.asset,
        quantity: data.quantity,
        entryPrice: data.entryPrice,
        exitPrice: data.exitPrice,
        margin: data.margin,
        leverage: data.leverage,
        stopLoss: data.stopLoss,
        takeProfit: data.takeProfit,
        liquidated: data.liquidated,
        pnL: data.pnL,
      },

    })
  } catch (err) {
    return console.error("Error storing order");
  }

} 
