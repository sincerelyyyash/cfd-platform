"use client";

import Link from "next/link";
import Brand from "@/components/Brand";
import { Button } from "@/components/ui/button";
import { motion, useReducedMotion } from "framer-motion";

export default function Navbar() {
  const prefersReducedMotion = useReducedMotion();

  const navReveal = prefersReducedMotion
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: -10 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 24 } } };

  return (
    <header className="sticky top-0 z-30 h-16 sm:h-20 bg-neutral-950/95 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/80 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04),0_8px_24px_-20px_rgba(0,0,0,0.6)] flex items-center px-3 sm:px-4">
      <motion.div className="mx-auto w-full max-w-6xl flex items-center justify-between" initial="hidden" animate="show" variants={navReveal}>
        <Link
          href="/"
          aria-label="TradePrime home"
          className="relative z-20 inline-flex items-center gap-2 text-neutral-100"
        >
          <span className="ml-1">
            <Brand size="lg" showText variant="glyph" />
          </span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3" aria-label="Primary">
          <Link href="/signin" aria-label="Sign in">
            <Button
              variant="ghost"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-200 hover:text-zinc-100 bg-neutral-900/40 hover:bg-neutral-800/50 transition-all duration-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_1px_0_rgba(255,255,255,0.02),0_8px_20px_-12px_rgba(0,0,0,0.6)]"
            >
              Sign in
            </Button>
          </Link>
          <Link href="/signup" aria-label="Create account">
            <Button
              variant="secondary"
              className="px-3 sm:px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-zinc-100 transition-all duration-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_2px_0_rgba(255,255,255,0.06),0_16px_28px_-18px_rgba(0,0,0,0.8)] focus-visible:ring-2 focus-visible:ring-white/20"
            >
              Create account
            </Button>
          </Link>
        </nav>
      </motion.div>
    </header>
  );
}


