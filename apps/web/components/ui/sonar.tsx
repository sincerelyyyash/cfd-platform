"use client";

import { useEffect, useState } from "react";
import { IconCheck, IconX, IconInfoCircle } from "@tabler/icons-react";

type SonarType = "info" | "success" | "error";

type SonarMessage = {
  id: number;
  type: SonarType;
  title: string;
  description?: string;
};

// Simple singleton event bus for notifications
type Listener = (msg: Omit<SonarMessage, "id">) => void;
const listeners: Listener[] = [];

export const sonar = {
  info: (title: string, description?: string) => {
    listeners.forEach((l) => l({ type: "info", title, description }));
  },
  success: (title: string, description?: string) => {
    listeners.forEach((l) => l({ type: "success", title, description }));
  },
  error: (title: string, description?: string) => {
    listeners.forEach((l) => l({ type: "error", title, description }));
  },
};

export function Sonar() {
  const [messages, setMessages] = useState<SonarMessage[]>([]);

  useEffect(() => {
    const add: Listener = (msg) => {
      setMessages((prev) => {
        const id = (prev.at(-1)?.id ?? 0) + 1;
        return [...prev, { id, ...msg }];
      });
    };
    listeners.push(add);
    return () => {
      const idx = listeners.indexOf(add);
      if (idx >= 0) listeners.splice(idx, 1);
    };
  }, []);

  useEffect(() => {
    if (messages.length === 0) return;
    const timers = messages.map((m) =>
      setTimeout(() => {
        setMessages((prev) => prev.filter((x) => x.id !== m.id));
      }, 3500)
    );
    return () => timers.forEach(clearTimeout);
  }, [messages]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] flex items-start justify-end p-4 sm:p-6">
      <div className="flex w-full max-w-sm flex-col gap-2">
        {messages.map((m) => {
          const borderColor =
            m.type === "success"
              ? "border-l-emerald-500"
              : m.type === "error"
                ? "border-l-rose-500"
                : "border-l-blue-500";

          const icon =
            m.type === "success" ? (
              <IconCheck className="h-5 w-5 text-emerald-500" />
            ) : m.type === "error" ? (
              <IconX className="h-5 w-5 text-rose-500" />
            ) : (
              <IconInfoCircle className="h-5 w-5 text-blue-500" />
            );

          return (
            <div
              key={m.id}
              role="status"
              aria-live="polite"
              className={`pointer-events-auto relative overflow-hidden rounded-[2px] border border-white/5 border-l-[3px] bg-[#09090b] shadow-2xl shadow-black/50 backdrop-blur-md ${borderColor}`}
            >
              <div className="flex items-start gap-3 p-4">
                <div className="mt-0.5 shrink-0">{icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-zinc-100 font-space tracking-tight">{m.title}</div>
                  {m.description ? (
                    <div className="mt-1 text-xs text-zinc-400 font-medium leading-relaxed">{m.description}</div>
                  ) : null}
                </div>
                <button
                  aria-label="Dismiss notification"
                  className="rounded-sm p-1 text-zinc-500 hover:bg-white/5 hover:text-zinc-300 transition-colors"
                  onClick={() =>
                    setMessages((prev) => prev.filter((x) => x.id !== m.id))
                  }
                >
                  <IconX className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


