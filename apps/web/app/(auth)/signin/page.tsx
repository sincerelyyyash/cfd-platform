"use client";
import { SignInForm } from "@/components/auth/SignInForm";
import { motion, type Variants } from "framer-motion";
export const dynamic = 'force-dynamic';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const leftSectionVariants: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const rightSectionVariants: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const contentVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const listItemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

export default function SigninPage() {
  return (
    <motion.div
      className="grid min-h-screen grid-cols-1 md:grid-cols-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      
      <motion.section
        className="hidden md:flex flex-col justify-center px-8 lg:px-16 bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-950 dark:to-black"
        variants={leftSectionVariants}
      >
        <motion.div className="max-w-xl" variants={contentVariants}>
          <motion.span
            className="inline-flex items-center rounded-full bg-neutral-200/60 px-3 py-1 text-xs font-medium text-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-300"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            Secure. Fast. Intuitive
          </motion.span>
          <motion.h1
            className="mt-4 text-4xl font-bold leading-tight text-neutral-900 dark:text-white md:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Trade smarter with PrimeTrade
          </motion.h1>
          <motion.p
            className="mt-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Access real-time markets, manage positions, and execute with confidence. Sign in with your email to receive a magic link.
          </motion.p>
          <motion.ul
            className="mt-6 space-y-3 text-sm text-neutral-700 dark:text-neutral-300"
            variants={contentVariants}
          >
            <motion.li
              className="flex items-start gap-3"
              variants={listItemVariants}
            >
              <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
              Zero passwords, magic-link security
            </motion.li>
            <motion.li
              className="flex items-start gap-3"
              variants={listItemVariants}
            >
              <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
              Advanced charting and analytics
            </motion.li>
            <motion.li
              className="flex items-start gap-3"
              variants={listItemVariants}
            >
              <span className="mt-1 h-2 w-2 rounded-full bg-rose-500" />
              Institutional-grade infrastructure
            </motion.li>
          </motion.ul>
        </motion.div>
      </motion.section>

      
      <motion.section
        className="flex items-center justify-end p-4 md:p-8 bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-950 dark:to-black"
        variants={rightSectionVariants}
      >
        <motion.div
          className="w-full max-w-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <SignInForm />
        </motion.div>
      </motion.section>
    </motion.div>
  );
}
