"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";

interface Trade {
    id: string;
    side: "buy" | "sell";
    price: number;
    size: number;
    time: string;
    isLarge: boolean;
}

const generateTrade = (): Trade => {
    const side = Math.random() > 0.5 ? "buy" : "sell";
    const basePrice = 67842.5;
    const priceVariation = (Math.random() - 0.5) * 20;
    const price = basePrice + priceVariation;
    const size = Math.random() < 0.15
        ? parseFloat((Math.random() * 5 + 2).toFixed(4))
        : parseFloat((Math.random() * 0.5 + 0.01).toFixed(4));
    const isLarge = size > 2;
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0').slice(0, 2)}`;

    return {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        side,
        price,
        size,
        time,
        isLarge,
    };
};

const MAX_TRADES = 8;
const TRADE_INTERVAL_MS = 400;

export const TradeTapeIllustration = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [trades, setTrades] = useState<Trade[]>(() => {
        const initial: Trade[] = [];
        for (let i = 0; i < MAX_TRADES; i++) {
            initial.push(generateTrade());
        }
        return initial;
    });

    const addTrade = useCallback(() => {
        const newTrade = generateTrade();

        setTrades(prev => {
            const updated = [newTrade, ...prev];
            if (updated.length > MAX_TRADES) {
                updated.pop();
            }
            return updated;
        });

        requestAnimationFrame(() => {
            const newRow = containerRef.current?.querySelector(`[data-trade-id="${newTrade.id}"]`);
            if (newRow) {
                gsap.fromTo(newRow,
                    { opacity: 0, y: -20, scale: 1.02 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: "power2.out" }
                );

                if (newTrade.isLarge) {
                    gsap.fromTo(newRow,
                        { boxShadow: "0 0 20px rgba(177, 158, 239, 0.6)" },
                        { boxShadow: "0 0 0px rgba(177, 158, 239, 0)", duration: 0.8, ease: "power2.out" }
                    );
                }
            }
        });
    }, []);

    useEffect(() => {
        const interval = setInterval(addTrade, TRADE_INTERVAL_MS);
        return () => clearInterval(interval);
    }, [addTrade]);

    return (
        <div ref={containerRef} className="relative w-full h-full p-4 overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />

            <div className="absolute top-3 left-4 z-20 flex items-center gap-2">
                <div className="w-2 h-2 bg-[#B19EEF] rounded-full" />
                <span className="text-[9px] text-white/40 font-space tracking-wider">TRADE TAPE</span>
            </div>

            <div className="absolute top-3 right-4 z-20">
                <div className="bg-[#111114]/90 border border-white/[0.06] px-2.5 py-1 backdrop-blur-sm">
                    <div className="flex items-center gap-1.5">
                        <span className="text-[8px] text-white/30 font-space">BTC/USD</span>
                    </div>
                </div>
            </div>

            <div className="absolute top-10 left-3 right-3 bottom-3 z-10 flex flex-col gap-0.5 overflow-hidden">
                <div className="flex items-center gap-2 px-2 py-1 mb-1 border-b border-white/[0.06]">
                    <span className="w-12 text-[8px] text-white/30 font-space">SIDE</span>
                    <span className="flex-1 text-[8px] text-white/30 font-space text-right">PRICE</span>
                    <span className="w-16 text-[8px] text-white/30 font-space text-right">SIZE</span>
                    <span className="w-16 text-[8px] text-white/30 font-space text-right">TIME</span>
                </div>

                <div className="flex-1 overflow-hidden">
                    {trades.map((trade) => (
                        <div
                            key={trade.id}
                            data-trade-id={trade.id}
                            className={`
                                flex items-center gap-2 px-2 py-1.5 mb-0.5 transition-colors duration-150
                                bg-[#111114]/60 border border-white/[0.04]
                                ${trade.isLarge ? 'bg-[#B19EEF]/10 border-[#B19EEF]/20' : ''}
                            `}
                        >
                            <div className="w-12 flex items-center gap-1">
                                <div className={`w-1 h-4 ${trade.side === 'buy' ? 'bg-[#B19EEF]' : 'bg-white/40'}`} />
                                <span className={`text-[9px] font-mono font-bold ${trade.side === 'buy' ? 'text-[#B19EEF]' : 'text-white/60'}`}>
                                    {trade.side.toUpperCase()}
                                </span>
                            </div>

                            <span className={`flex-1 text-[11px] font-mono font-medium text-right ${trade.side === 'buy' ? 'text-[#B19EEF]' : 'text-white/70'}`}>
                                {trade.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>

                            <span className={`w-16 text-[10px] font-mono text-right ${trade.isLarge ? 'text-white font-bold' : 'text-white/50'}`}>
                                {trade.size.toFixed(4)}
                            </span>

                            <span className="w-16 text-[9px] font-mono text-white/30 text-right">
                                {trade.time}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="absolute bottom-3 left-3 right-3 z-20">
                <div className="flex items-center justify-between bg-[#111114]/80 border border-white/[0.04] px-3 py-2 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <div className="w-1 h-3 bg-[#B19EEF]" />
                            <span className="text-[8px] text-white/30 font-space">BUY</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1 h-3 bg-white/40" />
                            <span className="text-[8px] text-white/30 font-space">SELL</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-[8px] text-white/30 font-space">LATENCY</span>
                        <span className="text-[10px] text-[#B19EEF] font-mono font-medium">&lt;5ms</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
