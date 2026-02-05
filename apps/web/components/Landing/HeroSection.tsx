import PixelBlast from "../ui/PixelBlast";
import { PortfolioCard } from "./PortfolioCard";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(".hero-title",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.2 }
    )
      .fromTo(".hero-sub",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.6"
      )
      .fromTo(".hero-cta",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.2 },
        "-=0.6"
      )
      .fromTo(".hero-card-1",
        { x: -50, rotation: -20, opacity: 0, scale: 0.8 },
        { x: 0, rotation: -12, opacity: 1, scale: 0.9, duration: 1.2, ease: "power2.out" },
        "-=0.8"
      )
      .fromTo(".hero-card-2",
        { x: 50, rotation: 10, opacity: 0, scale: 0.8 },
        { x: 0, rotation: 6, opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" },
        "-=1.0"
      )
      .fromTo(".hero-step",
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, stagger: 0.15 },
        "-=0.8"
      );

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full min-h-screen bg-[#0E0E0F] overflow-hidden flex flex-col justify-center py-20 lg:py-0">

      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-auto">
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
          className="opacity-30"
        />
      </div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 grid grid-cols-1 xl:grid-cols-12 gap-12 items-center min-h-screen">

        <div className="xl:col-span-5 flex flex-col items-center xl:items-start text-center xl:text-left space-y-8 pt-20 xl:pt-0">
          <div className="space-y-4">
            <h1 className="hero-title text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter text-white leading-[0.9] font-space uppercase">
              Secure Your <br />
              <span className="text-white">Trading Future</span>
            </h1>
            <p className="hero-sub text-lg text-neutral-400 tracking-wide max-w-lg mx-auto xl:mx-0 mt-4 leading-relaxed">
              Trusted Protection and Expert Guidance for Your Trades. The precision terminal for modern markets.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center xl:justify-start gap-4">
            <button className="hero-cta group px-8 py-4 bg-[#B19EEF] text-black text-lg font-bold hover:bg-[#9f85e8] transition-all rounded-[2px] font-space uppercase tracking-wider flex items-center gap-2">
              Get Started
              <ArrowUpRight className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" size={20} />
            </button>
            <button className="hero-cta group px-4 py-4 border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all rounded-full">
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>


        </div>

        <div className="xl:col-span-4 relative h-[500px] w-full flex items-center justify-center perspective-[1000px]">
          <div className="hero-card-1 absolute transform -rotate-12 -translate-x-8 translate-y-4 scale-90 opacity-60 hover:opacity-100 hover:rotate-0 hover:translate-x-0 hover:translate-y-0 hover:scale-100 transition-all duration-500 z-10 grayscale hover:grayscale-0">
            <div className="pointer-events-none">
              <PortfolioCard />
            </div>
          </div>

          <div className="hero-card-2 absolute transform rotate-6 translate-x-8 -translate-y-4 z-20 hover:rotate-0 hover:translate-x-0 hover:translate-y-0 transition-all duration-500 shadow-2xl shadow-[#B19EEF]/10">
            <PortfolioCard />
          </div>
        </div>

        <div className="hidden xl:flex xl:col-span-3 flex-col gap-16 pl-12 border-l border-white/5 py-12">
          {[
            { title: "Zero Latency", sub: "Institutional Grade Speed" },
            { title: "Secure Vaults", sub: "Audited Smart Contracts" },
            { title: "Global Market", sub: "Trade 24/7 Across Chains" }
          ].map((feature, i) => (
            <div key={i} className="hero-step flex items-start justify-between cursor-default">
              <div className="flex flex-col gap-1">
                <h3 className="text-white font-bold font-space text-lg transition-colors">
                  {feature.title}
                </h3>
                <span className="text-neutral-500 text-sm">{feature.sub}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
