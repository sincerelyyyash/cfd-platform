"use client";

import { useEffect, useState } from "react";

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
    <div className="pointer-events-none fixed inset-0 z-50 flex items-start justify-end p-4">
      <div className="flex w-full max-w-sm flex-col gap-2">
        {messages.map((m) => {
          const color =
            m.type === "success"
              ? "bg-emerald-500/10 text-emerald-200 border-emerald-600/40"
              : m.type === "error"
              ? "bg-rose-500/10 text-rose-200 border-rose-600/40"
              : "bg-neutral-800/70 text-zinc-200 border-neutral-700/60";
          return (
            <div
              key={m.id}
              role="status"
              aria-live="polite"
              className={`pointer-events-auto overflow-hidden rounded-xl border ${color} shadow-[0_8px_24px_rgba(0,0,0,0.6)] backdrop-blur-sm`}
            >
              <div className="flex items-start gap-3 p-3">
                <div className="flex-1">
                  <div className="text-sm font-semibold">{m.title}</div>
                  {m.description ? (
                    <div className="mt-0.5 text-xs text-zinc-400">{m.description}</div>
                  ) : null}
                </div>
                <button
                  aria-label="Dismiss notification"
                  className="rounded-md p-1 text-xs text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                  onClick={() =>
                    setMessages((prev) => prev.filter((x) => x.id !== m.id))
                  }
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


