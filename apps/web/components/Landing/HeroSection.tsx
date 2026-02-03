
import { CheckIcon } from "lucide-react";
import PixelBlast from "../ui/PixelBlast";
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
      }, "-=0.8");

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full min-h-screen bg-[#0E0E0F] overflow-hidden">

      <div className="absolute inset-0 flex">
        <div className="w-full lg:w-1/3 h-full bg-[#0E0E0F]" />

        <div className="hidden lg:block w-full lg:w-2/3 h-full relative bg-[#0E0E0F]">
          <div className="absolute inset-0 h-full w-full z-0 overflow-hidden">
            <PixelBlast
              pixelSize={4}
              pixelSizeJitter={0.2}
              patternScale={2.5}
              patternDensity={1.2}
              // color="#274CB6"
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
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-auto hero-card pl-28">
            <TradingCard />
          </div>
        </div>
      </div>

      <div className="relative z-10 h-screen max-w-7xl mx-auto flex pointer-events-none">
        <div className="w-full lg:w-1/3 h-full flex flex-col justify-center px-6 sm:px-12 lg:pr-16 lg:pl-6 pointer-events-auto">
          <div className="space-y-8 max-w-xl">
            <h1 className="hero-title text-md sm:text-lg lg:text-2xl font-semibold tracking-tight text-white leading-[1.1] font-space">
              Navigate Markets with <br /> <span className="font-bitcount text-8xl">Compass</span>
            </h1>

            {/* <p className="text-lg sm:text-xl text-neutral-300 leading-relaxed drop-shadow-md">
              Your precise guide through market volatility. Experience institutional-grade execution and real-time insights designed to help you find your edge.
            </p> */}

            <div className="flex flex-wrap items-center gap-4">
              <button className="hero-cta px-6 py-3 bg-[#d4d4d4] text-black text-lg font-medium hover:bg-white transition-colors border border-white/10 font-bitcount">
                Start Trading
              </button>
              {/* <button className="hero-cta px-6 py-3 border border-white/10 text-white font-medium hover:bg-white/5 transition-colors">
                Create Account
              </button> */}
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-white">
              {/* <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[#8b5cf6]" />
                <span>Low Latency Execution</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[#8b5cf6]" />
                <span>Real-Time Market Data</span>
              </div> */}
            </div>
          </div>
        </div>

        <div className="hidden lg:block w-2/3 h-full" />
      </div>
    </div>
  )
}