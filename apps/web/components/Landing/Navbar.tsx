"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-[#0E0E0F] backdrop-blur-md h-[72px] border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">

        <div className="flex-shrink-0 flex items-center gap-2">
          {/* <div className="w-8 h-8 bg-neutral-800 rounded-md flex items-center justify-center animate-pulse">
            <div className="w-4 h-4 bg-neutral-600 rounded-sm" />
          </div> */}
          <span className="font-semibold text-[32px] text-white tracking-tight font-bitcount">Compass</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            <Link href="#" className="text-md font-medium text-neutral-400 hover:text-white transition-colors font-bitcount">Features</Link>
            <Link href="#" className="text-md font-medium text-neutral-400 hover:text-white transition-colors font-bitcount">About</Link>
            <Link href="#" className="text-md font-medium text-neutral-400 hover:text-white transition-colors font-bitcount">Architecture</Link>
            <Link href="#" className="text-md font-medium text-neutral-400 hover:text-white transition-colors font-bitcount">Contact</Link>
          </div>

          <div className="h-4 w-[1px] bg-white/10" />

          <div className="flex items-center gap-3">
            <Link href="#" className="px-4 py-2 text-sm font-medium text-black bg-white border border-transparent hover:bg-neutral-200 transition-colors font-bitcount">
              Log in
            </Link>
          </div>
        </div>

        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-neutral-400 hover:text-white p-2"
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
            className="md:hidden bg-black border-b border-white/10 overflow-hidden absolute top-[72px] left-0 right-0 shadow-2xl"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              <Link href="#" className="text-md font-medium text-neutral-400 hover:text-white transition-colors font-bitcount py-2">Features</Link>
              <Link href="#" className="text-md font-medium text-neutral-400 hover:text-white transition-colors font-bitcount py-2">About</Link>
              <Link href="#" className="text-md font-medium text-neutral-400 hover:text-white transition-colors font-bitcount py-2">Architecture</Link>
              <Link href="#" className="text-md font-medium text-neutral-400 hover:text-white transition-colors font-bitcount py-2">Contact</Link>
              <div className="w-full h-px bg-white/10 my-2" />
              {/* <Link href="#" className="text-neutral-300 font-medium py-2">Explore docs</Link> */}
              <Link href="#" className="text-white font-medium py-2 font-bitcount">Log in</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}