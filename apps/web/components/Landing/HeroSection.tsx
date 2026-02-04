
import PixelBlast from "../ui/PixelBlast";
import { HeroGrid } from "./HeroGrid";
import { TradingCard } from "./TradingCard";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

export const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(".hero-title", {
      y: 50,
      opacity: 0,
      duration: 1,
      delay: 0.2
    })
      .from(".hero-cta", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2
      }, "-=0.5")
      .from(".hero-card", {
        x: 50,
        opacity: 0,
        duration: 1,
        ease: "power2.out"
      }, "-=0.8")
      .from(".hero-panel", {
        y: 20,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12
      }, "-=0.6");

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full min-h-screen bg-[#0E0E0F] overflow-hidden">

      <div className="absolute inset-0 flex flex-row-reverse">
        <div className="w-full lg:w-2/3 h-full relative bg-[#0E0E0F]">

        </div>

        <div className="hidden lg:block w-full lg:w-1/3 h-full relative bg-[#0E0E0F]">
          <div className="absolute inset-0 h-full w-full z-0 overflow-hidden pointer-events-auto">
            <PixelBlast
              pixelSize={4}
              pixelSizeJitter={0.2}
              patternScale={2.5}
              patternDensity={1.2}
              color="#B19EEF"
              speed={1.5}
              enableRipples={true}
              rippleIntensityScale={1}
              rippleThickness={0.05}
              liquid={false}
              noiseAmount={0.0}
              className="opacity-40"
            />
          </div>
        </div>
      </div>

      <div className="relative z-10 h-screen mx-auto flex flex-row-reverse pointer-events-none max-w-7xl">
        <div className="w-full lg:w-2/3 h-full flex flex-col justify-center px-6 sm:px-12 lg:pl-16 lg:pr-8 pointer-events-auto">
          <div className="space-y-8 max-w-xl">
            <div className="space-y-6">
              <h1 className="hero-title text-md sm:text-lg lg:text-2xl font-semibold tracking-tight text-white leading-[1.1] font-space">
                Navigate Markets with <br /> <span className="font-bitcount text-8xl">Compass</span>
              </h1>
              <p className="hero-title text-base text-neutral-400 tracking-wide max-w-lg mt-2">
                The precision terminal for CFD trading. Built for speed, clarity, and execution you can trust.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button className="hero-cta px-6 py-3 bg-[#d4d4d4] text-black text-lg font-medium hover:bg-white transition-colors border border-white/10 font-bitcount">
                Start Trading
              </button>
              {/* <button className="hero-cta px-6 py-3 border border-white/10 text-white font-medium hover:bg-white/5 transition-colors">
                Create Account
              </button> */}
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm font-medium text-white">
              {/* <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[#B19EEF]" />
                <span>Sub-10ms Execution</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[#B19EEF]" />
                <span>Institutional Liquidity</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[#B19EEF]" />
                <span>24/7 Market Coverage</span>
              </div> */}
            </div>
          </div>
        </div>

        <div className="hidden lg:flex w-1/3 h-full items-center justify-center hero-card pointer-events-auto">
          {/* <HeroGrid /> */}
        </div>
      </div>
    </div >
  )
}
