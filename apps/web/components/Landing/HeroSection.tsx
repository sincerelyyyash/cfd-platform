import PixelBlast from "../ui/PixelBlast";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

export const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(".pixelblast-container",
      { opacity: 0 },
      { opacity: 1, duration: 2 }
    )
      .fromTo(".hero-line",
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, stagger: 0.1 },
        "-=1.5"
      )
      .fromTo(".hero-sub",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.6"
      )
      .fromTo(".hero-cta",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 },
        "-=0.6"
      );

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full min-h-screen bg-[#0E0E0F] overflow-hidden flex items-center">

      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#0E0E0F]" />

        <div className="pixelblast-container absolute inset-0 left-0 md:left-1/4">
          <PixelBlast
            pixelSize={3}
            pixelSizeJitter={0}
            patternScale={3}
            patternDensity={1.5}
            color="#B19EEF"
            speed={0.8}
            enableRipples={true}
            rippleIntensityScale={0.5}
            rippleThickness={0.02}
            liquid={false}
            noiseAmount={0}
            edgeFade={0.1}
            className="opacity-60"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-[#0E0E0F] via-[#0E0E0F]/80 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0E0E0F] to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12">
        <div className="max-w-3xl">

          <div className="hero-sub mb-6 flex items-center gap-2">
            <div className="w-1 h-1 bg-[#B19EEF] rounded-full" />
            <span className="text-xs font-mono text-[#B19EEF] tracking-widest uppercase">Algorithmic Trading Protocol</span>
          </div>

          <div className="mb-8">
            <div className="overflow-hidden mb-1">
              <h1 className="hero-line text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-neutral-500 leading-[0.95] font-space">
                Navigate the
              </h1>
            </div>
            <div className="overflow-hidden mb-1">
              <h1 className="hero-line text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-white leading-[0.95] font-space">
                Markets with
              </h1>
            </div>
            <div className="overflow-hidden">
              <h1 className="hero-line text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter leading-[0.95] font-space text-[#B19EEF]">
                Compass
              </h1>
            </div>
          </div>

          <p className="hero-sub max-w-md text-base md:text-lg text-neutral-400 font-sans leading-relaxed mb-10 text-left">
            Institutional-grade infrastructure designed for high-frequency execution and real-time market analysis.
          </p>

          <div className="flex flex-row items-center gap-4">
            <button className="hero-cta group relative px-8 py-3.5 bg-[#B19EEF] hover:bg-[#9f85e8] text-black font-bold text-sm uppercase tracking-wide transition-all duration-300 hover:scale-[1.02] flex items-center gap-3 overflow-hidden rounded-[1px]">
              <span className="relative z-10 font-bitcount">Start Trading</span>
              <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            </button>

            <button className="hero-cta group px-8 py-3.5 bg-transparent hover:bg-white/[0.05] text-white font-medium text-sm uppercase tracking-wide border border-white/10 hover:border-white/20 transition-all duration-300 font-bitcount rounded-[1px]">
              Documentation
            </button>
          </div>

        </div>
      </div>

    </div>
  )
}
