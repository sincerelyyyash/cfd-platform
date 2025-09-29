"use client";

import { BidAskTable } from "./BidAskTable";
import SearchBar from "./SearchBar";
import { useTradeStore } from "@/store/useTradeStore";

export default function AssetSidebar() {
	const trades = useTradeStore((s) => s.trades);

	const assetOrder = ["BTCUSDT", "ETHUSDT", "SOLUSDT"];

	const tableData = assetOrder
		.filter((symbol) => trades[symbol])
		.map((symbol) => {
			const t = trades[symbol];
			return {
				asset: t.asset,
				bid: (t.bid / 10 ** t.decimals).toFixed(t.decimals),
				ask: (t.ask / 10 ** t.decimals).toFixed(t.decimals),
			};
		});

	return (
		<div className="flex flex-col p-4 sm:p-6 border-r border-slate-900 bg-slate-950/50">
			<div className="flex flex-row justify-between py-2 sm:py-4 text-zinc-100 font-semibold tracking-wide">
				<div>Instruments</div>
				<div className="text-slate-500">x</div>
			</div>

			<div className="py-3 sm:py-4">
				<SearchBar />
			</div>

			<div>
				{tableData.length > 0 ? (
					<BidAskTable data={tableData} />
				) : (
					<p className="text-zinc-400 text-sm">Waiting for live data...</p>
				)}
			</div>
		</div>
	);
}

