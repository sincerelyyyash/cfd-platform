
import React from "react";
import { ArrowUpRight, Activity, BarChart2 } from "lucide-react";

export const TradingCard = () => {
    return (
        <div className="relative w-full max-w-[440px] bg-[#050505] border border-white/5 shadow-2xl font-bitcount flex flex-col">
            <div className="absolute top-[-1px] left-[-100vw] right-[-100vw] h-[1px] bg-white/5 -z-10" />
            <div className="absolute bottom-[-1px] left-[-100vw] right-[-100vw] h-[1px] bg-white/5 -z-10" />
            <div className="absolute left-[-1px] top-[-100vh] bottom-[-100vh] w-[1px] bg-white/5 -z-10" />
            <div className="absolute right-[-1px] top-[-100vh] bottom-[-100vh] w-[1px] bg-white/5 -z-10" />

            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-white/[0.02]">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <span className="text-white text-lg font-bold tracking-tight">BTC-USD</span>
                        <span className="px-1.5 py-0.5 rounded-[2px] bg-[#B19EEF]/10 text-[#B19EEF] text-[10px] font-medium tracking-wider uppercase border border-[#B19EEF]/20">Perp</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-lg text-white font-medium tracking-tighter">48,234.50</span>
                        <span className="flex items-center gap-1 text-[#B19EEF] text-xs">
                            <ArrowUpRight size={12} />
                            <span>+2.45%</span>
                        </span>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className="text-neutral-500 text-[10px] font-sans uppercase tracking-wider">24h Volume</span>
                    <span className="text-white text-xs font-medium">1.2B USD</span>
                </div>
            </div>

            <div className="h-[220px] w-full border-b border-white/5 flex flex-col">
                <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/[0.01]">
                    <div className="flex items-center gap-1">
                        {['1H', '4H', '1D'].map((tf, i) => (
                            <button key={tf} className={`px-2 py-0.5 text-[10px] font-medium rounded-[2px] ${i === 1 ? 'text-[#B19EEF] bg-[#B19EEF]/5' : 'text-neutral-500 hover:text-white'}`}>
                                {tf}
                            </button>
                        ))}
                    </div>
                    <Activity size={12} className="text-neutral-600" />
                </div>
                <div className="relative flex-1 bg-[#050505] overflow-hidden">
                    <div className="absolute top-[25%] left-0 right-0 h-[1px] bg-white/[0.02]" />
                    <div className="absolute top-[50%] left-0 right-0 h-[1px] bg-white/[0.02]" />
                    <div className="absolute top-[75%] left-0 right-0 h-[1px] bg-white/[0.02]" />

                    <div className="absolute inset-0 flex justify-between px-2 pb-4 gap-[2px] items-end pointer-events-none">
                        {[
                            { o: 40, c: 42, h: 45, l: 38 }, { o: 42, c: 35, h: 44, l: 33 }, { o: 35, c: 55, h: 58, l: 32 },
                            { o: 55, c: 55, h: 60, l: 50 }, { o: 55, c: 50, h: 56, l: 48 }, { o: 50, c: 65, h: 68, l: 49 },
                            { o: 65, c: 60, h: 66, l: 58 }, { o: 60, c: 45, h: 62, l: 42 }, { o: 45, c: 48, h: 50, l: 43 },
                            { o: 48, c: 52, h: 54, l: 46 }, { o: 52, c: 75, h: 78, l: 50 }, { o: 75, c: 72, h: 77, l: 70 },
                            { o: 72, c: 68, h: 74, l: 65 }, { o: 68, c: 70, h: 72, l: 66 }, { o: 70, c: 82, h: 85, l: 68 },
                            { o: 82, c: 80, h: 84, l: 78 }, { o: 80, c: 78, h: 82, l: 76 }, { o: 78, c: 60, h: 80, l: 58 },
                            { o: 60, c: 65, h: 68, l: 55 }, { o: 65, c: 75, h: 78, l: 62 }, { o: 75, c: 75, h: 80, l: 70 },
                            { o: 75, c: 88, h: 92, l: 72 }, { o: 88, c: 85, h: 90, l: 82 }, { o: 85, c: 92, h: 95, l: 83 },
                            { o: 92, c: 85, h: 94, l: 80 }
                        ].map((c, i) => {
                            const isUp = c.c >= c.o;
                            const color = isUp ? "#B19EEF" : "#ef4444";
                            const height = Math.max(1, Math.abs(c.c - c.o));
                            const bottom = Math.min(c.c, c.o);
                            const wickHeight = c.h - c.l;
                            const wickBottom = c.l;

                            return (
                                <div key={i} className="relative flex-1 group h-full">
                                    <div
                                        className="absolute left-1/2 -translate-x-1/2 w-[1px]"
                                        style={{
                                            backgroundColor: color,
                                            height: `${wickHeight}%`,
                                            bottom: `${wickBottom}%`,
                                            opacity: 0.5
                                        }}
                                    />
                                    <div
                                        className="absolute left-1/2 -translate-x-1/2 w-[70%]"
                                        style={{
                                            backgroundColor: color,
                                            height: `${height}%`,
                                            bottom: `${bottom}%`,
                                            opacity: isUp ? 0.9 : 0.8
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </div>

                    <div className="absolute right-0 top-2 bottom-2 flex flex-col justify-between text-[9px] text-neutral-600 px-1 font-sans">
                        <span>48.8k</span>
                        <span>48.2k</span>
                        <span>47.6k</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 min-h-[200px] flex flex-col bg-white/[0.01]">
                <div className="flex border-b border-white/5">
                    <button className="flex-1 py-2 text-[10px] font-medium text-white border-b border-[#B19EEF] bg-white/[0.02]">Recent Trades</button>
                    <button className="flex-1 py-2 text-[10px] font-medium text-neutral-500 hover:text-neutral-300">Market Info</button>
                </div>
                <div className="flex-1 p-2 flex flex-col">
                    <div className="grid grid-cols-3 text-[9px] text-neutral-600 mb-2 font-sans uppercase px-2">
                        <span className="text-left">Price</span>
                        <span className="text-right">Size (BTC)</span>
                        <span className="text-right">Time</span>
                    </div>

                    <div className="flex-1 space-y-[1px]">
                        {[
                            { p: "48,234.50", s: "0.45", t: "12:45:02", side: "buy" },
                            { p: "48,234.00", s: "0.12", t: "12:45:01", side: "sell" },
                            { p: "48,234.50", s: "2.50", t: "12:44:58", side: "buy" },
                            { p: "48,233.50", s: "1.10", t: "12:44:55", side: "sell" },
                            { p: "48,234.00", s: "0.05", t: "12:44:50", side: "buy" },
                            { p: "48,235.00", s: "1.50", t: "12:44:48", side: "buy" },
                        ].map((trade, i) => (
                            <div key={i} className="grid grid-cols-3 text-[10px] relative hover:bg-white/5 py-[3px] px-2 cursor-pointer border-b border-white/[0.02] last:border-0 group">
                                <span className={`font-medium z-10 text-left font-space ${trade.side === 'buy' ? 'text-[#B19EEF]' : 'text-neutral-400'}`}>{trade.p}</span>
                                <span className="text-neutral-300 z-10 text-right">{trade.s}</span>
                                <span className="text-neutral-500 z-10 text-right font-sans">{trade.t}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-4 border-t border-white/5 bg-[#0A0A0A]">
                <div className="space-y-3">
                    <div className="flex gap-2">
                        <div className="flex-1 space-y-1">
                            <label className="text-[9px] text-neutral-500 uppercase font-sans">Price</label>
                            <div className="bg-[#050505] border border-white/5 rounded-[2px] px-2 py-1.5 flex items-center justify-between">
                                <span className="text-white text-xs">48,234.5</span>
                                <span className="text-neutral-600 text-[9px]">USD</span>
                            </div>
                        </div>
                        <div className="flex-1 space-y-1">
                            <label className="text-[9px] text-neutral-500 uppercase font-sans">Size</label>
                            <div className="bg-[#050505] border border-white/5 rounded-[2px] px-2 py-1.5 flex items-center justify-between">
                                <span className="text-white text-xs">0.5</span>
                                <span className="text-neutral-600 text-[9px]">BTC</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <div className="flex justify-between mb-1">
                            <span className="text-[9px] text-neutral-500">Leverage</span>
                            <span className="text-[9px] text-[#B19EEF]">20x</span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full relative">
                            <div className="absolute left-0 top-0 bottom-0 w-[20%] bg-[#B19EEF] rounded-full"></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-1">
                        <button className="py-2.5 bg-[#B19EEF] hover:bg-[#9f85e8] text-black font-bold text-xs uppercase tracking-wide rounded-[2px] transition-colors">
                            Buy
                        </button>
                        <button className="py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wide rounded-[2px] transition-colors">
                            Sell
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
