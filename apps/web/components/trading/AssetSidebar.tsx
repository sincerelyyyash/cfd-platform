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
			className="flex h-full flex-col border-r border-neutral-900 bg-black"
		>
			<header className="sticky top-0 z-10 border-b border-neutral-900/60 bg-black">
				<div className="flex items-center justify-between rounded-lg border border-neutral-900/70 bg-black px-3 py-2 text-zinc-200 sm:px-6 mx-auto w-[92%]">
					<h2 id="instruments-heading" className="text-sm sm:text-base font-semibold tracking-wide text-zinc-100">
						Instruments
					</h2>
					<div className="flex items-center gap-3">
						<span
							className="inline-flex items-center gap-2 rounded-full border border-neutral-800 px-2.5 py-1 text-[11px] font-medium text-zinc-300"
							aria-live="polite"
						>
							<span
								className={
									`h-1.5 w-1.5 rounded-full ${isLive ? "bg-emerald-400 shadow-[0_0_0_3px_rgba(16,185,129,0.15)]" : "bg-neutral-500"}`
								}
							/>
							{isLive ? "Live" : "Waiting"}
						</span>
						<div
							role="img"
							aria-label="Sidebar options"
							className="text-slate-500 hover:text-zinc-200 transition-colors"
							tabIndex={0}
							onKeyDown={(event) => {
								if (event.key === "Enter" || event.key === " ") {
									return;
								}
							}}
						>
							{/* Kebab icon */}
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="opacity-80">
								<circle cx="12" cy="6" r="1.5" fill="currentColor" />
								<circle cx="12" cy="12" r="1.5" fill="currentColor" />
								<circle cx="12" cy="18" r="1.5" fill="currentColor" />
							</svg>
						</div>
					</div>
				</div>
			</header>

			<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
				<div className="px-4 pb-3 pt-3 sm:px-6 sm:pb-4 mx-auto w-[92%]">
					{/* <SearchBar /> */}
				</div>

				<div className="flex-1 overflow-y-auto px-2 sm:px-4 pb-4">
					<div className="mx-auto w-[92%]">
						{isLive ? (
							<BidAskTable data={tableData} />
						) : (
							<div className="space-y-3">
								{[0, 1, 2].map((index) => (
									<div key={index} className="animate-pulse">
										<div className="flex items-center justify-between rounded-lg border border-neutral-900/70 bg-black px-3 py-2 text-zinc-200">
											<div className="h-3 w-24 rounded bg-neutral-900/70" />
											<div className="flex items-center gap-3">
												<div className="h-3 w-12 rounded bg-neutral-900/70" />
												<div className="h-3 w-12 rounded bg-neutral-900/70" />
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

		<footer className="border-t border-neutral-900/60 px-4 py-3 sm:px-6 bg-black">
				<p className="text-[11px] text-zinc-500">
					Prices are indicative. Check the order ticket for final execution.
				</p>
			</footer>
		</aside>
	);
};

export default AssetSidebar;

