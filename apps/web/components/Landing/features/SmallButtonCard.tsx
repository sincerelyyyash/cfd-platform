"use client";

import { useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";

const PixelBlast = dynamic(() => import("../../ui/PixelBlast"), { ssr: false });

const VENUES = [
    "BINANCE", "BYBIT", "OKX", "DERIBIT", "COINBASE", "KRAKEN", "HTX", "BITFINEX", "BINANCE", "BYBIT", "OKX", "DERIBIT"
];

export const SmallButtonCard = () => {
    const tickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!tickerRef.current) return;

        const totalWidth = tickerRef.current.scrollWidth / 2;

        gsap.to(tickerRef.current, {
            x: -totalWidth,
            duration: 20,
            ease: "none",
            repeat: -1
        });
    }, []);

    return (
        <div className="relative w-full h-[88px] group overflow-hidden">
            <div className="absolute inset-0 z-0">
                <PixelBlast
                    variant="square"
                    pixelSize={3}
                    color="#B19EEF"
                    patternDensity={1.2}
                    patternScale={2}
                    speed={0.4}
                    edgeFade={0}
                    enableRipples={true}
                    rippleIntensityScale={0.5}
                />
            </div>
            <div className="absolute inset-[4px] z-10 bg-[#111114] flex items-center overflow-hidden cursor-default group-hover:bg-[#16161a] transition-colors duration-300">
                <div className="absolute left-0 top-0 bottom-0 w-8 z-20 bg-gradient-to-r from-[#111114] to-transparent pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-8 z-20 bg-gradient-to-l from-[#111114] to-transparent pointer-events-none" />

                <div ref={tickerRef} className="flex items-center gap-8 whitespace-nowrap pl-4">
                    {VENUES.map((venue, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <span className="text-white/40 text-[13px] font-bold tracking-widest uppercase font-space group-hover:text-white/60 transition-colors duration-300">
                                {venue}
                            </span>
                            <div className="w-1 h-1 rounded-full bg-[#B19EEF]/50" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
