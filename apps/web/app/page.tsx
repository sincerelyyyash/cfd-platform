import Navbar from "@/components/Navbar";
import HeroSection from "@/app/components/HeroSection";
import BentoGrid from "@/app/components/BentoGrid";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-neutral-950 text-neutral-100">
      

      {/* Minimal, blended navbar */}
      <Navbar />

      {/* Hero Section (full viewport) */}
      <main className="relative">
        <HeroSection />

        <BentoGrid />
      </main>
    </div>
  );
}
