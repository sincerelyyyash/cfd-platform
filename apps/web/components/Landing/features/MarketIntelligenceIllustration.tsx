"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export const MarketIntelligenceIllustration = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const signalCountRef = useRef<HTMLSpanElement>(null);

    useGSAP(
        () => {
            gsap.fromTo(
                ".candle-bar",
                { scaleY: 0, transformOrigin: "bottom" },
                {
                    scaleY: 1,
                    duration: 0.6,
                    stagger: 0.08,
                    ease: "power2.out",
                }
            );

            gsap.to(".volume-bar", {
                opacity: 0.5,
                duration: 0.8,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                stagger: 0.1,
            });

            gsap.to(".liquidity-cluster", {
                scale: 1.3,
                opacity: 0.3,
                duration: 1.2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                stagger: 0.3,
            });



            gsap.to(".scan-line", {
                x: "100%",
                duration: 2,
                repeat: -1,
                ease: "none",
            });

            const signals = [12, 13, 14, 13, 15, 14, 16, 15];
            let idx = 0;
            gsap.to({}, {
                duration: 1.5,
                repeat: -1,
                onRepeat: () => {
                    idx = (idx + 1) % signals.length;
                    if (signalCountRef.current) signalCountRef.current.textContent = signals[idx].toString();
                },
            });


        },
        { scope: containerRef }
    );

    const candles = [
        { open: 60, close: 75, high: 80, low: 55, green: true },
        { open: 75, close: 65, high: 78, low: 60, green: false },
        { open: 65, close: 80, high: 85, low: 62, green: true },
        { open: 80, close: 70, high: 82, low: 65, green: false },
        { open: 70, close: 85, high: 90, low: 68, green: true },
        { open: 85, close: 78, high: 88, low: 75, green: false },
        { open: 78, close: 92, high: 95, low: 76, green: true },
        { open: 92, close: 88, high: 94, low: 85, green: false },
    ];

    return (
        <div ref={containerRef} className="relative w-full h-full p-4 overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />

            <div className="absolute inset-0 overflow-hidden pointer-events-none z-[15]">
                <div className="scan-line absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-[#B19EEF]/30 to-transparent" style={{ transform: 'translateX(-100%)' }} />
            </div>

            <div className="absolute top-3 left-4 z-20 flex items-center gap-2">
                <div className="signal-alert w-2 h-2 bg-[#B19EEF] rounded-full" />
                <span className="text-[9px] text-white/40 font-space tracking-wider">MARKET INTEL</span>
            </div>

            <div className="absolute top-3 right-4 z-20">
                <div className="bg-[#111114]/90 border border-[#B19EEF]/20 px-2.5 py-1 backdrop-blur-sm">
                    <div className="flex items-center gap-1.5">
                        <span className="text-[8px] text-white/30 font-space">SIGNALS</span>
                        <span ref={signalCountRef} className="text-[13px] text-[#B19EEF] font-mono font-bold">12</span>
                    </div>
                </div>
            </div>

            <div className="absolute top-10 left-4 right-4 h-[45%] z-10">
                <div className="relative w-full h-full flex items-end justify-between gap-1 px-1">
                    {candles.map((candle, i) => (
                        <div key={i} className="candle-bar relative flex-1 flex flex-col items-center">
                            <div
                                className="w-px bg-white/20"
                                style={{ height: `${candle.high - candle.low}%`, marginBottom: `${candle.low - 50}%` }}
                            />
                            <div
                                className={`w-full ${candle.green ? 'bg-[#B19EEF]/70' : 'bg-white/20'}`}
                                style={{
                                    height: `${Math.abs(candle.close - candle.open)}%`,
                                    minHeight: '8px',
                                }}
                            />
                        </div>
                    ))}
                </div>

                <div className="liquidity-cluster absolute top-[20%] right-[15%] w-6 h-6 rounded-full border border-[#B19EEF]/30 bg-[#B19EEF]/10" />
                <div className="liquidity-cluster absolute top-[60%] left-[25%] w-4 h-4 rounded-full border border-[#B19EEF]/20 bg-[#B19EEF]/5" />
            </div>

            <div className="absolute bottom-[28%] left-4 right-4 h-[15%] z-10">
                <div className="relative w-full h-full flex items-end justify-between gap-1 px-1">
                    {[35, 50, 40, 70, 45, 85, 55, 60].map((vol, i) => (
                        <div
                            key={i}
                            className={`volume-bar flex-1 ${i === 5 ? 'bg-[#B19EEF]/60' : 'bg-white/10'}`}
                            style={{ height: `${vol}%` }}
                        />
                    ))}
                </div>
                <div className="absolute -top-4 right-[18%] flex flex-col items-center">
                    <span className="text-[7px] text-[#B19EEF]/80 font-space">SPIKE</span>
                    <svg className="w-2 h-2 text-[#B19EEF]/60" viewBox="0 0 8 8" fill="currentColor">
                        <polygon points="4,8 0,0 8,0" />
                    </svg>
                </div>
            </div>

            <div className="absolute top-[35%] right-[20%] z-20">
                <div className="relative">
                    <div className="anomaly-ping absolute inset-0 rounded-full bg-[#B19EEF]/40" />
                    <div className="relative w-3 h-3 rounded-full bg-[#B19EEF] flex items-center justify-center">
                        <span className="text-[6px] text-black font-bold">!</span>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-3 left-3 right-3 z-20">
                <div className="flex items-center justify-between bg-[#111114]/80 border border-white/[0.04] px-3 py-2 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[8px] text-white/30 font-space">VOL Δ</span>
                            <span className="text-[10px] text-[#B19EEF] font-mono font-medium">+247%</span>
                        </div>
                        <div className="w-px h-3 bg-white/10" />
                        <div className="flex items-center gap-1.5">
                            <span className="text-[8px] text-white/30 font-space">LIQ</span>
                            <span className="text-[10px] text-[#B19EEF] font-mono font-medium">$2.4M</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="signal-alert w-1.5 h-1.5 bg-[#B19EEF] rounded-full" />
                        <span className="text-[9px] text-white/50 font-space">Anomaly detected</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
