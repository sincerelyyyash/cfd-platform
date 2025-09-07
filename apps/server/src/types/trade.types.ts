import { z } from "zod";

export const tradeOpenSchema = z.object({
  type: z.enum(["long", "short"]),
  status: z.enum(["open", "closed", "pending"]),
  asset: z.string(),
  quantity: z.number(),
  entryPrice: z.number(),
  leverage: z.number().optional(),
  margin: z.number().optional(),
  exitPrice: z.number().optional(),
  slippage: z.number().optional(),
  stopLoss: z.number().optional(),
  takeProfit: z.number().optional(),
})

export const tradeCloseSchema = z.object({
  orderId: z.string(),
})
