"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
  return (
    <main className="relative">
      <HeroSection />
      <FeatureSection />
      <AboutSection />
      <FaqSection />
    </main>
  );
}
