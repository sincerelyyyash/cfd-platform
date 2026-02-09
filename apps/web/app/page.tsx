"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { HeroSection } from "@/components/Landing/HeroSection";
import { FeatureSection } from "@/components/Landing/FeatureSection";
import { AboutSection } from "@/components/Landing/AboutSection";
import { FaqSection } from "@/components/Landing/FaqSection";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 2.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
    };
  }, []);

  return (
    <main className="relative">
      <HeroSection />
      <FeatureSection />
      <AboutSection />
      <FaqSection />
    </main>
  );
}
