"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-[#08080a] flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px]" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#B19EEF]/[0.03] blur-[120px]" />

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <Link href="/" className="group mb-8">
          <span className="inline-flex items-center gap-2 bg-[#B19EEF]/10 border border-[#B19EEF]/20 px-3 py-1.5 rounded-sm transition-all duration-300 group-hover:bg-[#B19EEF]/20 group-hover:border-[#B19EEF]/40">
            <span className="text-[#B19EEF] text-sm font-bold leading-none">
              ✱
            </span>
            <span className="text-[#B19EEF] text-[10px] font-bold tracking-[0.15em] font-space leading-none uppercase">
              AXIS
            </span>
          </span>
        </Link>

        <h1 className="text-[clamp(4rem,12vw,10rem)] font-bold leading-[0.9] tracking-[-0.05em] text-white font-space mb-4">
          404
        </h1>

        <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-semibold text-neutral-400 font-space mb-6">
          Page not found
        </h2>

        <p className="text-neutral-500 text-[15px] font-ibm-plex-sans leading-relaxed max-w-md mb-10">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>

        <Link
          href="/"
          className="group inline-flex items-center gap-3 px-6 py-3 bg-white text-[#08080a] text-[13px] font-medium tracking-wide transition-all duration-300 hover:bg-neutral-200 font-space"
        >
          <ArrowLeft
            size={14}
            className="transition-transform duration-300 group-hover:-translate-x-1"
          />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
