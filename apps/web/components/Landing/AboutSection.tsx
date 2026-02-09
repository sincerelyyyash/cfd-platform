"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SystemArchitectureDiagram } from "./SystemArchitectureDiagram";

gsap.registerPlugin(ScrollTrigger);

const ARCHITECTURE_STEPS = [
    {
        id: "01",
        title: "Place Your Order",
        description: "Choose your asset, set your leverage, and execute your trade in seconds.",
        position: "left",
    },
    {
        id: "02",
        title: "Get Filled Instantly",
        description: "Experience zero delays with our high-speed matching engine designed for volatile markets.",
        position: "left",
    },
    {
        id: "03",
        title: "Track in Real-Time",
        description: "Watch your profits grow with live price updates streaming directly from global exchanges.",
        position: "right",
    },
    {
        id: "04",
        title: "Stay Protected",
        description: "Your stop-loss and take-profit orders trigger automatically to lock in gains or limit risk.",
        position: "right",
    },
];

export const AboutSection = () => {
    const sectionRef = useRef<HTMLElement>(null);

    useGSAP(
        () => {
            gsap.fromTo(
                ".about-header",
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 70%",
                    },
                }
            );

            gsap.fromTo(
                ".about-diagram",
                { opacity: 0, scale: 0.9 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: ".about-diagram",
                        start: "top 60%",
                    },
                }
            );

            gsap.fromTo(
                ".about-step-left",
                { opacity: 0, x: -30 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: ".about-diagram",
                        start: "top 60%",
                    },
                }
            );

            gsap.fromTo(
                ".about-step-right",
                { opacity: 0, x: 30 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: ".about-diagram",
                        start: "top 60%",
                    },
                }
            );
        },
        { scope: sectionRef }
    );

    return (
        <section
            ref={sectionRef}
            id="about"
            className="relative min-h-screen w-full bg-[#08080a] overflow-hidden flex flex-col items-center justify-center py-20"
        >
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#B19EEF]/[0.02] blur-[120px]" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col items-center">
                <div className="about-header text-center max-w-3xl mb-16 md:mb-24">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="w-8 h-px bg-[#B19EEF]/40" />
                        <span className="text-[11px] text-[#B19EEF] font-space tracking-[0.2em] uppercase">
                            About AXIS
                        </span>
                        <div className="w-8 h-px bg-[#B19EEF]/40" />
                    </div>

                    <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.1] tracking-[-0.03em] text-white font-space mb-6">
                        A platform
                        <span className="text-neutral-500"> for cryptocurrency.</span>
                    </h2>

                    <p className="text-neutral-400 text-[16px] md:text-[18px] font-ibm-plex-sans leading-[1.7] max-w-2xl mx-auto">
                        Trade BTC, ETH, and SOL with configurable leverage.
                        Open long or short positions, set stop-loss and take-profit levels,
                        and monitor your PnL in real-time.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center w-full">
                    <div className="space-y-16 hidden lg:block">
                        {ARCHITECTURE_STEPS.filter(s => s.position === "left").map((item) => (
                            <div key={item.id} className="about-step-left flex flex-col items-end text-right group">
                                <div className="flex items-center gap-4 mb-3">
                                    <h4 className="text-white text-[18px] font-semibold font-space">
                                        {item.title}
                                    </h4>
                                    <div className="w-8 h-8 rounded-full border border-white/[0.1] bg-white/[0.02] flex items-center justify-center text-[#B19EEF] font-bold font-mono text-xs group-hover:border-[#B19EEF]/50 group-hover:text-white transition-colors duration-300">
                                        {item.id}
                                    </div>
                                </div>
                                <p className="text-neutral-500 text-[14px] font-ibm-plex-sans leading-relaxed max-w-[280px]">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="about-diagram relative flex justify-center py-8 lg:py-0">
                        <div className="relative w-full max-w-[400px] aspect-square flex items-center justify-center">
                            <SystemArchitectureDiagram />

                            <div className="absolute inset-0 border border-white/[0.03] lg:hidden rounded-full" />
                        </div>
                    </div>

                    <div className="space-y-16 hidden lg:block">
                        {ARCHITECTURE_STEPS.filter(s => s.position === "right").map((item) => (
                            <div key={item.id} className="about-step-right flex flex-col items-start text-left group">
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="w-8 h-8 border border-white/[0.1] bg-white/[0.02] flex items-center justify-center text-[#B19EEF] font-bold font-mono text-xs group-hover:border-[#B19EEF]/50 group-hover:text-white transition-colors duration-300">
                                        {item.id}
                                    </div>
                                    <h4 className="text-white text-[18px] font-semibold font-space">
                                        {item.title}
                                    </h4>
                                </div>
                                <p className="text-neutral-500 text-[14px] font-ibm-plex-sans leading-relaxed max-w-[280px]">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:hidden">
                        {ARCHITECTURE_STEPS.map((item) => (
                            <div key={item.id} className="flex flex-col items-center text-center">
                                <div className="w-8 h-8 rounded-full border border-white/[0.1] bg-white/[0.02] flex items-center justify-center text-[#B19EEF] font-bold font-mono text-xs mb-3">
                                    {item.id}
                                </div>
                                <h4 className="text-white text-[16px] font-semibold font-space mb-2">
                                    {item.title}
                                </h4>
                                <p className="text-neutral-500 text-[14px] font-ibm-plex-sans leading-relaxed max-w-xs">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
