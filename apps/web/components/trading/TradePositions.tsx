"use client";
import { useState } from "react";

const mockTrades = [
	{
		asset: "BTC",
		bid: "$27,500",
		ask: "$27,520",
	},
	{
		asset: "ETH",
		bid: "$1,750",
		ask: "$1,755",
	},
	{
		asset: "SOL",
		bid: "$22.40",
		ask: "$22.55",
	},
	{
		asset: "XRP",
		bid: "$0.50",
		ask: "$0.51",
	},
	{
		asset: "ADA",
		bid: "$0.27",
		ask: "$0.28",
	},
]

const tabs = ["Open", "Pending", "Closed"] as const;

const TradePositions = () => {
	const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Open");

	return (
		<div className="flex flex-col bg-black/40">
			<div className="flex flex-row items-center justify-between border-b border-neutral-900/60">
				<div className="flex flex-row gap-1 p-2 sm:gap-2 sm:p-3">
					<div role="tablist" aria-label="Positions filter" className="flex items-center gap-1">
						{tabs.map((tab) => {
							const isActive = tab === activeTab;
							return (
								<button
									key={tab}
									role="tab"
									aria-selected={isActive}
									onClick={() => setActiveTab(tab)}
						className={
							"rounded-md px-3 py-2 text-sm transition-colors outline-none border " +
							(isActive
								? "border-neutral-800 bg-black/70 text-zinc-200"
								: "border-neutral-800 bg-black/60 text-zinc-300 hover:bg-black")
						}
								>
									{tab}
								</button>
							);
						})}
					</div>
				</div>
				<div className="flex flex-row items-center gap-2 p-2 sm:p-3 text-zinc-400">
					<button
						className="rounded-md border border-neutral-800 bg-black/50 px-2 py-1 text-xs text-zinc-300 hover:bg-black/70"
						aria-label="Filter positions"
					>
						Filter
					</button>
					<button
						className="rounded-md border border-neutral-800 bg-black/50 px-2 py-1 text-xs text-zinc-300 hover:bg-black/70"
						aria-label="More options"
					>
						Options
					</button>
				</div>
			</div>
			<div className="p-3 sm:p-4">
				<div role="list" aria-label={`${activeTab} positions`} className="space-y-2">
					{mockTrades.map((row) => (
						<div
							key={row.asset}
							role="listitem"
						className="group flex items-center justify-between rounded-lg border border-neutral-900/80 bg-black/30 px-3 py-2 text-zinc-200 transition-colors hover:bg-black/50"
						>
							<div className="flex items-center gap-3">
							<div className="flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-xs font-semibold">
									{row.asset}
								</div>
								<div className="text-sm font-medium tracking-wide">{row.asset}/USDT</div>
							</div>
							<div className="flex items-center gap-3">
								<span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 tabular-nums">{row.bid}</span>
								<span className="rounded-md bg-rose-500/10 px-2 py-0.5 text-xs font-semibold text-rose-400 tabular-nums">{row.ask}</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default TradePositions;
