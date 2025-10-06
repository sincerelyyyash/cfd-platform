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
						`group flex items-center justify-between rounded-lg border px-3 py-2 transition-colors outline-none ` +
						(isSelected
						? "border-neutral-900/80 bg-black/50 text-zinc-200"
						: "border-neutral-900/80 bg-black/30 text-zinc-200 hover:bg-black/50 focus:ring-2 focus:ring-neutral-400/40")
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
								`rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold tabular-nums ` +
								(isSelected ? "text-emerald-300" : "text-emerald-400")
							}>
								{row.bid}
							</span>
							<span className={
								`rounded-md bg-rose-500/10 px-2 py-0.5 text-xs font-semibold tabular-nums ` +
								(isSelected ? "text-rose-300" : "text-rose-400")
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

