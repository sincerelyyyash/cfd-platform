"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";

interface AssetQuote {
    symbol: string;
    pair: string;
    price: number;
    change: number;
    priceHistory: number[];
    lastDirection: "up" | "down" | "neutral";
}

const INITIAL_ASSETS: AssetQuote[] = [
    { symbol: "BTC", pair: "BTC/USD", price: 67420.50, change: 2.4, priceHistory: [], lastDirection: "neutral" },
    { symbol: "ETH", pair: "ETH/USD", price: 3450.20, change: -0.8, priceHistory: [], lastDirection: "neutral" },
    { symbol: "SOL", pair: "SOL/USD", price: 148.90, change: 4.1, priceHistory: [], lastDirection: "neutral" },
];

const HISTORY_LENGTH = 20;
const UPDATE_INTERVAL_MS = 800;

const MiniSparkline = ({ data, isPositive }: { data: number[]; isPositive: boolean }) => {
    if (data.length < 2) return null;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const width = 60;
    const height = 24;
    const padding = 2;

    const points = data.map((val, i) => {
        const x = padding + (i / (data.length - 1)) * (width - padding * 2);
        const y = height - padding - ((val - min) / range) * (height - padding * 2);
        return `${x},${y}`;
    }).join(" ");

    return (
        <svg width={width} height={height} className="overflow-visible">
            <polyline
                points={points}
                fill="none"
                stroke={isPositive ? "#B19EEF" : "rgba(255,255,255,0.4)"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {data.length > 0 && (
                <circle
                    cx={padding + ((data.length - 1) / (data.length - 1)) * (width - padding * 2)}
                    cy={height - padding - ((data[data.length - 1] - min) / range) * (height - padding * 2)}
                    r="2"
                    fill={isPositive ? "#B19EEF" : "rgba(255,255,255,0.6)"}
                />
            )}
        </svg>
    );
};

export const QuoteTerminalIllustration = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [assets, setAssets] = useState<AssetQuote[]>(() => {
        return INITIAL_ASSETS.map(asset => ({
            ...asset,
            priceHistory: Array.from({ length: HISTORY_LENGTH }, () =>
                asset.price * (1 + (Math.random() - 0.5) * 0.002)
            ),
        }));
    });

    const updatePrices = useCallback(() => {
        setAssets(prev => prev.map(asset => {
            const volatility = asset.symbol === "SOL" ? 0.003 : asset.symbol === "ETH" ? 0.002 : 0.001;
            const priceChange = asset.price * (Math.random() - 0.5) * volatility;
            const newPrice = asset.price + priceChange;
            const direction: "up" | "down" | "neutral" = priceChange > 0 ? "up" : priceChange < 0 ? "down" : "neutral";

            const newHistory = [...asset.priceHistory.slice(1), newPrice];

            const baseChange = asset.change + (Math.random() - 0.5) * 0.1;

            return {
                ...asset,
                price: newPrice,
                change: parseFloat(baseChange.toFixed(2)),
                priceHistory: newHistory,
                lastDirection: direction,
            };
        }));
    }, []);

    useEffect(() => {
        const interval = setInterval(updatePrices, UPDATE_INTERVAL_MS);
        return () => clearInterval(interval);
    }, [updatePrices]);

    const formatPrice = (price: number, symbol: string) => {
        if (symbol === "BTC") return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        if (symbol === "ETH") return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    return (
        <div ref={containerRef} className="relative w-full h-full p-4 overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />

            <div className="absolute top-3 left-4 z-20 flex items-center gap-2">
                <div className="w-2 h-2 bg-[#B19EEF] rounded-full" />
                <span className="text-[9px] text-white/40 font-space tracking-wider">QUOTE TERMINAL</span>
            </div>

            <div className="absolute top-3 right-4 z-20">
                <div className="bg-[#111114]/90 border border-white/[0.06] px-2.5 py-1 backdrop-blur-sm">
                    <span className="text-[8px] text-white/30 font-space">LIVE</span>
                </div>
            </div>

            <div className="absolute top-10 left-3 right-3 bottom-3 z-10 flex flex-col">
                <div className="flex items-center gap-2 px-3 py-1.5 mb-2 border-b border-white/[0.06]">
                    <span className="w-20 text-[8px] text-white/30 font-space">PAIR</span>
                    <span className="flex-1 text-[8px] text-white/30 font-space text-right">PRICE</span>
                    <span className="w-16 text-[8px] text-white/30 font-space text-right">24H %</span>
                    <span className="w-16 text-[8px] text-white/30 font-space text-right">CHART</span>
                </div>

                <div className="flex-1 flex flex-col gap-2">
                    {assets.map((asset) => (
                        <div
                            key={asset.symbol}
                            data-asset={asset.symbol}
                            className="flex items-center gap-2 px-3 py-3 bg-[#111114]/60 border border-white/[0.04] transition-colors duration-150"
                        >
                            <div className="w-20 flex items-center gap-2">
                                <div className={`w-1.5 h-6 ${asset.change >= 0 ? 'bg-[#B19EEF]' : 'bg-white/30'}`} />
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-mono font-bold text-white">
                                        {asset.symbol}
                                    </span>
                                    <span className="text-[8px] font-mono text-white/30">
                                        USD
                                    </span>
                                </div>
                            </div>

                            <span className={`flex-1 text-[14px] font-mono font-bold text-right transition-colors duration-200 ${asset.lastDirection === "up" ? "text-[#B19EEF]" :
                                asset.lastDirection === "down" ? "text-white/70" : "text-white"
                                }`}>
                                ${formatPrice(asset.price, asset.symbol)}
                            </span>

                            <span className={`w-16 text-[11px] font-mono font-medium text-right ${asset.change >= 0 ? "text-[#B19EEF]" : "text-white/50"
                                }`}>
                                {asset.change >= 0 ? "+" : ""}{asset.change.toFixed(2)}%
                            </span>

                            <div className="w-16 flex justify-end">
                                <MiniSparkline data={asset.priceHistory} isPositive={asset.change >= 0} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="absolute bottom-3 left-3 right-3 z-20">
                <div className="flex items-center justify-between bg-[#111114]/80 border border-white/[0.04] px-3 py-2 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <span className="text-[8px] text-white/30 font-space">3 ASSETS</span>
                        <span className="text-[8px] text-white/20">|</span>
                        <span className="text-[8px] text-white/30 font-space">SPOT</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-[8px] text-white/30 font-space">REFRESH</span>
                        <span className="text-[10px] text-[#B19EEF] font-mono font-medium">800ms</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
