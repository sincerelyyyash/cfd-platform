"use client";

import { useEffect } from "react";
import { useTradeStore } from "@/store/useTradeStore";

export function useWebSocket() {
  const updateTrade = useTradeStore((s) => s.updateTrade);
  const webSocketUrl = process.env.WEBSOCKET_URL ?? "ws://localhost:8080"

  useEffect(() => {
    const socket = new WebSocket(webSocketUrl);

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.asset && data.price) {
          updateTrade(data);
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
