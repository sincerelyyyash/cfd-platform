"use client";
import Image from "next/image";
import { useTradeStore } from "@/store/useTradeStore";

const assetLogos: Record<string, string> = {
	BTCUSDT: "/Bitcoin.png",
	ETHUSDT: "/Ethereum.png",
	SOLUSDT: "/Solana.png",
};

export default function TradingModal() {
	const selectedAsset = useTradeStore((s) => s.selectedAsset);
	const trades = useTradeStore((s) => s.trades);

	if (!selectedAsset) {
		return (
			<div className="flex flex-col p-4 border-l border-slate-900 bg-slate-950/40 h-screen items-center justify-center text-zinc-400">
				Select an asset to start trading
			</div>
		);
	}

	const trade = trades[selectedAsset];
	if (!trade) {
		return (
			<div className="flex flex-col p-4 border-l border-slate-900 bg-slate-950/40 h-screen items-center justify-center text-zinc-400">
				Waiting for {selectedAsset} data...
			</div>
		);
	}

	const shortName = selectedAsset.replace("USDT", "");
	const logo = assetLogos[selectedAsset] || "/Bitcoin.png";

	return (
		<div className="flex flex-col p-4 border-l border-slate-900 bg-slate-950/40 h-screen">
			<div className="flex items-center gap-2 p-2 py-4 rounded-lg w-32 justify-center text-slate-200">
				<Image
					src={logo}
					alt={`${shortName} logo`}
					width={24}
					height={24}
					className="rounded-full"
				/>
				<span>{shortName}</span>
			</div>

			<div className="flex flex-row gap-2 p-2 w-full justify-center items-center py-4">
				<button className="p-3 border border-red-500/70 text-red-300 hover:bg-red-950/30 rounded-lg w-full">
					{(trade.bid / 10 ** trade.decimals).toFixed(trade.decimals)}
				</button>
				<button className="p-3 border border-green-500/70 text-green-300 hover:bg-green-950/30 rounded-lg w-full">
					{(trade.ask / 10 ** trade.decimals).toFixed(trade.decimals)}
				</button>
			</div>

			<div className="w-full py-4 space-y-2">
				<div className="text-slate-300">Volume</div>
				<div className="w-full flex flex-row border border-slate-800 bg-slate-900/50 h-12 rounded-lg justify-end items-center">
					<input
						type="text"
						placeholder="0.1"
						className="w-full p-2 bg-transparent outline-none text-sm text-slate-200 placeholder:text-slate-500"
					/>
					<div className="flex flex-row">
						<button className="p-2 h-12 w-16 border-l border-slate-800 text-slate-300 hover:bg-slate-800">+</button>
						<button className="p-2 h-12 w-16 border-l border-slate-800 text-slate-300 hover:bg-slate-800">-</button>
					</div>
				</div>
			</div>

			<div className="flex flex-row gap-2 w-full justify-center py-2">
				{["1x", "5x", "10x", "20x", "100x"].map((lev) => (
					<button
						key={lev}
						className="border border-blue-700/60 text-blue-300 hover:bg-blue-950/40 p-2 rounded-lg w-full"
					>
						{lev}
					</button>
				))}
			</div>

			<div className="w-full py-4 space-y-2">
				<div className="text-slate-300">Take Profit</div>
				<div className="w-full flex flex-row border border-slate-800 bg-slate-900/50 h-12 rounded-lg justify-end items-center">
					<input
						type="text"
						placeholder="0.1"
						className="w-full p-2 bg-transparent outline-none text-sm text-slate-200 placeholder:text-slate-500"
					/>
					<div className="flex flex-row">
						<button className="p-2 h-12 w-16 border-l border-slate-800 text-slate-300 hover:bg-slate-800">+</button>
						<button className="p-2 h-12 w-16 border-l border-slate-800 text-slate-300 hover:bg-slate-800">-</button>
					</div>
				</div>
			</div>

			<div className="w-full py-4 space-y-2">
				<div className="text-slate-300">Stop Loss</div>
				<div className="w-full flex flex-row border border-slate-800 bg-slate-900/50 h-12 rounded-lg justify-end items-center">
					<input
						type="text"
						placeholder="0.1"
						className="w-full p-2 bg-transparent outline-none text-sm text-slate-200 placeholder:text-slate-500"
					/>
					<div className="flex flex-row">
						<button className="p-2 h-12 w-16 border-l border-slate-800 text-slate-300 hover:bg-slate-800">+</button>
						<button className="p-2 h-12 w-16 border-l border-slate-800 text-slate-300 hover:bg-slate-800">-</button>
					</div>
				</div>
			</div>
		</div>
	);
}

