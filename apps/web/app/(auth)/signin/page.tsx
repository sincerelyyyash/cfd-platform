"use client";

import { SignInForm } from "@/components/auth/SignInForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export const dynamic = "force-dynamic";

export default function SigninPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        ".signin-header",
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 }
      )
        .fromTo(
          ".signin-content",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 },
          "-=0.4"
        )
        .fromTo(
          ".signin-footer",
          { opacity: 0 },
          { opacity: 1, duration: 0.8 },
          "-=0.4"
        );
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="min-h-screen w-full bg-[#08080a] relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px]" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#B19EEF]/[0.03] blur-[120px]" />

      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between">
          <Link
            href="/"
            className="signin-header group flex items-center gap-2 text-neutral-500 hover:text-white transition-colors duration-300"
          >
            <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="text-[13px] font-space">Back to Home</span>
          </Link>

          <Link href="/" className="signin-header inline-block">
            <span className="inline-flex items-center gap-2 bg-[#B19EEF]/15 border border-[#B19EEF]/30 px-3 py-1.5 transition-all duration-300 hover:bg-[#B19EEF]/25 hover:border-[#B19EEF]/50">
              <span className="text-[#B19EEF] text-sm font-bold leading-none">✱</span>
              <span className="text-[#B19EEF] text-xs font-bold tracking-[0.2em] font-space leading-none uppercase">
                AXIS
              </span>
            </span>
          </Link>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-6 sm:mb-10">
              <div className="signin-content flex items-center justify-center gap-3 mb-6">
                <div className="w-8 h-px bg-[#B19EEF]/40" />
                <span className="text-[11px] text-[#B19EEF] font-space tracking-[0.2em] uppercase">
                  Welcome Back
                </span>
                <div className="w-8 h-px bg-[#B19EEF]/40" />
              </div>

              <h1 className="signin-content text-[clamp(1.5rem,5vw,3rem)] font-bold leading-[1.1] tracking-[-0.03em] text-white font-space mb-3 sm:mb-4">
                Sign in to{" "}
                <span className="inline-flex items-center gap-2 bg-[#B19EEF]/15 border border-[#B19EEF]/30 px-3 py-1 align-middle mx-1">
                  <span className="text-[#B19EEF] text-[0.5em] font-bold leading-none">✱</span>
                  <span className="text-[#B19EEF] text-[0.4em] font-bold tracking-widest font-space leading-none">
                    AXIS
                  </span>
                </span>
              </h1>

              <p className="signin-content text-neutral-500 text-[14px] font-ibm-plex-sans leading-[1.7] max-w-sm mx-auto">
                Access your trading terminal. Enter your email to receive a secure magic link.
              </p>
            </div>

            <div className="signin-content">
              <SignInForm />
            </div>

            {/* <div className="signin-content mt-8 text-center">
              <p className="text-neutral-600 text-[12px] font-ibm-plex-sans">
                Don&apos;t have an account?{" "}
                <Link href="/signin" className="text-[#B19EEF] hover:text-white transition-colors duration-300">
                  Create one
                </Link>
              </p>
            </div> */}
          </div>
        </main>

        <footer className="signin-footer w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-center gap-6 text-neutral-600 text-[11px] font-ibm-plex-sans">
            <span>© {new Date().getFullYear()} AXIS Protocol</span>
            <span className="w-px h-3 bg-white/10" />
            <span>Secure Authentication</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
