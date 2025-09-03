import type { Request, Response } from "express";
import { tradeOpenSchema, tradeCloseSchema } from "../types/trade.types";
import { addToQueue } from "../utils/kafkaProducer";
import { uuidv4 } from "zod";


const topic = "trades"


export const tradeOpen = async (req: Request, res: Response) => {
  const parsed = tradeOpenSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid inputs, please try again."
    })
  }
  const userId = (req as any).user.userId;
  const data = parsed.data;
  const trade = {
    id: uuidv4(),
    userId: userId,
    type: data.type,
    status: data.status,
    asset: data.asset,
    entryPrice: data.entryPrice,
    leverage: data?.leverage,
    margin: data?.margin,
    stopLoss: data?.stopLoss,
    takeProfit: data?.takeProfit,
    slippage: data?.slippage,
  }
  try {
    await addToQueue(topic, [
      { key: trade.id, value: trade }
    ])
    return res.status(200).json({
      message: "Order processed"
    })
  } catch (err) {
    return res.status(500).json({
      message: "Failed to process your trade.",
      error: (err as Error).message
    })
  }
};



export const tradeClose = async (req: Request, res: Response) => {
  const parsed = tradeCloseSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid inputs, please try again."
    })
  }

  const orderId = parsed.data.orderId;

  const trade = {
    orderId: orderId,
    status: "closed"
  }

  try {
    await addToQueue(topic, [
      { key: orderId, value: trade }
    ])
    return res.status(200).json({
      message: "Order processed",
    })
  } catch (err) {
    return res.status(500).json({
      message: "Internal server errror",
      error: (err as Error).message,
    })
  }

}
