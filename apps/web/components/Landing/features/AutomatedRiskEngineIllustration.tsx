"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export const AutomatedRiskEngineIllustration = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const exposureRef = useRef<HTMLSpanElement>(null);
    const pnlRef = useRef<HTMLSpanElement>(null);
    const marginRef = useRef<HTMLSpanElement>(null);

    useGSAP(
        () => {
            gsap.to(".risk-needle", {
                rotation: 45,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                transformOrigin: "bottom center",
            });

            gsap.to(".risk-hub-glow", {
                opacity: 0.5,
                scale: 1.15,
                duration: 1.2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });

            gsap.to(".exposure-bar", {
                scaleX: 0.7,
                duration: 1.5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                stagger: 0.2,
            });

            gsap.to(".margin-fill", {
                width: "75%",
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });



            const pnlValues = [12847, 12932, 12756, 13021, 12889, 13156, 12978];
            let pnlIdx = 0;
            gsap.to({}, {
                duration: 1.2,
                repeat: -1,
                onRepeat: () => {
                    pnlIdx = (pnlIdx + 1) % pnlValues.length;
                    if (pnlRef.current) pnlRef.current.textContent = `+$${pnlValues[pnlIdx].toLocaleString()}`;
                },
            });

            const exposureValues = [67, 72, 65, 74, 69, 71, 68];
            let expIdx = 0;
            gsap.to({}, {
                duration: 1.8,
                repeat: -1,
                onRepeat: () => {
                    expIdx = (expIdx + 1) % exposureValues.length;
                    if (exposureRef.current) exposureRef.current.textContent = `${exposureValues[expIdx]}%`;
                },
            });

            const marginValues = [42, 45, 41, 47, 44, 46, 43];
            let margIdx = 0;
            gsap.to({}, {
                duration: 1.5,
                repeat: -1,
                onRepeat: () => {
                    margIdx = (margIdx + 1) % marginValues.length;
                    if (marginRef.current) marginRef.current.textContent = `${marginValues[margIdx]}%`;
                },
            });

            gsap.to(".rotating-ring", {
                rotation: 360,
                duration: 20,
                repeat: -1,
                ease: "none",
            });
        },
        { scope: containerRef }
    );

    return (
        <div ref={containerRef} className="relative w-full h-full p-4 overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px]" />

            <div className="absolute top-3 left-4 z-20 flex items-center gap-2">
                <div className="hedge-status w-2 h-2 bg-[#B19EEF] rounded-full" />
                <span className="text-[9px] text-white/40 font-space tracking-wider">RISK ENGINE</span>
            </div>

            <div className="absolute top-3 right-4 z-20">
                <div className="bg-[#111114]/90 border border-[#B19EEF]/20 px-2.5 py-1 backdrop-blur-sm">
                    <div className="flex items-center gap-1.5">
                        <div className="hedge-status w-1.5 h-1.5 bg-[#B19EEF] rounded-full" />
                        <span className="text-[8px] text-white/50 font-space">AUTO-HEDGE</span>
                    </div>
                </div>
            </div>

            <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <svg className="rotating-ring absolute -inset-6 w-[calc(100%+48px)] h-[calc(100%+48px)]" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(177,158,239,0.1)" strokeWidth="1" strokeDasharray="4 6" />
                </svg>

                <div className="risk-hub-glow absolute -inset-3 bg-[#B19EEF]/15 rounded-full blur-lg" />

                <div className="relative w-20 h-20 bg-[#111114] border border-[#B19EEF]/30 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(177,158,239,0.1)]">
                    <svg className="absolute inset-1" viewBox="0 0 72 72">
                        <circle cx="36" cy="36" r="32" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                        <circle cx="36" cy="36" r="32" fill="none" stroke="#B19EEF" strokeWidth="3" strokeDasharray="100 100" strokeLinecap="round" transform="rotate(-90 36 36)" opacity="0.6" />
                    </svg>

                    <div className="risk-needle absolute w-0.5 h-6 bg-[#B19EEF] rounded-full" style={{ bottom: '50%', transformOrigin: 'bottom center' }} />
                    <div className="absolute w-3 h-3 bg-[#B19EEF] rounded-full" />

                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                        <span className="text-[9px] text-[#B19EEF]/70 font-space tracking-wider">LOW RISK</span>
                    </div>
                </div>
            </div>

            <div className="absolute top-[55%] left-4 z-10 flex flex-col gap-1.5">
                <span className="text-[8px] text-white/30 font-space mb-1">EXPOSURE</span>
                <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-white/5 overflow-hidden">
                        <div className="exposure-bar h-full bg-[#B19EEF]/50 origin-left" style={{ width: '80%' }} />
                    </div>
                    <span className="text-[8px] text-white/40 font-mono">BTC</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-white/5 overflow-hidden">
                        <div className="exposure-bar h-full bg-[#B19EEF]/40 origin-left" style={{ width: '60%' }} />
                    </div>
                    <span className="text-[8px] text-white/40 font-mono">ETH</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-white/5 overflow-hidden">
                        <div className="exposure-bar h-full bg-[#B19EEF]/30 origin-left" style={{ width: '40%' }} />
                    </div>
                    <span className="text-[8px] text-white/40 font-mono">SOL</span>
                </div>
            </div>

            <div className="absolute top-[55%] right-4 z-10 flex flex-col gap-2">
                <div className="bg-[#111114]/80 border border-white/[0.04] px-2.5 py-1.5">
                    <span className="text-[7px] text-white/30 font-space block">NET EXP</span>
                    <span ref={exposureRef} className="text-[12px] text-[#B19EEF] font-mono font-medium">67%</span>
                </div>
                <div className="bg-[#111114]/80 border border-white/[0.04] px-2.5 py-1.5">
                    <span className="text-[7px] text-white/30 font-space block">MARGIN</span>
                    <span ref={marginRef} className="text-[12px] text-white/70 font-mono font-medium">42%</span>
                </div>
            </div>

            <div className="absolute bottom-3 left-3 right-3 z-20">
                <div className="flex items-center justify-between bg-[#111114]/80 border border-white/[0.04] px-3 py-2 backdrop-blur-sm">
                    <div className="flex items-center gap-3 flex-1">
                        <span className="text-[8px] text-white/30 font-space">MARGIN UTIL</span>
                        <div className="flex-1 max-w-[80px] h-1.5 bg-white/5 overflow-hidden">
                            <div className="margin-fill h-full bg-[#B19EEF]/60" style={{ width: '45%' }} />
                        </div>
                    </div>
                    <div className="w-px h-4 bg-white/10 mx-3" />
                    <div className="flex items-center gap-1.5">
                        <span className="text-[8px] text-white/30 font-space">P&L</span>
                        <span ref={pnlRef} className="text-[11px] text-[#B19EEF] font-mono font-medium">+$12,847</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
