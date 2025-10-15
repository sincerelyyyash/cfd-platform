import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <div className="relative isolate">
      <section className="w-full px-4 pt-8 sm:pt-12">
        <div className="mx-auto w-full max-w-6xl py-12 sm:py-16">
          <h1 className="bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text text-left text-4xl font-bold leading-[1.1] tracking-tight text-transparent sm:text-6xl">
            The best trading experience for crypto.
          </h1>
          <p className="mt-5 max-w-2xl text-left text-sm text-zinc-400 sm:text-base">
            A clean, focused terminal for trading. Live prices, lightweight charts, and effortless order flow—so you can stay in the zone.
          </p>

          <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:gap-4">
            <Link href="/trading" aria-label="Start trading">
              <Button className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900/30 hover:bg-neutral-800/40 border border-neutral-800/50 text-zinc-200 hover:text-zinc-100 transition-all duration-200 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] focus-visible:ring-2 focus-visible:ring-neutral-700 focus-visible:outline-none">
                Try the Terminal
              </Button>
            </Link>
            <Link href="/signup" aria-label="Create account">
              <Button className="px-4 py-2 bg-neutral-900/30 hover:bg-neutral-800/40 border border-neutral-800/50 text-zinc-200 hover:text-zinc-100 transition-all duration-200 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] focus-visible:ring-2 focus-visible:ring-neutral-700 focus-visible:outline-none">
                Create Account
              </Button>
            </Link>
          </div>

          <div className="mt-12 max-w-4xl grid grid-cols-1 gap-6 sm:grid-cols-2">
            <section
              role="region"
              aria-labelledby="card-terminal-title"
              className="group rounded-xl border border-neutral-800/60 bg-neutral-900/30 p-5 sm:p-6 text-zinc-100 backdrop-blur-md transition-all hover:border-neutral-700 hover:bg-neutral-900/40 shadow-[0_10px_30px_rgba(0,0,0,0.25)] focus-within:ring-2 focus-within:ring-neutral-700"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs font-medium tracking-wider text-zinc-400 uppercase">TradePrime • Terminal</p>
                  <h3 id="card-terminal-title" className="mt-2 text-lg sm:text-xl font-semibold text-zinc-100">Trade crypto with confidence</h3>
                </div>
                <div className="inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-lg sm:rounded-xl border border-neutral-800/60 bg-neutral-900/30">
                  <Image src="/Bitcoin.png" alt="Terminal icon" width={24} height={24} className="opacity-90" />
                </div>
              </div>
              <p className="mt-3 text-sm text-zinc-300">
                Zero distractions, live prices, and fast order tickets. Built for clarity and speed.
              </p>
              <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link href="/trading" aria-label="Open trading terminal">
                  <Button className="w-full sm:w-auto px-3 py-2 bg-neutral-900/30 hover:bg-neutral-800/40 border border-neutral-800/60 text-zinc-200 hover:text-zinc-100 transition-all duration-200 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] focus-visible:ring-2 focus-visible:ring-neutral-700">Open Terminal</Button>
                </Link>
                <Link href="#features" aria-label="Learn more about features" className="text-sm">
                  <Button variant="ghost" className="w-full sm:w-auto text-zinc-300 hover:text-zinc-100 focus-visible:ring-2 focus-visible:ring-neutral-700">Learn more</Button>
                </Link>
              </div>
            </section>

            <section
              role="region"
              aria-labelledby="card-data-title"
              className="group rounded-xl border border-neutral-800/60 bg-neutral-900/30 p-5 sm:p-6 text-zinc-100 backdrop-blur-md transition-all hover:border-neutral-700 hover:bg-neutral-900/40 shadow-[0_10px_30px_rgba(0,0,0,0.25)] focus-within:ring-2 focus-within:ring-neutral-700"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs font-medium tracking-wider text-zinc-400 uppercase">Market Data • Websocket</p>
                  <h3 id="card-data-title" className="mt-2 text-lg sm:text-xl font-semibold text-zinc-100">Stream prices in real time</h3>
                </div>
                <div className="inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-lg sm:rounded-xl border border-neutral-800/60 bg-neutral-900/30">
                  <Image src="/file.svg" alt="Market data icon" width={24} height={24} className="opacity-90" />
                </div>
              </div>
              <p className="mt-3 text-sm text-zinc-300">
                Subscribe to BTC, ETH, SOL ticks and depth over a low‑latency WS feed.
              </p>
              <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link href="#docs" aria-label="View documentation">
                  <Button className="w-full sm:w-auto px-3 py-2 bg-neutral-900/30 hover:bg-neutral-800/40 border border-neutral-800/60 text-zinc-200 hover:text-zinc-100 transition-all duration-200 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] focus-visible:ring-2 focus-visible:ring-neutral-700">View Docs</Button>
                </Link>
                <Link href="#pricing" aria-label="View pricing" className="text-sm">
                  <Button variant="ghost" className="w-full sm:w-auto text-zinc-300 hover:text-zinc-100 focus-visible:ring-2 focus-visible:ring-neutral-700">Pricing</Button>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}


