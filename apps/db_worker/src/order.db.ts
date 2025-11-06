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
    console.log(`Closed order ${data.id} stored in database`);
  } catch (err) {
    console.error("Error storing order:", err);
  }

}

export const getClosedOrdersFromDB = async (userId: string) => {
  try {
    const closedOrders = await prisma.existingTrade.findMany({
      where: {
        userId: userId,
        status: "closed",
      },
      orderBy: {
        id: "desc", 
      },
    });

    const transformedOrders = closedOrders.map(order => ({
      id: order.id,
      userId: order.userId,
      type: order.type,
      status: order.status,
      asset: order.assetId, 
      quantity: order.quantity,
      entryPrice: order.entryPrice,
      exitPrice: order.exitPrice,
      pnL: order.pnL,
      leverage: order.leverage || undefined,
      margin: order.margin || undefined,
      stopLoss: order.stopLoss || undefined,
      takeProfit: order.takeProfit || undefined,
      liquidated: order.liquidated || undefined,
    }));

    console.log(`Retrieved ${transformedOrders.length} closed orders from database for user ${userId}`);
    return transformedOrders;
  } catch (err) {
    console.error("Error fetching closed orders from database:", err);
    throw err;
  }
} 
