import React, { useRef } from 'react';
import { ArrowUpRight, Activity, Zap, BarChart2, Globe, Wifi, Server, Database, TrendingUp, Clock, Layers } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { TradingCard } from './TradingCard';

export const HeroGrid = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from(".grid-card", {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            delay: 0.2
        });

        gsap.to(".ping-dot", {
            scale: 2,
            opacity: 0,
            duration: 1.5,
            repeat: -1,
            stagger: 0.5
        });

    }, { scope: containerRef });

    const candles = [
        { o: 40, c: 45, h: 48, l: 38 }, { o: 45, c: 42, h: 46, l: 40 }, { o: 42, c: 55, h: 58, l: 41 },
        { o: 55, c: 52, h: 56, l: 50 }, { o: 52, c: 68, h: 70, l: 51 }, { o: 68, c: 64, h: 70, l: 60 },
        { o: 64, c: 50, h: 65, l: 48 }, { o: 50, c: 55, h: 58, l: 48 }, { o: 55, c: 75, h: 78, l: 52 },
        { o: 75, c: 70, h: 76, l: 68 }, { o: 70, c: 85, h: 88, l: 69 }, { o: 85, c: 80, h: 86, l: 78 },
        { o: 80, c: 92, h: 95, l: 79 }, { o: 92, c: 88, h: 94, l: 85 }
    ];

    return (
        <div ref={containerRef} className="h-full flex flex-col justify-start pt-32 pb-10 gap-6 z-10 font-sans w-full max-w-[390px]">

            <div className="grid grid-cols-2 gap-3 w-full">

                <div className="grid-card col-span-2 h-[220px] bg-[#050505] border border-white/10 relative flex flex-col shadow-xl hover:border-[#B19EEF]/40 transition-colors duration-300 group">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 bg-white/[0.02]">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-5 h-5 bg-[#B19EEF] text-black text-[10px] font-bold rounded-[1px]">B</div>
                            <span className="text-white font-bitcount font-bold text-sm tracking-tight">BTC-USD</span>
                            <span className="px-1.5 py-[1px] bg-white/5 border border-white/10 text-[9px] text-neutral-400 uppercase tracking-wider rounded-[1px]">Perp</span>
                        </div>
                        <div className="text-right flex items-center gap-2">
                            <span className="text-emerald-400 text-[10px] flex items-center bg-emerald-400/10 px-1 rounded-[1px]">+2.4%</span>
                            <span className="text-white font-mono text-xs tracking-tight">$48,234.5</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/5 text-[9px] text-neutral-500 font-mono">
                        <div className="flex gap-3">
                            <span>H: <span className="text-neutral-300">49,102</span></span>
                            <span>L: <span className="text-neutral-300">47,205</span></span>
                        </div>
                        <div className="flex gap-3">
                            <span>Vol: <span className="text-[#B19EEF]">1.2B</span></span>
                            <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Live</span>
                        </div>
                    </div>

                    <div className="flex-1 relative flex">
                        <div className="flex-1 relative p-3 flex items-end gap-[2px] overflow-hidden">
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px] opacity-30" />

                            {candles.map((c, i) => {
                                const isUp = c.c >= c.o;
                                const color = isUp ? "#B19EEF" : "#ef4444";
                                return (
                                    <div key={i} className="relative flex-1 h-full flex flex-col justify-end items-center group/candle hover:opacity-100 opacity-90 transition-opacity">
                                        <div className="w-[1px] bg-current opacity-40 mb-[1px]" style={{ height: `${c.h - c.l}%`, color: color }} />
                                        <div className="w-full max-w-[8px] min-w-[2px]" style={{ height: `${Math.max(1, Math.abs(c.c - c.o))}%`, backgroundColor: color }} />
                                    </div>
                                );
                            })}

                            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                                <path d="M0,180 Q30,170 60,150 T120,130 T180,100 T240,80 T300,60 T360,90" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeOpacity="0.5" />
                            </svg>
                        </div>

                        <div className="w-[80px] border-l border-white/5 bg-[#050505]/80 backdrop-blur-sm flex flex-col text-[8px] font-mono">
                            <div className="flex-1 flex flex-col justify-end pb-1 border-b border-white/5 border-dashed">
                                {[
                                    { p: "235.5", s: "0.2" }, { p: "235.0", s: "1.5" }, { p: "234.5", s: "0.5" }
                                ].map((o, i) => (
                                    <div key={i} className="flex justify-between px-1 py-0.5 text-red-400">
                                        <span>{o.p}</span><span className="opacity-70">{o.s}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="py-1 text-center text-white bg-white/5 font-bold border-y border-white/5">
                                234.5
                            </div>
                            <div className="flex-1 flex flex-col pt-1">
                                {[
                                    { p: "234.0", s: "2.1" }, { p: "233.5", s: "0.8" }, { p: "233.0", s: "1.2" }
                                ].map((o, i) => (
                                    <div key={i} className="flex justify-between px-1 py-0.5 text-[#B19EEF]">
                                        <span>{o.p}</span><span className="opacity-70">{o.s}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid-card col-span-1 h-[150px] bg-[#050505] border border-white/10 p-0 flex flex-col shadow-xl hover:border-white/20 transition-colors duration-300">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 bg-white/[0.02]">
                        <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">Network</span>
                        <Server size={10} className="text-neutral-500" />
                    </div>

                    <div className="flex-1 p-3 flex flex-col gap-2 overflow-hidden">
                        {[
                            { loc: "Tokyo (TY3)", ms: 12, status: "good" },
                            { loc: "London (LD4)", ms: 84, status: "ok" },
                            { loc: "New York (NY4)", ms: 142, status: "ok" }
                        ].map((server, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <div className={`w-1 h-1 rounded-full ${server.status === 'good' ? 'bg-[#B19EEF]' : 'bg-emerald-500/50'}`} />
                                    <span className="text-[9px] text-neutral-400 font-mono tracking-tight">{server.loc}</span>
                                </div>
                                <span className="text-[9px] text-white font-mono">{server.ms}ms</span>
                            </div>
                        ))}

                        <div className="mt-auto pt-2 border-t border-white/5 flex items-center justify-between">
                            <span className="text-[8px] text-neutral-600 uppercase">Packet Loss: 0%</span>
                            <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-0.5 h-2 bg-emerald-500/50 rounded-full" />)}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid-card col-span-1 h-[150px] bg-[#050505] border border-white/10 p-0 flex flex-col shadow-xl hover:border-white/20 transition-colors duration-300">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 bg-white/[0.02]">
                        <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">Inst. Flow</span>
                        <Layers size={10} className="text-neutral-500" />
                    </div>

                    <div className="flex-1 p-0 flex flex-col">
                        <div className="px-3 py-1.5 flex justify-between items-end border-b border-white/5">
                            <div className="flex flex-col">
                                <span className="text-[9px] text-neutral-500">Net Flow (1h)</span>
                                <span className="text-xs font-mono text-white">+$12.4M</span>
                            </div>
                            <Activity size={12} className="text-[#B19EEF]" />
                        </div>

                        <div className="flex-1 p-2 space-y-1 overflow-hidden">
                            {[
                                { t: "12:45", amt: "50 BTC", side: "Buy" },
                                { t: "12:44", amt: "120 ETH", side: "Sell" },
                                { t: "12:42", amt: "25 BTC", side: "Buy" }
                            ].map((tx, i) => (
                                <div key={i} className="flex justify-between items-center text-[9px] px-1 py-0.5 hover:bg-white/5 rounded-[1px]">
                                    <span className="text-neutral-500 font-mono">{tx.t}</span>
                                    <span className="text-white font-medium">{tx.amt}</span>
                                    <span className={tx.side === 'Buy' ? "text-[#B19EEF]" : "text-red-400"}>{tx.side}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid-card w-full">
                <TradingCard />
            </div>

        </div>
    );
};
