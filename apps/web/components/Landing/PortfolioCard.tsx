import React from "react";
import { ArrowUpRight, Wallet, TrendingUp, DollarSign } from "lucide-react";

export const PortfolioCard = () => {
    return (
        <div className="w-full max-w-[360px] bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden group font-sans">
            <div className="absolute inset-0 bg-gradient-to-br from-[#B19EEF]/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

            <div className="relative flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-neutral-400 text-xs font-medium uppercase tracking-wider mb-1">Total Equity</h3>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-white font-space tracking-tight">$124,592.40</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2">
                        <div className="bg-[#B19EEF]/20 text-[#B19EEF] text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                            <ArrowUpRight size={10} />
                            +12.5%
                        </div>
                        <span className="text-neutral-500 text-[10px]">vs last month</span>
                    </div>
                </div>
                <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                    <Wallet className="text-white" size={20} />
                </div>
            </div>

            <div className="relative h-24 w-full mb-6 border-b border-white/5 pb-4">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    <path d="M0,80 C30,75 60,85 90,60 S150,40 200,50 S300,20 360,10"
                        fill="none"
                        stroke="#B19EEF"
                        strokeWidth="2"
                    />
                    <path d="M0,80 C30,75 60,85 90,60 S150,40 200,50 S300,20 360,10 V100 H0 Z"
                        fill="url(#grad)"
                        opacity="0.2"
                    />
                    <defs>
                        <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#B19EEF" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#B19EEF" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                </svg>


                <div className="absolute top-[10%] right-[10%] w-2 h-2 bg-[#B19EEF] rounded-full shadow-[0_0_10px_#B19EEF]" />
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10">
                <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-neutral-500 text-[10px] uppercase">
                        <DollarSign size={10} />
                        <span>Available Margin</span>
                    </div>
                    <p className="text-white font-medium font-space tracking-wide">$42,300.00</p>
                </div>
                <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-neutral-500 text-[10px] uppercase">
                        <TrendingUp size={10} />
                        <span>Unrealized P&L</span>
                    </div>
                    <p className="text-[#B19EEF] font-medium font-space tracking-wide">+$8,240.50</p>
                </div>
            </div>


        </div>
    );
};
