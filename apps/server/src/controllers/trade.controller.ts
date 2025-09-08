import type { Request, Response } from "express";
import { tradeOpenSchema, tradeCloseSchema } from "../types/trade.types";
import { v4 as uuidv4 } from "uuid";
import { KafkaRequest } from "@repo/kafka-client/request";
import { requestProducer } from "../utils/producer";
import { waitForResponse } from "../utils/consumer";


export const sendRequestAndWait = async (id: string, request: any, timeout = 10000) => {
  await new Promise((resolve) => setImmediate(resolve));

  const responsePromise = waitForResponse(id, timeout);

  await requestProducer(id, request);

  return responsePromise;
};


export const tradeOpen = async (req: Request, res: Response) => {
  const parsed = tradeOpenSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid inputs, please try again."
    })
  }
  const userId = (req as any).user.id;
  const data = parsed.data;
  const trade = {
    actionType: "open-order",
    id: uuidv4(),
    userId: userId,
    type: data.type,
    status: data.status,
    asset: data.asset,
    quantity: data.quantity,
    entryPrice: data.entryPrice,
    leverage: data?.leverage,
    margin: data?.margin,
    stopLoss: data?.stopLoss,
    takeProfit: data?.takeProfit,
    slippage: data?.slippage,
  }
  try {
    const req_id = uuidv4()
    const response = await sendRequestAndWait(
      req_id, new KafkaRequest({
        service: "trade",
        action: "trade-open",
        data: trade,
        message: "Open trade order."
      }))

    return res.json({ response });

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
    actionType: "close-order",
    orderId: orderId,
    status: "closed"
  }

  try {
    const req_id = uuidv4()
    const response = await sendRequestAndWait(
      req_id, new KafkaRequest({
        service: "trade",
        action: "trade-close",
        data: trade,
        message: "Close trade order."

      })
    )
    return res.json({ response });

  } catch (err) {
    return res.status(500).json({
      message: "Internal server errror",
      error: (err as Error).message,
    })
  }

}
