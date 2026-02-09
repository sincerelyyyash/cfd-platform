"use client";

import { BidAskTable } from "./BidAskTable";
import { useTradeStore } from "@/store/useTradeStore";

const AssetSidebar = () => {
	const trades = useTradeStore((state) => state.trades);

	const preferredAssetOrder = ["BTCUSDT", "ETHUSDT", "SOLUSDT"];

	const tableData = preferredAssetOrder
		.filter((symbol) => trades[symbol])
		.map((symbol) => {
			const trade = trades[symbol];
			return {
				asset: trade.asset,
				bid: (trade.bid / 10 ** trade.decimals).toFixed(trade.decimals),
				ask: (trade.ask / 10 ** trade.decimals).toFixed(trade.decimals),
			};
		});

	const isLive = tableData.length > 0;

	return (
		<aside
			role="complementary"
			aria-label="Market instruments sidebar"
			className="flex h-full flex-col bg-[#08080a] border-r border-white/5"
		>
			<header className="sticky top-0 z-20 bg-[#08080a]/80 backdrop-blur-md border-b border-white/5">
				<div className="flex items-center justify-between px-4 py-3">
					<h2 id="instruments-heading" className="text-xs font-bold tracking-widest text-neutral-500 uppercase font-space">
						Markets
					</h2>
					<div className="flex items-center gap-2">
						<span
							className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[1px] bg-white/[0.02] border border-white/5"
							aria-live="polite"
						>
							<span
								className={
									`h-1 w-1 rounded-[1px] ${isLive ? "bg-white shadow-[0_0_4px_rgba(255,255,255,0.4)]" : "bg-neutral-600"}`
								}
							/>
							<span className="text-[9px] font-medium text-neutral-400 uppercase tracking-wider font-sans">
								{isLive ? "Live" : "Offline"}
							</span>
						</span>
					</div>
				</div>
			</header>

			<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
				<div className="flex-1 overflow-y-auto">
					<div className="">
						{isLive ? (
							<BidAskTable data={tableData} />
						) : (
							<div className="space-y-1 p-2">
								{[0, 1, 2].map((index) => (
									<div key={index} className="animate-pulse">
										<div className="flex items-center justify-between rounded-[1px] bg-white/[0.02] border border-white/5 px-3 py-2">
											<div className="h-3 w-16 rounded-[1px] bg-white/5" />
											<div className="flex items-center gap-2">
												<div className="h-3 w-8 rounded-[1px] bg-white/5" />
												<div className="h-3 w-8 rounded-[1px] bg-white/5" />
											</div>
										</div>
									</div>
								))}
								<div className="px-2 pt-2 text-center">
									<p className="text-[10px] text-neutral-600 font-mono uppercase">Connecting to feed...</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			<footer className="bg-[#08080a] px-4 py-2 border-t border-white/5">
				<div className="flex items-center gap-2 text-[9px] text-neutral-600">
					<div className="w-1 h-1 bg-neutral-700 rounded-full" />
					<span className="font-mono uppercase">System Normal</span>
				</div>
			</footer>
		</aside>
	);
};

export default AssetSidebar;

