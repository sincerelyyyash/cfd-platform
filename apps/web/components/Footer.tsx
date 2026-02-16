"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const XIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231h0.001Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
  </svg>
);

const GithubIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".footer-content",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 85%",
          },
        }
      );
    },
    { scope: footerRef }
  );

  return (
    <footer
      ref={footerRef}
      id="connect"
      className="relative w-full bg-[#08080a] border-t border-white/[0.06] overflow-hidden"
    >
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[#B19EEF]/[0.02] blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <div className="footer-content grid grid-cols-1 lg:grid-cols-12 gap-12 py-16 md:py-20">
          <div className="lg:col-span-5">
            <Link href="/" className="inline-block mb-6 group">
              <span className="inline-flex items-center gap-2 bg-[#B19EEF]/15 border border-[#B19EEF]/30 px-4 py-2 rounded-sm transition-all duration-300 group-hover:bg-[#B19EEF]/25 group-hover:border-[#B19EEF]/50">
                <span className="text-[#B19EEF] text-base font-bold leading-none">
                  ✱
                </span>
                <span className="text-[#B19EEF] text-xs font-bold tracking-[0.2em] font-space leading-none uppercase">
                  AXIS
                </span>
              </span>
            </Link>

            <p className="text-neutral-500 text-[14px] font-ibm-plex-sans leading-[1.8] max-w-sm mb-8">
              The advanced CFD trading platform for the modern era. Trade BTC, ETH, and SOL with precision, speed, and confidence.
            </p>

            <div className="flex items-center gap-3">
              <Link
                href="https://x.com/sincerelyyyash"
                target="_blank"
                className="w-9 h-9 border border-white/[0.08] bg-white/[0.02] flex items-center justify-center text-neutral-500 hover:text-[#B19EEF] hover:border-[#B19EEF]/30 hover:bg-[#B19EEF]/5 transition-all duration-300"
              >
                <XIcon size={13} />
              </Link>
              <Link
                href="https://github.com/sincerelyyyash/cfd-platform"
                target="_blank"
                className="w-9 h-9 border border-white/[0.08] bg-white/[0.02] flex items-center justify-center text-neutral-500 hover:text-[#B19EEF] hover:border-[#B19EEF]/30 hover:bg-[#B19EEF]/5 transition-all duration-300"
              >
                <GithubIcon size={15} />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h4 className="text-[11px] text-[#B19EEF] font-space tracking-[0.2em] uppercase mb-5">
                Platform
              </h4>
              <div className="flex flex-col gap-3">
                <Link href="/trading" className="text-neutral-400 text-[14px] font-ibm-plex-sans hover:text-white transition-colors duration-200">
                  Trading Terminal
                </Link>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-neutral-400/50 text-[14px] font-ibm-plex-sans cursor-default transition-colors duration-200"
                >
                  Documentation
                </a>
                <Link href="/signin" className="text-neutral-400 text-[14px] font-ibm-plex-sans hover:text-white transition-colors duration-200">
                  Sign In
                </Link>
              </div>
            </div>

            <div>
              <h4 className="text-[11px] text-[#B19EEF] font-space tracking-[0.2em] uppercase mb-5">
                Resources
              </h4>
              <div className="flex flex-col gap-3">
                <Link href="#features" className="text-neutral-400 text-[14px] font-ibm-plex-sans hover:text-white transition-colors duration-200">
                  Features
                </Link>
                <Link href="#about" className="text-neutral-400 text-[14px] font-ibm-plex-sans hover:text-white transition-colors duration-200">
                  About
                </Link>
                <Link href="#faq" className="text-neutral-400 text-[14px] font-ibm-plex-sans hover:text-white transition-colors duration-200">
                  FAQ
                </Link>
              </div>
            </div>

            <div>
              <h4 className="text-[11px] text-[#B19EEF] font-space tracking-[0.2em] uppercase mb-5">
                Legal
              </h4>
              <div className="flex flex-col gap-3">
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-neutral-400/50 text-[14px] font-ibm-plex-sans cursor-default transition-colors duration-200"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-neutral-400/50 text-[14px] font-ibm-plex-sans cursor-default transition-colors duration-200"
                >
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-content border-t border-white/[0.06] py-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <p className="text-neutral-600 text-[12px] font-ibm-plex-sans">
            © {new Date().getFullYear()} AXIS Protocol. All rights reserved.
          </p>
          <p className="text-neutral-600 text-[12px] font-ibm-plex-sans">
            Designed and Developed by{" "}
            <Link
              href="https://sincerelyyyash.com"
              target="_blank"
              className="hover:text-[#B19EEF] transition-colors duration-200"
            >
              Yash Thakur
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
