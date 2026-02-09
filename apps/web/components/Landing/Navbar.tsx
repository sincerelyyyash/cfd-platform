"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(".nav-shell", {
      y: -24,
      opacity: 0,
      duration: 0.7,
    })
      .from(
        ".nav-logo",
        {
          opacity: 0,
          y: 10,
          duration: 0.6,
        },
        "-=0.4",
      );
  }, { scope: containerRef });

  return (
    <nav
      ref={containerRef}
      className="fixed top-0 inset-x-0 z-50 h-[72px] nav-shell"
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between relative">

        <div className="flex-shrink-0 flex items-center gap-2 nav-logo">
          <span className="text-xs tracking-[0.35em] uppercase text-neutral-500 font-space">
            AXIS
          </span>
        </div>

        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-neutral-400 hover:text-white p-2"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#08080a] border-b border-white/10 overflow-hidden absolute top-[72px] left-0 right-0 shadow-2xl"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              <Link href="#features" className="text-sm font-medium text-neutral-500 hover:text-white transition-colors font-space py-2">Features</Link>
              <Link href="#about" className="text-sm font-medium text-neutral-500 hover:text-white transition-colors font-space py-2">About</Link>
              <Link href="#faq" className="text-sm font-medium text-neutral-500 hover:text-white transition-colors font-space py-2">FAQ</Link>
              <Link href="#connect" className="text-sm font-medium text-neutral-500 hover:text-white transition-colors font-space py-2">Connect</Link>
              <div className="w-full h-px bg-white/10 my-2" />
              <Link href="/trading" className="text-white font-medium py-2 font-space">Launch Terminal</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
