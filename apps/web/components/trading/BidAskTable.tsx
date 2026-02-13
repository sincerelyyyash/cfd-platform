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
		<div aria-label={caption} role="list" className="space-y-1 p-2">

			<div className="flex items-center justify-between px-3 pb-1">
				<span className="text-[9px] font-bold uppercase tracking-wider text-zinc-600 font-space">
					Asset
				</span>
				<div className="flex items-center gap-3">
					<span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600/80 font-space w-[72px] text-right">
						Bid
					</span>
					<span className="text-[9px] font-bold uppercase tracking-wider text-rose-600/80 font-space w-[72px] text-right">
						Ask
					</span>
				</div>
			</div>

			{data.map((row) => {
				const shortName = row.asset.replace("USDT", "");
				const logo = assetLogos[row.asset] || "/default.png";
				const isSelected = row.asset === selectedAsset;

				return (
					<div
						key={row.asset}
						role="button"
						aria-pressed={isSelected}
						aria-label={`${shortName} — Bid ${row.bid}, Ask ${row.ask}`}
						tabIndex={0}
						onClick={() => setSelectedAsset(row.asset)}
						onKeyDown={(e) => handleKeyDown(e, row.asset)}
						className={
							`group flex items-center justify-between rounded-[1px] px-3 py-2.5 transition-all duration-200 outline-none ` +
							(isSelected
								? "bg-white/[0.05] border border-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
								: "bg-transparent border border-transparent hover:bg-white/[0.02] hover:border-white/5 focus:ring-1 focus:ring-white/10")
						}
					>
						<div className="flex items-center gap-3">
							<Image
								src={logo}
								alt={shortName}
								width={24}
								height={24}
								className="rounded-full"
							/>
							<span className="font-bold tracking-tight text-sm font-space text-zinc-100">
								{shortName}
							</span>
						</div>

						<div className="flex items-center gap-3 shrink-0">
							<span
								className="w-[72px] text-right text-xs font-bold tracking-tight font-space tabular-nums text-emerald-400/90"
								aria-label={`Bid price: ${row.bid}`}
							>
								{row.bid}
							</span>
							<span
								className="w-[72px] text-right text-xs font-bold tracking-tight font-space tabular-nums text-rose-400/90"
								aria-label={`Ask price: ${row.ask}`}
							>
								{row.ask}
							</span>
						</div>
					</div>
				);
			})}
		</div>
	);
}
