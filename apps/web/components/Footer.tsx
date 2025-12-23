"use client";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    },
  },
};

const Footer = () => {
  return (
    <motion.footer
      className="w-full bg-[oklch(0.145_0_0)] text-[oklch(0.82_0_0)] border-t border-white/5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
      role="contentinfo"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between">
          <motion.div
            className="flex items-center gap-3"
            variants={itemVariants}
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-white/5 text-white/80" aria-hidden>
              TP
            </span>
            <p className="text-sm leading-6 text-white/70">
              © {new Date().getFullYear()} TradePrime. All rights reserved.
            </p>
          </motion.div>
          <motion.nav
            aria-label="Footer"
            className="flex items-center gap-6"
            variants={itemVariants}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/trading"
                aria-label="Go to trading"
                className="rounded px-1 text-sm text-white/70 hover:text-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
              >
                Trading
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/signin"
                aria-label="Go to sign in"
                className="rounded px-1 text-sm text-white/70 hover:text-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
              >
                Sign In
              </Link>
            </motion.div>
          </motion.nav>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;


