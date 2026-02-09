"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Zap, Users, Activity } from "lucide-react";

import {
  TradeTapeIllustration,
  QuoteTerminalIllustration,
  LeverageSliderIllustration,
  PixelBlastCard,
  SmallButtonCard,
} from "./features";

gsap.registerPlugin(ScrollTrigger);

export const FeatureSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".feature-headline-line",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".feature-headline",
            start: "top 85%",
          },
        },
      );

      gsap.fromTo(
        ".feature-card",
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".feature-cards-grid",
            start: "top 82%",
          },
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative w-full min-h-screen bg-[#08080a] overflow-hidden"
      aria-label="Features section"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] rounded-full bg-[#B19EEF]/[0.02] blur-[160px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-center min-h-screen py-24 md:py-32">
        <div className="feature-headline mb-16 md:mb-20 max-w-4xl">
          <h2 className="feature-headline-line text-[clamp(1.75rem,4.5vw,3.25rem)] font-bold leading-[1.2] tracking-[-0.03em] text-white font-space">
            Trade faster with better prices
          </h2>

          <h2 className="feature-headline-line text-[clamp(1.75rem,4.5vw,3.25rem)] font-bold leading-[1.2] tracking-[-0.03em] text-white font-space">
            across multiple assets on{" "}
            <span className="inline-flex items-center gap-1.5 bg-[#B19EEF]/15 border border-[#B19EEF]/30 px-2.5 py-0.5 align-middle mx-1">
              <span className="text-[#B19EEF] text-sm md:text-base font-bold leading-none">
                ✱
              </span>
              <span className="text-[#B19EEF] text-xs md:text-sm font-semibold tracking-widest font-space">
                AXIS
              </span>
            </span>
          </h2>

          <h2 className="feature-headline-line text-[clamp(1.75rem,4.5vw,3.25rem)] font-bold leading-[1.2] tracking-[-0.03em] text-white font-space mt-1">
            Professional trading tools, simplified.
          </h2>
        </div>

        <div className="feature-cards-grid grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-start">
          <div className="feature-card flex flex-col" role="article" aria-label="Direct Market Access feature">
            <PixelBlastCard>
              <TradeTapeIllustration />
            </PixelBlastCard>
            <div className="mt-5">
              <h3 className="text-white text-[17px] font-semibold tracking-tight font-space">
                Instant Execution
              </h3>
              <p className="text-neutral-500 text-[13px] font-ibm-plex-sans leading-relaxed mt-1">
                Your orders fill instantly. Set automatic profit targets and stop losses to protect your trades.
              </p>
            </div>
          </div>

          <div className="feature-card flex flex-col gap-5" role="article" aria-label="Market Intelligence feature">
            <div className="flex flex-col gap-5">
              <SmallButtonCard />
              <PixelBlastCard>
                <QuoteTerminalIllustration />
              </PixelBlastCard>
            </div>
            <div className="mt-0">
              <h3 className="text-white text-[17px] font-semibold tracking-tight font-space">
                Live Market Prices
              </h3>
              <p className="text-neutral-500 text-[13px] font-ibm-plex-sans leading-relaxed mt-1">
                Watch BTC, ETH, and SOL prices update in real-time. Track your profits as the market moves.
              </p>
            </div>
          </div>

          <div className="feature-card flex flex-col" role="article" aria-label="Automated Risk Engine feature">
            <PixelBlastCard>
              <LeverageSliderIllustration />
            </PixelBlastCard>
            <div className="mt-5">
              <h3 className="text-white text-[17px] font-semibold tracking-tight font-space">
                Flexible Leverage
              </h3>
              <p className="text-neutral-500 text-[13px] font-ibm-plex-sans leading-relaxed mt-1">
                Control your risk with leverage from 1x to 100x. Trade bigger positions with less capital.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
