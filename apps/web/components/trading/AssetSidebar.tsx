"use client";

import { BidAskTable } from "./BidAskTable";
// import SearchBar from "./SearchBar";
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
			className="flex h-full flex-col bg-neutral-950"
		>
			<header className="sticky top-0 z-20 bg-neutral-950 shadow-[0_1px_0_0_rgba(255,255,255,0.03)]">
				<div className="flex items-center justify-between rounded-lg bg-neutral-900 px-2 py-2 text-zinc-100 mx-2 mt-2 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
					<h2 id="instruments-heading" className="text-sm font-semibold tracking-wide text-zinc-100">
						Instruments
					</h2>
					<div className="flex items-center gap-1.5">
						<span
							className="inline-flex items-center gap-1.5 rounded-md bg-neutral-950/50 px-1.5 py-0.5 text-[10px] font-medium text-zinc-300 shadow-[inset_0_1px_0_0_rgba(0,0,0,0.2)]"
							aria-live="polite"
						>
							<span
								className={
									`h-1 w-1 rounded-full ${isLive ? "bg-emerald-400 shadow-[0_0_0_2px_rgba(16,185,129,0.15)]" : "bg-neutral-500"}`
								}
							/>
							{isLive ? "Live" : "Waiting"}
						</span>
						<button
							role="img"
							aria-label="Sidebar options"
							className="text-zinc-400 hover:text-zinc-200 transition-colors p-0.5 rounded hover:bg-neutral-800/30"
							tabIndex={0}
							onKeyDown={(event) => {
								if (event.key === "Enter" || event.key === " ") {
									return;
								}
							}}
						>
							{/* Kebab icon */}
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="opacity-80">
								<circle cx="12" cy="6" r="1.5" fill="currentColor" />
								<circle cx="12" cy="12" r="1.5" fill="currentColor" />
								<circle cx="12" cy="18" r="1.5" fill="currentColor" />
							</svg>
						</button>
					</div>
				</div>
			</header>

			<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
				<div className="px-2 pb-1.5 pt-1.5">
					{/* <SearchBar /> */}
				</div>

				<div className="flex-1 overflow-y-auto px-2 pb-3">
					<div className="space-y-1.5">
						{isLive ? (
							<BidAskTable data={tableData} />
						) : (
							<div className="space-y-1.5">
								{[0, 1, 2].map((index) => (
									<div key={index} className="animate-pulse">
										<div className="flex items-center justify-between rounded-lg bg-neutral-900/30 px-2 py-1.5 text-zinc-200 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]">
											<div className="h-3 w-20 rounded bg-neutral-800/50" />
											<div className="flex items-center gap-2.5">
												<div className="h-3 w-10 rounded bg-neutral-800/50" />
												<div className="h-3 w-10 rounded bg-neutral-800/50" />
											</div>
										</div>
									</div>
								))}
								<p className="px-1 pt-1 text-xs text-zinc-400">Waiting for live data…</p>
							</div>
						)}
					</div>
				</div>
			</div>

			<footer className="bg-neutral-950 px-2 py-1.5 shadow-[0_-1px_0_0_rgba(255,255,255,0.03)]">
				<p className="text-[10px] text-zinc-500">
					Prices are indicative. Check the order ticket for final execution.
				</p>
			</footer>
		</aside>
	);
};

export default AssetSidebar;

