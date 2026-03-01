"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { HeroSection } from "@/components/Landing/HeroSection";
import { FeatureSection } from "@/components/Landing/FeatureSection";
import { AboutSection } from "@/components/Landing/AboutSection";
import { FaqSection } from "@/components/Landing/FaqSection";

// Register once, globally — components must NOT re-register
gsap.registerPlugin(ScrollTrigger);

// Prevent GSAP from trying to "catch up" after a tab switch or slow frame,
// which causes a single huge jank spike.
gsap.ticker.lagSmoothing(500, 33);

// Cap the internal GSAP ticker to 60 fps — prevents unnecessary frame work
// on high-refresh displays that don't benefit the animations.
gsap.ticker.fps(60);

export default function Home() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    // CRITICAL FIX: GSAP ticker already provides time in milliseconds.
    // The previous code did `lenis.raf(time * 1000)` which passed values like
    // 1,700,000,000,000 — making Lenis think each frame = entire animation,
    // breaking its easing entirely and causing the laggy scroll.
    const rafCallback = (time: number) => {
      lenis.raf(time);
    };

    gsap.ticker.add(rafCallback);

    return () => {
      gsap.ticker.remove(rafCallback);
      lenis.destroy();
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
