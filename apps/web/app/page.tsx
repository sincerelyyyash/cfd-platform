import AppNavbar from "@/components/AppNavbar";
import Hero from "@/components/Hero";
import Link from "next/link";
import { LineChart, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      <AppNavbar />
      <main>
        <Hero />
      </main>
    </div>
  );
}
