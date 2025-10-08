"use client";

import Image from "next/image";
import { useTradeStore } from "@/store/useTradeStore";

type Asset = {
	asset: string;
	bid: string;
	ask: string;
};

type AssetTableProps = {
	data: Asset[];
	caption?: string;
};

const assetLogos: Record<string, string> = {
	BTCUSDT: "/Bitcoin.png",
	ETHUSDT: "/ethereum.png",
	SOLUSDT: "/Solana.png",
};

export function BidAskTable({
	data,
	caption = "Live bid and ask prices for top assets.",
}: AssetTableProps) {
	const selectedAsset = useTradeStore((s) => s.selectedAsset);
	const setSelectedAsset = useTradeStore((s) => s.setSelectedAsset);

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, asset: string) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			setSelectedAsset(asset);
		}
	};

	return (
		<div aria-label={caption} role="list" className="space-y-2">
			{data.map((row) => {
				const shortName = row.asset.replace("USDT", "");
				const logo = assetLogos[row.asset] || "/default.png";
				const isSelected = row.asset === selectedAsset;

				return (
					<div
						key={row.asset}
						role="button"
						aria-pressed={isSelected}
						tabIndex={0}
						onClick={() => setSelectedAsset(row.asset)}
						onKeyDown={(e) => handleKeyDown(e, row.asset)}
						className={
							`group flex items-center justify-between rounded-lg px-3 py-2 transition-all duration-200 outline-none ` +
							(isSelected
								? "bg-sky-500/15 text-zinc-100 shadow-[inset_0_1px_0_0_rgba(14,165,233,0.3)]"
								: "bg-neutral-900/30 text-zinc-200 hover:bg-neutral-800/40 focus:ring-2 focus:ring-neutral-400/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]")
						}
					>
						<div className="flex items-center gap-2">
							<Image
								src={logo}
								alt={shortName}
								width={20}
								height={20}
								className="rounded-full"
							/>
							<span className="font-medium tracking-wide">{shortName}</span>
						</div>
						<div className="flex items-center gap-3">
							<span className={
								`rounded-lg bg-emerald-500/15 px-2 py-1 text-xs font-semibold tabular-nums shadow-[inset_0_1px_0_0_rgba(16,185,129,0.2)] ` +
								(isSelected ? "text-emerald-200" : "text-emerald-300")
							}>
								{row.bid}
							</span>
							<span className={
								`rounded-lg bg-rose-500/15 px-2 py-1 text-xs font-semibold tabular-nums shadow-[inset_0_1px_0_0_rgba(239,68,68,0.2)] ` +
								(isSelected ? "text-rose-200" : "text-rose-300")
							}>
								{row.ask}
							</span>
						</div>
					</div>
				);
			})}
		</div>
	);
}

