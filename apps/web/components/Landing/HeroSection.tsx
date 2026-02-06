import PixelBlast from "../ui/PixelBlast";

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
      );

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full min-h-screen bg-[#0E0E0F] overflow-hidden flex flex-col justify-center py-20 lg:py-0">

      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-auto">
        <div className="absolute inset-0 bg-[#0E0E0F]" />
        <PixelBlast
          pixelSize={4}
          pixelSizeJitter={0}
          patternScale={2.5}
          patternDensity={1.2}
          color="#B19EEF"
          speed={1.5}
          enableRipples={true}
          rippleIntensityScale={1}
          rippleThickness={0.05}
          liquid={false}
          noiseAmount={0}
          edgeFade={0}
          className="opacity-100"
        />
      </div>

      <div className="absolute inset-x-0 bottom-[16vw] z-20 flex justify-center pointer-events-none">
        <div className="w-full max-w-7xl px-6">
          <h1 className="hero-title text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter text-white/50 leading-[0.9] font-space uppercase text-left">
            Navigate the <br />
            <span className="text-white">Markets with</span>
          </h1>
        </div>
      </div>





      <div className="absolute bottom-[-1vw] left-0 right-0 z-20 flex justify-center pointer-events-none">
        <div className="w-full max-w-7xl px-6">
          <h1 className="text-[18vw] leading-none font-bold font-space text-white text-left tracking-tighter opacity-100 transform translate-x-[-0.05em]">
            COMPASS
          </h1>
        </div>
      </div>
    </div>
  )
}
