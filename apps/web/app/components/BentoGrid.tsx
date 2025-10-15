"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function BentoGrid() {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 16,
      scale: prefersReducedMotion ? 1 : 0.98,
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 220,
        damping: 26,
      },
    },
  };

  // Parent tile hover/focus variants to coordinate child animations
  const tileVariants = prefersReducedMotion
    ? {
        rest: { scale: 1, y: 0 },
        hover: { scale: 1, y: 0 },
      }
    : {
        rest: { scale: 1, y: 0 },
        hover: {
          scale: 1.02,
          y: -2,
          transition: { type: "spring", stiffness: 320, damping: 22 },
        },
      };

  // Child variants per tile content
  const growBars = prefersReducedMotion
    ? { rest: { scaleY: 1 }, hover: { scaleY: 1 } }
    : {
        rest: { scaleY: 1 },
        hover: { scaleY: 1.08, transition: { type: "spring", stiffness: 300, damping: 24 } },
      };

  const liftCard = prefersReducedMotion
    ? { rest: { y: 0, scale: 1 }, hover: { y: 0, scale: 1 } }
    : { rest: { y: 0, scale: 1 }, hover: { y: -3, scale: 1.01 } };

  const pulseDot = prefersReducedMotion
    ? { rest: { scale: 1 }, hover: { scale: 1 } }
    : { rest: { scale: 1 }, hover: { scale: 1.2, transition: { yoyo: 1, duration: 0.25 } } };

  const slideRow = prefersReducedMotion
    ? { rest: { x: 0 }, hover: { x: 0 } }
    : { rest: { x: 0 }, hover: { x: 2 } };

  const emphasize = prefersReducedMotion
    ? { rest: { opacity: 1 }, hover: { opacity: 1 } }
    : { rest: { opacity: 1 }, hover: { opacity: 1.08 } };
  return (
    <section className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 min-h-[100vh] pt-14 sm:pt-20 pb-24 flex bg-neutral-950">
      <div className="w-full">
      <motion.div
        className="relative z-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[140px] sm:auto-rows-[160px] gap-4 sm:gap-5"
        role="region"
        aria-label="Feature highlights"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Market Depth - primary tile (2x2) */}
        <motion.div
          className="relative col-span-1 sm:col-span-2 row-span-2 rounded-2xl bg-neutral-900/80 p-5 sm:p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_12px_30px_-20px_rgba(0,0,0,0.8),0_40px_80px_-40px_rgba(0,0,0,0.8)]"
          variants={{ ...itemVariants, ...tileVariants }}
          initial="rest"
          whileHover="hover"
          whileFocus="hover"
          whileTap={{ scale: prefersReducedMotion ? 1 : 0.995 }}
          tabIndex={0}
          aria-label="Live market depth tile"
        >
          <div className="absolute -top-px inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          <div className="flex items-start justify-between">
            <h3 className="text-lg sm:text-xl font-semibold">Live market depth</h3>
            <span className="text-xs text-zinc-400">BTC-PERP</span>
          </div>
          <p className="mt-1 text-sm text-zinc-400 leading-relaxed max-w-[48ch]">
            Layered visuals keep price action readable. Subtle contrast, clear focus.
          </p>
          {/* Depth placeholder bars */}
          <div className="mt-4 grid grid-cols-12 gap-1">
            <motion.div className="col-span-5 h-16 rounded-md bg-emerald-400/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_10px_20px_-14px_rgba(0,0,0,0.7)] origin-bottom" variants={growBars} />
            <motion.div className="col-span-7 h-16 rounded-md bg-rose-400/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_10px_20px_-14px_rgba(0,0,0,0.7)] origin-bottom" variants={growBars} />
            <motion.div className="col-span-4 h-3 rounded bg-emerald-300/20 origin-left" variants={emphasize} />
            <motion.div className="col-span-8 h-3 rounded bg-rose-300/20 origin-right" variants={emphasize} />
            <motion.div className="col-span-6 h-3 rounded bg-emerald-300/20 origin-left" variants={emphasize} />
            <motion.div className="col-span-6 h-3 rounded bg-rose-300/20 origin-right" variants={emphasize} />
          </div>
        </motion.div>

        {/* Positions Snapshot (2x1) */}
        <motion.div
          className="relative col-span-1 sm:col-span-2 row-span-1 rounded-2xl bg-neutral-900/70 p-5 sm:p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_26px_-20px_rgba(0,0,0,0.85),0_36px_72px_-42px_rgba(0,0,0,0.85)]"
          variants={{ ...itemVariants, ...tileVariants }}
          initial="rest"
          whileHover="hover"
          whileFocus="hover"
          whileTap={{ scale: prefersReducedMotion ? 1 : 0.995 }}
          tabIndex={0}
          aria-label="Positions snapshot tile"
        >
          <div className="absolute -top-px inset-x-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          <h3 className="text-lg sm:text-xl font-semibold">Positions at a glance</h3>
          <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
            <motion.div className="rounded-lg bg-neutral-900/60 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_20px_-16px_rgba(0,0,0,0.8)]" variants={liftCard}>
              <div className="text-zinc-400">Equity</div>
              <div className="mt-1 text-zinc-100 font-semibold">$124,530</div>
            </motion.div>
            <motion.div className="rounded-lg bg-neutral-900/60 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_20px_-16px_rgba(0,0,0,0.8)]" variants={liftCard}>
              <div className="text-zinc-400">Margin</div>
              <div className="mt-1 text-zinc-100 font-semibold">32.4%</div>
            </motion.div>
            <motion.div className="rounded-lg bg-neutral-900/60 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_20px_-16px_rgba(0,0,0,0.8)]" variants={liftCard}>
              <div className="text-zinc-400">Risk</div>
              <div className="mt-1 text-amber-300 font-semibold">Moderate</div>
            </motion.div>
          </div>
        </motion.div>

        {/* PnL Overview (1x1) */}
        <motion.div
          className="relative col-span-1 row-span-1 rounded-2xl bg-neutral-900/70 p-5 sm:p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_26px_-20px_rgba(0,0,0,0.85),0_36px_72px_-42px_rgba(0,0,0,0.85)]"
          variants={{ ...itemVariants, ...tileVariants }}
          initial="rest"
          whileHover="hover"
          whileFocus="hover"
          whileTap={{ scale: prefersReducedMotion ? 1 : 0.995 }}
          tabIndex={0}
          aria-label="PnL overview tile"
        >
          <div className="absolute -top-px inset-x-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          <h3 className="text-lg sm:text-xl font-semibold">PnL overview</h3>
          <div className="mt-3 flex items-end gap-1">
            <motion.div className="h-14 w-2 rounded bg-emerald-400/60 origin-bottom" variants={growBars} />
            <motion.div className="h-9 w-2 rounded bg-emerald-400/40 origin-bottom" variants={growBars} />
            <motion.div className="h-16 w-2 rounded bg-emerald-400/70 origin-bottom" variants={growBars} />
            <motion.div className="h-6 w-2 rounded bg-rose-400/40 origin-bottom" variants={growBars} />
            <motion.div className="h-10 w-2 rounded bg-emerald-400/50 origin-bottom" variants={growBars} />
            <motion.div className="h-4 w-2 rounded bg-rose-400/40 origin-bottom" variants={growBars} />
          </div>
          <p className="mt-2 text-sm text-zinc-400">7d: +$2,430 (≈+2.1%)</p>
        </motion.div>

        {/* Order Ticket (1x1) */}
        <motion.div
          className="relative col-span-1 row-span-1 rounded-2xl bg-neutral-900/60 p-5 sm:p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_22px_-18px_rgba(0,0,0,0.9),0_28px_60px_-44px_rgba(0,0,0,0.9)]"
          variants={{ ...itemVariants, ...tileVariants }}
          initial="rest"
          whileHover="hover"
          whileFocus="hover"
          whileTap={{ scale: prefersReducedMotion ? 1 : 0.995 }}
          tabIndex={0}
          aria-label="Quick order tile"
        >
          <div className="absolute -top-px inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <h3 className="text-lg sm:text-xl font-semibold">Quick order</h3>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <motion.button
              className="rounded-lg bg-emerald-500/15 text-emerald-200 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_18px_-14px_rgba(0,0,0,0.85)] hover:bg-emerald-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/30"
              aria-label="Buy market"
              whileHover={prefersReducedMotion ? undefined : { scale: 1.03 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
            >
              Buy
            </motion.button>
            <motion.button
              className="rounded-lg bg-rose-500/15 text-rose-200 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_18px_-14px_rgba(0,0,0,0.85)] hover:bg-rose-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/30"
              aria-label="Sell market"
              whileHover={prefersReducedMotion ? undefined : { scale: 1.03 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
            >
              Sell
            </motion.button>
          </div>
          <p className="mt-2 text-xs text-zinc-400">Market · 1x · BTC-PERP</p>
        </motion.div>

        {/* Funding & Fees (1x1) */}
        <motion.div
          className="relative col-span-1 row-span-1 rounded-2xl bg-neutral-900/65 p-5 sm:p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_9px_24px_-18px_rgba(0,0,0,0.9),0_30px_64px_-46px_rgba(0,0,0,0.9)]"
          variants={{ ...itemVariants, ...tileVariants }}
          initial="rest"
          whileHover="hover"
          whileFocus="hover"
          whileTap={{ scale: prefersReducedMotion ? 1 : 0.995 }}
          tabIndex={0}
          aria-label="Funding and fees tile"
        >
          <div className="absolute -top-px inset-x-0 h-px bg-gradient-to-r from-transparent via-white/22 to-transparent" />
          <h3 className="text-lg sm:text-xl font-semibold">Funding & fees</h3>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-zinc-400">Next funding</span>
            <span className="text-zinc-100">+0.012%</span>
          </div>
          <div className="mt-2 h-2 w-full rounded bg-white/5">
            <motion.div
              className="h-2 rounded bg-emerald-400/50"
              variants={prefersReducedMotion ? { rest: { width: "62%" }, hover: { width: "62%" } } : { rest: { width: "62%" }, hover: { width: "72%" } }}
            />
          </div>
        </motion.div>

        {/* System Status (1x1) */}
        <motion.div
          className="relative col-span-1 row-span-1 rounded-2xl bg-neutral-900/60 p-5 sm:p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_22px_-18px_rgba(0,0,0,0.9),0_28px_60px_-44px_rgba(0,0,0,0.9)]"
          variants={{ ...itemVariants, ...tileVariants }}
          initial="rest"
          whileHover="hover"
          whileFocus="hover"
          whileTap={{ scale: prefersReducedMotion ? 1 : 0.995 }}
          tabIndex={0}
          aria-label="Platform status tile"
        >
          <div className="absolute -top-px inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <h3 className="text-lg sm:text-xl font-semibold">Platform status</h3>
          <div className="mt-3 flex items-center gap-2 text-sm text-zinc-300">
            <motion.span className="inline-block h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_2px_rgba(16,185,129,0.25)]" aria-hidden variants={pulseDot} />
            All systems operational
          </div>
          <p className="mt-1 text-xs text-zinc-400">Latency: 24ms · Uptime: 99.99%</p>
        </motion.div>

        {/* Watchlist (1x1) */}
        <motion.div
          className="relative col-span-1 row-span-1 rounded-2xl bg-neutral-900/65 p-5 sm:p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_9px_24px_-18px_rgba(0,0,0,0.9),0_30px_64px_-46px_rgba(0,0,0,0.9)]"
          variants={{ ...itemVariants, ...tileVariants }}
          initial="rest"
          whileHover="hover"
          whileFocus="hover"
          whileTap={{ scale: prefersReducedMotion ? 1 : 0.995 }}
          tabIndex={0}
          aria-label="Watchlist tile"
        >
          <div className="absolute -top-px inset-x-0 h-px bg-gradient-to-r from-transparent via-white/22 to-transparent" />
          <h3 className="text-lg sm:text-xl font-semibold">Watchlist</h3>
          <div className="mt-3 space-y-2 text-sm">
            <motion.div className="flex items-center justify-between" variants={slideRow}>
              <span className="text-zinc-300">BTC</span>
              <span className="text-emerald-300">+1.2%</span>
            </motion.div>
            <motion.div className="flex items-center justify-between" variants={slideRow}>
              <span className="text-zinc-300">ETH</span>
              <span className="text-rose-300">-0.6%</span>
            </motion.div>
            <motion.div className="flex items-center justify-between" variants={slideRow}>
              <span className="text-zinc-300">SOL</span>
              <span className="text-emerald-300">+0.9%</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Open orders (1x1) */}
        <motion.div
          className="relative col-span-1 row-span-1 rounded-2xl bg-neutral-900/60 p-5 sm:p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_22px_-18px_rgba(0,0,0,0.9),0_28px_60px_-44px_rgba(0,0,0,0.9)]"
          variants={{ ...itemVariants, ...tileVariants }}
          initial="rest"
          whileHover="hover"
          whileFocus="hover"
          whileTap={{ scale: prefersReducedMotion ? 1 : 0.995 }}
          tabIndex={0}
          aria-label="Open orders tile"
        >
          <div className="absolute -top-px inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <h3 className="text-lg sm:text-xl font-semibold">Open orders</h3>
          <div className="mt-3 space-y-2 text-sm text-zinc-300">
            <motion.div className="flex items-center justify-between" variants={slideRow}>
              <span>BTC · Limit</span>
              <span className="text-zinc-400">65,200 · 0.10</span>
            </motion.div>
            <motion.div className="flex items-center justify-between" variants={slideRow}>
              <span>ETH · Stop</span>
              <span className="text-zinc-400">3,150 · 1.20</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Recent Trades (2x1) */}
        <motion.div
          className="relative col-span-1 sm:col-span-2 row-span-1 rounded-2xl bg-neutral-900/70 p-5 sm:p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_26px_-20px_rgba(0,0,0,0.85),0_36px_72px_-42px_rgba(0,0,0,0.85)]"
          variants={{ ...itemVariants, ...tileVariants }}
          initial="rest"
          whileHover="hover"
          whileFocus="hover"
          whileTap={{ scale: prefersReducedMotion ? 1 : 0.995 }}
          tabIndex={0}
          aria-label="Recent trades tile"
        >
          <div className="absolute -top-px inset-x-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          <h3 className="text-lg sm:text-xl font-semibold">Recent trades</h3>
          <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
            <motion.div className="rounded-lg bg-neutral-900/60 p-3 text-zinc-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_20px_-16px_rgba(0,0,0,0.8)]" variants={liftCard}>BTC · Buy</motion.div>
            <motion.div className="rounded-lg bg-neutral-900/60 p-3 text-zinc-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_20px_-16px_rgba(0,0,0,0.8)]" variants={liftCard}>ETH · Sell</motion.div>
            <motion.div className="rounded-lg bg-neutral-900/60 p-3 text-zinc-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_20px_-16px_rgba(0,0,0,0.8)]" variants={liftCard}>SOL · Buy</motion.div>
          </div>
        </motion.div>

        {/* News & Insights (2x1) */}
        <motion.div
          className="relative col-span-1 sm:col-span-2 row-span-1 rounded-2xl bg-neutral-900/60 p-5 sm:p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_22px_-18px_rgba(0,0,0,0.9),0_28px_60px_-44px_rgba(0,0,0,0.9)]"
          variants={{ ...itemVariants, ...tileVariants }}
          initial="rest"
          whileHover="hover"
          whileFocus="hover"
          whileTap={{ scale: prefersReducedMotion ? 1 : 0.995 }}
          tabIndex={0}
          aria-label="News and insights tile"
        >
          <div className="absolute -top-px inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <h3 className="text-lg sm:text-xl font-semibold">News & insights</h3>
          <ul className="mt-3 space-y-2 text-sm text-zinc-300">
            <li className="truncate">BTC ETF inflows reach new weekly high</li>
            <li className="truncate">ETH dev update: proto-danksharding progress</li>
            <li className="truncate">Macro: CPI print beats expectations</li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
    </section>
  );
}


