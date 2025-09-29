"use client";

import { useWebSocket } from "@/hooks/useWebSocket";

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  useWebSocket(); // ? only runs in client
  return <>{children}</>;
}
