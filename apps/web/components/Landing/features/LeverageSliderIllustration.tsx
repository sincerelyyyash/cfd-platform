"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

const LEVERAGE_LEVELS = [
    { value: 1, label: "1x" },
    { value: 5, label: "5x" },
    { value: 10, label: "10x" },
    { value: 20, label: "20x" },
    { value: 50, label: "50x" },
    { value: 100, label: "100x" },
];

const BASE_MARGIN = 1000;
const CYCLE_INTERVAL_MS = 1200;

export const LeverageSliderIllustration = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const indicatorRef = useRef<HTMLDivElement>(null);
    const positionRef = useRef<HTMLSpanElement>(null);

    const currentLeverage = LEVERAGE_LEVELS[currentIndex];
    const positionSize = BASE_MARGIN * currentLeverage.value;

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % LEVERAGE_LEVELS.length);
        }, CYCLE_INTERVAL_MS);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (indicatorRef.current) {
            const targetX = currentIndex * (100 / (LEVERAGE_LEVELS.length - 1));
            gsap.to(indicatorRef.current, {
                left: `${targetX}%`,
                duration: 0.4,
                ease: "power2.out"
            });
        }

        if (positionRef.current) {
            gsap.fromTo(positionRef.current,
                { scale: 1.1, opacity: 0.7 },
                { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" }
            );
        }
    }, [currentIndex]);

    return (
        <div className="relative w-full h-full p-4 overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />

            <div className="absolute top-3 left-4 z-20 flex items-center gap-2">
                <div className="w-2 h-2 bg-[#B19EEF] rounded-full" />
                <span className="text-[9px] text-white/40 font-space tracking-wider">LEVERAGE CONTROL</span>
            </div>

            <div className="absolute top-3 right-4 z-20">
                <div className="bg-[#111114]/90 border border-white/[0.06] px-2.5 py-1 backdrop-blur-sm">
                    <span className="text-[10px] text-[#B19EEF] font-mono font-bold">{currentLeverage.label}</span>
                </div>
            </div>

            <div className="absolute top-14 left-4 right-4 z-10">
                <div className="flex justify-between items-end mb-8">
                    <div className="flex flex-col gap-1">
                        <span className="text-[8px] text-white/30 font-space tracking-wider">MARGIN</span>
                        <span className="text-[14px] text-white/60 font-mono font-medium">
                            ${BASE_MARGIN.toLocaleString()}
                        </span>
                    </div>
                    <div className="flex flex-col gap-1 text-right">
                        <span className="text-[8px] text-white/30 font-space tracking-wider">POSITION SIZE</span>
                        <span
                            ref={positionRef}
                            className="text-[18px] text-[#B19EEF] font-mono font-bold"
                        >
                            ${positionSize.toLocaleString()}
                        </span>
                    </div>
                </div>

                <div className="relative mt-4">
                    <div className="absolute left-0 right-0 h-1 bg-white/[0.06] top-[6px] -translate-y-1/2" />

                    <div
                        className="absolute h-1 bg-[#B19EEF]/40 top-[6px] -translate-y-1/2 left-0 transition-all duration-400 ease-out"
                        style={{ width: `${currentIndex * (100 / (LEVERAGE_LEVELS.length - 1))}%` }}
                    />

                    <div className="relative h-8">
                        {LEVERAGE_LEVELS.map((level, index) => (
                            <div
                                key={level.value}
                                className="absolute top-0 flex flex-col items-center gap-2 z-10"
                                style={{
                                    left: `${index * (100 / (LEVERAGE_LEVELS.length - 1))}%`,
                                    transform: 'translateX(-50%)'
                                }}
                            >
                                <div
                                    className={`w-3 h-3 border transition-all duration-300 ${index <= currentIndex
                                        ? 'bg-[#B19EEF] border-[#B19EEF]'
                                        : 'bg-[#111114] border-white/20'
                                        }`}
                                />
                                <span className={`text-[9px] font-mono transition-colors duration-300 ${index === currentIndex
                                    ? 'text-[#B19EEF] font-bold'
                                    : index < currentIndex
                                        ? 'text-white/50'
                                        : 'text-white/30'
                                    }`}>
                                    {level.label}
                                </span>
                            </div>
                        ))}

                        <div
                            ref={indicatorRef}
                            className="absolute top-[-8px] flex justify-center"
                            style={{ left: '0%', width: '12px', marginLeft: '-6px' }}
                        >
                            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#B19EEF]" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-3 left-3 right-3 z-20">
                <div className="flex items-center justify-between bg-[#111114]/80 border border-white/[0.04] px-3 py-2 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <span className="text-[8px] text-white/30 font-space">CROSS MARGIN</span>
                        <span className="text-[8px] text-white/20">|</span>
                        <span className="text-[8px] text-white/30 font-space">ISOLATED</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-[8px] text-white/30 font-space">MAX</span>
                        <span className="text-[10px] text-[#B19EEF] font-mono font-medium">100x</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
