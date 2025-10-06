import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <div className="relative isolate">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_50%_0%,rgba(37,99,235,0.12)_0%,transparent_60%)]" />

      <section className="w-full px-4 pt-8 sm:pt-12">
        <div className="mx-auto w-full max-w-6xl py-12 sm:py-16">
          

          <h1 className="bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text text-left text-4xl font-bold leading-[1.1] tracking-tight text-transparent sm:text-6xl">
            The best trading experience for crypto.
          </h1>
          <p className="mt-5 max-w-2xl text-left text-sm text-slate-400 sm:text-base">
            A clean, focused terminal for trading. Live prices, lightweight charts, and effortless order flow—so you can stay in the zone.
          </p>

          <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row">
            <Link href="/trading" aria-label="Start trading">
              <Button className="bg-white text-neutral-900 hover:bg-neutral-100 focus-visible:ring-neutral-600">
                Try the Terminal
              </Button>
            </Link>
            <Link href="/signup" aria-label="Create account">
              <Button className="bg-black text-white hover:bg-neutral-900 focus-visible:ring-neutral-600">
                Create Account
              </Button>
            </Link>
          </div>

          <div className="mt-12 max-w-4xl grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="group rounded-2xl border border-neutral-400/10 bg-black/20 p-5 sm:p-6 text-slate-100 backdrop-blur-md transition-colors hover:border-neutral-400/20 hover:bg-black/25 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
              <div className="text-xs font-medium tracking-wider text-slate-400">TRADEPRIME • TERMINAL</div>
              <h3 className="mt-3 text-xl font-semibold text-white">Trade crypto with confidence</h3>
              <p className="mt-2 text-sm text-slate-300">
                Zero distractions, live prices, and fast order tickets. Built for clarity and speed.
              </p>
              <div className="mt-5 flex items-center gap-3">
                <Link href="/trading" aria-label="Open trading terminal">
                  <Button variant="black">Open Terminal</Button>
                </Link>
                <Link href="#features" aria-label="Learn more about features" className="text-sm">
                  <Button variant="ghost">Learn more</Button>
                </Link>
              </div>
              <div className="mt-6 flex justify-end">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl border border-neutral-400/10 bg-black/20 backdrop-blur-sm group-hover:border-neutral-400/20">
                  <Image src="/Bitcoin.png" alt="TradePrime Terminal" width={28} height={28} className="opacity-90" />
                </div>
              </div>
            </div>

            <div className="group rounded-2xl border border-white/10 bg-slate-900/40 p-5 sm:p-6 text-slate-100 backdrop-blur-md transition-colors hover:border-white/20 hover:bg-slate-900/50">
              <div className="text-xs font-medium tracking-wider text-slate-400">MARKET DATA • WEBSOCKET</div>
              <h3 className="mt-3 text-xl font-semibold text-white">Stream prices in real time</h3>
              <p className="mt-2 text-sm text-slate-300">
                Subscribe to BTC, ETH, SOL ticks and depth over a low‑latency WS feed.
              </p>
              <div className="mt-5 flex items-center gap-3">
                <Link href="#docs" aria-label="View documentation">
                  <Button variant="white">View Docs</Button>
                </Link>
                <Link href="#pricing" aria-label="View pricing" className="text-sm">
                  <Button variant="ghost">Pricing</Button>
                </Link>
              </div>
              <div className="mt-6 flex justify-end">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm group-hover:border-white/20">
                  <Image src="/file.svg" alt="Market Data API" width={28} height={28} className="opacity-90" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


