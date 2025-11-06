"use client";
import Navbar from "@/components/Navbar";
import HeroSection from "@/app/components/HeroSection";
import BentoGrid from "@/app/components/BentoGrid";
import Image from "next/image";
import TestimonialsSection from "@/app/components/TestimonialsSection";
import { motion, type Variants } from "framer-motion";
export const dynamic = 'force-dynamic';

type Testimonial = {
  id: string;
  name: string;
  role: string;
  avatar: string; // public path
  brand?: string; // optional brand/logo path
  quote: string;
  highlight: string;
  timeframe: string;
};

const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Aarav Mehta",
    role: "Options Trader",
    avatar: "/Bitcoin.png",
    brand: "/tradeprime-logo.svg",
    quote:
      "Execution feels instant. The depth and fills gave me the confidence to size up without slippage surprises.",
    highlight: "+34% realized PnL",
    timeframe: "Last 30 days",
  },
  {
    id: "t2",
    name: "Sarah Lin",
    role: "Quant Trader",
    avatar: "/ethereum.png",
    brand: "/vercel.svg",
    quote:
      "Data access is clean and consistent. Streaming quotes with minimal drift let our models react in time.",
    highlight: "<12ms median latency",
    timeframe: "Live",
  },
  {
    id: "t3",
    name: "Diego Alvarez",
    role: "Portfolio Trader",
    avatar: "/Solana.png",
    brand: "/next.svg",
    quote:
      "Risk tools are pragmatic. I can see exposure and act before it becomes a problem. The UI stays out of the way.",
    highlight: "Risk reduced 22%",
    timeframe: "Quarter to date",
  },
  {
    id: "t4",
    name: "Mina Park",
    role: "Algorithmic Trader",
    avatar: "/globe.svg",
    brand: "/file.svg",
    quote:
      "Integration took an afternoon. WebSocket reliability has been boring.",
    highlight: "99.99% uptime",
    timeframe: "Rolling 90d",
  },
  {
    id: "t5",
    name: "Kenji Sato",
    role: "Market Maker",
    avatar: "/Bitcoin.png",
    brand: "/window.svg",
    quote:
      "Order book quality holds up during volatility. We can quote tighter without getting clipped constantly.",
    highlight: "Spread tightened 8bps",
    timeframe: "High vol days",
  },
  {
    id: "t6",
    name: "Olivia Reed",
    role: "Professional Trader",
    avatar: "/ethereum.png",
    brand: "/tradeprime-logo.svg",
    quote:
      "The team sweats details. Micro-interactions make heavy workflows feel light, and clients notice.",
    highlight: "NPS 71",
    timeframe: "This release",
  },
];

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

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    },
  },
};

export default function Home() {
  return (
    <motion.div
      className="relative min-h-screen bg-neutral-950 text-neutral-100"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      
      <Navbar />

      
      <main className="relative">
        <motion.div variants={sectionVariants}>
          <HeroSection />
        </motion.div>

        <motion.div variants={sectionVariants}>
          <BentoGrid />
        </motion.div>

        <motion.div variants={sectionVariants}>
          <TestimonialsSection />
        </motion.div>
      </main>
    </motion.div>
  );
}
