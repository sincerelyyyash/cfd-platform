"use client";

import { useEffect } from "react";
import { useTradeStore } from "@/store/useTradeStore";

export function useWebSocket() {
  const updateTrade = useTradeStore((s) => s.updateTrade);
  const webSocketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL ?? "ws://localhost:8080"

  useEffect(() => {
    if (typeof window === "undefined") return;
    const socket = new WebSocket(webSocketUrl);

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const toUsdt = (symbol: string) => {
          if (!symbol) return symbol;
          if (symbol.includes("_")) {
            const base = symbol.split("_")[0];
            return `${base}USDT`;
          }
          if (symbol.endsWith("USDT")) return symbol;
          return `${symbol}USDT`;
        };

        const handleOne = (tick: any) => {
          if (!tick || !tick.asset) return;
          const asset = toUsdt(String(tick.asset));
          const trade = {
            event_type: "price_update",
            event_time: Date.now(),
            asset,
            price: Number(tick.price ?? tick.ask ?? 0),
            quantity: 0,
            trade_time: Date.now(),
            ask: Number(tick.ask ?? tick.price ?? 0),
            bid: Number(tick.bid ?? tick.price ?? 0),
            decimals: Number(tick.decimals ?? tick.decimal ?? 4),
          };
          if (trade.asset && (Number.isFinite(trade.ask) || Number.isFinite(trade.price))) {
            updateTrade(trade as any);
          }
        };

        if (Array.isArray(data?.price_updates)) {
          data.price_updates.forEach(handleOne);
          return;
        }
        if (data.asset) {
          handleOne(data);
          return;
        }
      } catch (err) {
        console.error("Failed to parse WS message", err);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      socket.close();
    };
  }, [updateTrade]);
}
