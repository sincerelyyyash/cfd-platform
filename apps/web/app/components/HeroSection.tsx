"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
  },
};

const headingVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export default function HeroSection() {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 min-h-[100svh] sm:min-h-[100vh] py-6 sm:py-10 flex items-center justify-center text-center">
      {/* Layered background with tonal variations */}
      <div className="absolute inset-0 -z-10 bg-neutral-950" aria-hidden />
      <div className="absolute inset-0 -z-[9] bg-gradient-to-b from-neutral-900/50 via-neutral-950 to-neutral-950" aria-hidden />
      <div className="absolute inset-0 -z-[8] bg-gradient-to-b from-transparent via-neutral-950/80 to-neutral-950" aria-hidden />
      
      {/* Radial light fade from top-center */}
      <div className="pointer-events-none absolute inset-0 -z-[7] bg-radial-gradient-to-b from-white/[0.02] via-transparent to-transparent opacity-60" style={{ background: 'radial-gradient(ellipse 120% 60% at 50% 0%, rgba(255,255,255,0.02) 0%, transparent 60%)' }} aria-hidden />
      
      {/* Background accents with depth */}
      <div className="pointer-events-none absolute inset-0 -z-[6]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-70" aria-hidden />
        <div className="absolute inset-x-0 top-[1px] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-40" aria-hidden />
      </div>

      {/* Main content container with elevation */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center text-center space-y-4 sm:space-y-5"
        variants={contentVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Small badge with layered depth */}
        <motion.div
          className="mx-auto inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-medium tracking-wider text-zinc-200 sm:text-xs relative overflow-hidden
          bg-gradient-to-b from-neutral-800/90 via-neutral-800/95 to-neutral-900
          border border-neutral-700/40
          shadow-[inset_0_1px_0_rgba(255,255,255,0.12),inset_0_0.5px_0_rgba(255,255,255,0.08),0_2px_8px_rgba(0,0,0,0.4),0_1px_2px_rgba(0,0,0,0.3)]
          before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/[0.03] before:to-transparent before:pointer-events-none"
          variants={badgeVariants}
          transition={{ duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-gradient-to-br from-zinc-300 to-zinc-500 shadow-[0_0_0_2px_rgba(244,244,245,0.15),inset_0_1px_1px_rgba(255,255,255,0.3),0_1px_2px_rgba(0,0,0,0.2)]" aria-hidden />
          <span className="relative z-10">Built for active crypto traders</span>
        </motion.div>
        
        {/* Heading with enhanced contrast */}
        <motion.h1
          className="text-balance mx-auto max-w-3xl sm:max-w-4xl text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-zinc-50 drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
          variants={headingVariants}
          transition={{ duration: 0.7, ease: [0.43, 0.13, 0.23, 0.96] }}
        >
          Trade crypto in seconds.
          <br className="hidden sm:block" />
          <span className="text-zinc-100">No clutter. Just execution.</span>
        </motion.h1>
        
        {/* Description with adjusted contrast */}
        <motion.p
          className="text-pretty mx-auto max-w-xl sm:max-w-2xl md:max-w-3xl text-sm sm:text-base md:text-lg text-zinc-300 leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.2)]"
          variants={itemVariants}
          transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
        >
          Real‑time prices, 1‑click tickets, and a focused terminal designed to help you place better trades faster.
        </motion.p>

        {/* Buttons container */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-1 w-full sm:w-auto"
          variants={itemVariants}
          transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto"
          >
            <Link href="/trading" aria-label="Start trading" className="w-full sm:w-auto">
              <Button variant="secondary" className="w-full sm:w-auto px-4 sm:px-6 h-11 text-sm rounded-xl relative overflow-hidden
                bg-gradient-to-b from-white/15 via-white/12 to-white/10
                border border-white/20
                shadow-[inset_0_1px_0_rgba(255,255,255,0.2),inset_0_0.5px_0_rgba(255,255,255,0.15),0_4px_12px_rgba(0,0,0,0.3),0_2px_4px_rgba(0,0,0,0.2)]
                hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.25),inset_0_0.5px_0_rgba(255,255,255,0.2),0_6px_16px_rgba(0,0,0,0.4),0_3px_6px_rgba(0,0,0,0.25)]
                active:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_2px_4px_rgba(0,0,0,0.2),0_2px_6px_rgba(0,0,0,0.25)]
                transition-all duration-200
                before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/[0.08] before:to-transparent before:pointer-events-none">
                <span className="relative z-10 text-zinc-100 font-medium">Start Trading</span>
              </Button>
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto"
          >
            <Link href="/signin" aria-label="Sign in" className="w-full sm:w-auto">
              <Button variant="ghost" className="w-full sm:w-auto px-4 sm:px-6 h-11 text-sm rounded-xl relative overflow-hidden
                bg-gradient-to-b from-neutral-800/50 via-neutral-800/60 to-neutral-900/70
                border border-neutral-700/30
                shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_0.5px_0_rgba(255,255,255,0.05),0_2px_8px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.2)]
                hover:bg-gradient-to-b hover:from-neutral-700/60 hover:via-neutral-800/70 hover:to-neutral-800/80
                hover:border-neutral-600/40
                hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),inset_0_0.5px_0_rgba(255,255,255,0.08),0_4px_12px_rgba(0,0,0,0.35),0_2px_4px_rgba(0,0,0,0.25)]
                active:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_2px_4px_rgba(0,0,0,0.25),0_1px_4px_rgba(0,0,0,0.2)]
                transition-all duration-200
                before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/[0.04] before:to-transparent before:pointer-events-none">
                <span className="relative z-10 text-zinc-200 font-medium">Sign In</span>
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Compact trust/metrics row */}
        {/* <ul className="mx-auto mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-zinc-400 sm:text-sm">
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
        </ul> */}
      </motion.div>
    </section>
  );
}


