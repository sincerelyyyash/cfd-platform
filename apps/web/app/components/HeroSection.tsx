"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 h-[100vh] flex items-center justify-center text-center bg-neutral-950">
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-60" aria-hidden />
      </div>

      <div className="relative z-10 space-y-5 sm:space-y-6">
        {/* Small badge */}
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-neutral-800/60 bg-neutral-900/40 px-3 py-1 text-[10px] font-medium tracking-wider text-zinc-300 sm:text-xs shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-zinc-400 shadow-[0_0_0_2px_rgba(244,244,245,0.18)]" aria-hidden />
          Built for active crypto traders
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-zinc-100">
          Trade with live depth, pro charts, positions, and instant execution
        </h1>
        <p className="mx-auto max-w-2xl text-sm sm:text-base md:text-lg text-zinc-400 leading-relaxed">
          A calm, layered interface for perpetuals and margin — see liquidity, manage risk, and execute with confidence.
        </p>

        <div className="flex items-center justify-center gap-3 sm:gap-4 pt-2">
          <Link href="/signup" aria-label="Get started">
            <Button variant="secondary" className="px-4 sm:px-6 h-11 text-sm rounded-xl">
              Start trading
            </Button>
          </Link>
          <Link href="/trading" aria-label="Open trading">
            <Button variant="ghost" className="px-4 sm:px-6 h-11 text-sm rounded-xl">
              Explore platform
            </Button>
          </Link>
        </div>

        {/* Compact trust/metrics row */}
        <ul className="mx-auto mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-zinc-400 sm:text-sm">
          <li className="inline-flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-zinc-500" aria-hidden />
            99.99% uptime
          </li>
          <li className="inline-flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-zinc-500" aria-hidden />
            24ms latency
          </li>
          <li className="inline-flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-zinc-500" aria-hidden />
            Live market depth
          </li>
        </ul>
      </div>
    </section>
  );
}


