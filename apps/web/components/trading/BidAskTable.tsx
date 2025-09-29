"use client";

import Image from "next/image";
import { useTradeStore } from "@/store/useTradeStore";

import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

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
	ETHUSDT: "/Ethereum.png",
	SOLUSDT: "/Solana.png",
};

export function BidAskTable({
	data,
	caption = "Live bid and ask prices for top assets.",
}: AssetTableProps) {
	const selectedAsset = useTradeStore((s) => s.selectedAsset);
	const setSelectedAsset = useTradeStore((s) => s.setSelectedAsset);

	return (
		<Table className="border border-slate-900/80 rounded-lg overflow-hidden">
			<TableCaption className="text-slate-500">{caption}</TableCaption>
			<TableHeader>
				<TableRow className="bg-slate-950/60">
					<TableHead className="w-[120px] border-r border-slate-900 text-slate-300">Asset</TableHead>
					<TableHead className="text-right text-slate-300">Bid</TableHead>
					<TableHead className="text-right text-slate-300">Ask</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{data.map((row) => {
					const shortName = row.asset.replace("USDT", "");
					const logo = assetLogos[row.asset] || "/default.png";
					const isSelected = row.asset === selectedAsset;

					return (
						<TableRow key={row.asset} className="hover:bg-slate-900/40 transition-colors">
							<TableCell
								className="font-medium border-r border-slate-900 cursor-pointer flex items-center gap-2 text-slate-200"
								onClick={() => setSelectedAsset(row.asset)}
							>
								<Image
									src={logo}
									alt={shortName}
									width={20}
									height={20}
									className="rounded-full"
								/>
								<span>{shortName}</span>
							</TableCell>
							<TableCell
								className={`text-right text-slate-200 ${
									isSelected ? "bg-blue-950/50 text-blue-300" : ""
								}`}
							>
								{row.bid}
							</TableCell>
							<TableCell
								className={`text-right text-slate-200 ${
									isSelected ? "bg-blue-950/50 text-blue-300" : ""
								}`}
							>
								{row.ask}
							</TableCell>
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	);
}

