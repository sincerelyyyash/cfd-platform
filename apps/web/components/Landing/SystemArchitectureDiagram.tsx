"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PixelBlastCard } from "./features";

gsap.registerPlugin(ScrollTrigger);

export const SystemArchitectureDiagram = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            gsap.fromTo(
                ".arch-visual-line",
                { scaleX: 0 },
                {
                    scaleX: 1,
                    duration: 1.2,
                    stagger: 0.1,
                    ease: "power2.inOut",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 75%",
                    },
                }
            );
        },
        { scope: containerRef }
    );

    return (
        <div ref={containerRef} className="relative aspect-square max-w-md w-full mx-auto">
            <PixelBlastCard className="w-full h-full">
                <div className="absolute inset-0 border border-white/[0.06]" />
                <div className="absolute inset-4 border border-white/[0.04]" />
                <div className="absolute inset-8 border border-[#B19EEF]/20" />

                <div className="absolute inset-12 flex flex-col justify-center gap-6">
                    <div className="arch-visual-line h-px bg-gradient-to-r from-transparent via-[#B19EEF]/20 to-transparent origin-left relative overflow-hidden">
                        <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-transparent via-[#B19EEF] to-transparent animate-[shimmer_3s_infinite]" />
                    </div>
                    <div className="arch-visual-line h-px bg-gradient-to-r from-transparent via-white/10 to-transparent origin-left relative overflow-hidden">
                        <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_4s_infinite_1s]" />
                    </div>
                    <div className="arch-visual-line h-px bg-gradient-to-r from-transparent via-[#B19EEF]/20 to-transparent origin-left relative overflow-hidden">
                        <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-transparent via-[#B19EEF] to-transparent animate-[shimmer_2.5s_infinite_0.5s]" />
                    </div>
                    <div className="arch-visual-line h-px bg-gradient-to-r from-transparent via-white/10 to-transparent origin-left relative overflow-hidden">
                        <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_3.5s_infinite_1.5s]" />
                    </div>
                    <div className="arch-visual-line h-px bg-gradient-to-r from-transparent via-[#B19EEF]/20 to-transparent origin-left relative overflow-hidden">
                        <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-transparent via-[#B19EEF] to-transparent animate-[shimmer_3s_infinite_2s]" />
                    </div>
                </div>

                <div className="absolute top-4 left-4 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#B19EEF] animate-pulse" />
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="absolute inset-[-40px] border border-[#B19EEF]/10 rounded-full animate-[spin_10s_linear_infinite]" />
                    <div className="absolute inset-[-28px] border border-[#B19EEF]/20 rounded-full border-dashed animate-[spin_15s_linear_infinite_reverse]" />

                    <span className="w-12 h-12 inline-flex items-center justify-center bg-[#B19EEF]/10 border border-[#B19EEF]/20 backdrop-blur-sm shadow-[0_0_30px_rgba(177,158,239,0.15)] animate-pulse">
                        <span className="text-[#B19EEF] text-2xl font-bold leading-none translate-y-[1px]">
                            ✱
                        </span>
                    </span>
                </div>

                <div className="absolute top-0 left-1/2 w-px h-4 bg-white/10" />
                <div className="absolute bottom-0 left-1/2 w-px h-4 bg-white/10" />
                <div className="absolute left-0 top-1/2 h-px w-4 bg-white/10" />
                <div className="absolute right-0 top-1/2 h-px w-4 bg-white/10" />

                <style jsx>{`
                    @keyframes shimmer {
                        0% { transform: translateX(-100%); opacity: 0; }
                        50% { opacity: 1; }
                        100% { transform: translateX(500%); opacity: 0; }
                    }
                `}</style>
            </PixelBlastCard>
        </div>
    );
};
