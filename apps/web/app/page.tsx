"use client";
import Navbar from "@/components/Landing/Navbar";
import { HeroSection } from "@/components/Landing/HeroSection";



export default function Home() {
  return (
<div>
      <Navbar />
      <main className="relative">
        <div>
          <HeroSection />
        </div>
      </main>
    </div>
  );
}
