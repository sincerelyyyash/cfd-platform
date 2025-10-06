"use client";
import Image from "next/image";
import { useState } from "react";
import { useTradeStore } from "@/store/useTradeStore";

const assetLogos: Record<string, string> = {
	BTCUSDT: "/Bitcoin.png",
	ETHUSDT: "/ethereum.png",
	SOLUSDT: "/Solana.png",
};

export default function TradingModal() {
	const selectedAsset = useTradeStore((s) => s.selectedAsset);
	const trades = useTradeStore((s) => s.trades);

	const [volume, setVolume] = useState<number>(0.1);
	const [takeProfit, setTakeProfit] = useState<number | "">("");
	const [stopLoss, setStopLoss] = useState<number | "">("");
	const [selectedLeverage, setSelectedLeverage] = useState<string>("10x");

	const handleIncrement = (setter: (val: number) => void, current: number, step = 0.1) => {
		const next = parseFloat((current + step).toFixed(4));
		setter(next);
	};

	const handleDecrement = (setter: (val: number) => void, current: number, step = 0.1) => {
		const next = Math.max(0, parseFloat((current - step).toFixed(4)));
		setter(next);
	};

	const handleNumericInput = (
		value: string,
		setter: (val: number | "") => void
	) => {
		if (value.trim() === "") {
			setter("");
			return;
		}
		const parsed = Number(value);
		if (!Number.isNaN(parsed)) {
			setter(parsed);
		}
	};

	if (!selectedAsset) {
		return (
			<div className="flex flex-col p-4 border-l border-slate-900 bg-black/40 h-screen items-center justify-center text-zinc-400">
				Select an asset to start trading
			</div>
		);
	}

	const trade = trades[selectedAsset];
	if (!trade) {
		return (
			<div className="flex flex-col p-4 border-l border-slate-900 bg-black/40 h-screen items-center justify-center text-zinc-400">
				Waiting for {selectedAsset} data...
			</div>
		);
	}

	const shortName = selectedAsset.replace("USDT", "");
	const logo = assetLogos[selectedAsset] || "/Bitcoin.png";

	return (
		<div className="flex h-screen flex-col border-l border-neutral-900 bg-black/40 p-4">
			<div className="flex items-center justify-between rounded-lg border border-neutral-900/70 bg-black/40 px-3 py-2 text-zinc-200">
				<div className="flex items-center gap-2">
					<Image
						src={logo}
						alt={`${shortName} logo`}
						width={24}
						height={24}
						className="rounded-full"
					/>
					<span className="font-medium tracking-wide">{shortName}</span>
				</div>
				<div className="flex items-center gap-2 text-xs">
					<span className="rounded-md bg-emerald-500/10 px-2 py-0.5 font-semibold text-emerald-400 tabular-nums">
						{(trade.bid / 10 ** trade.decimals).toFixed(trade.decimals)}
					</span>
					<span className="rounded-md bg-rose-500/10 px-2 py-0.5 font-semibold text-rose-400 tabular-nums">
						{(trade.ask / 10 ** trade.decimals).toFixed(trade.decimals)}
					</span>
				</div>
			</div>

			<div className="flex flex-row items-center justify-center gap-2 py-4">
				<button
					className="w-full rounded-lg border border-rose-600/50 bg-rose-600/10 p-3 text-rose-300 outline-none transition-colors hover:bg-rose-900/30 focus:ring-2 focus:ring-rose-600/40"
					aria-label="Place sell order at bid"
				>
					Sell • {(trade.bid / 10 ** trade.decimals).toFixed(trade.decimals)}
				</button>
				<button
					className="w-full rounded-lg border border-emerald-600/50 bg-emerald-600/10 p-3 text-emerald-300 outline-none transition-colors hover:bg-emerald-900/30 focus:ring-2 focus:ring-emerald-600/40"
					aria-label="Place buy order at ask"
				>
					Buy • {(trade.ask / 10 ** trade.decimals).toFixed(trade.decimals)}
				</button>
			</div>

			<div className="w-full space-y-2 py-2">
				<label htmlFor="volume" className="text-xs text-zinc-300">
					Volume
				</label>
				<div className="flex h-12 w-full items-center justify-end rounded-lg border border-neutral-800 bg-black/50">
					<input
						id="volume"
						inputMode="decimal"
						type="number"
						step={0.1}
						min={0}
						value={volume}
						onChange={(e) => setVolume(Number(e.target.value))}
						placeholder="0.1"
						className="w-full bg-transparent p-2 text-sm text-zinc-200 outline-none placeholder:text-zinc-500"
						aria-label="Trade volume"
					/>
					<div className="flex flex-row">
						<button
							onClick={() => handleIncrement(setVolume, volume)}
						className="h-12 w-16 border-l border-neutral-800 p-2 text-zinc-300 hover:bg-black/70"
							aria-label="Increase volume"
						>
							+
						</button>
						<button
							onClick={() => handleDecrement(setVolume, volume)}
						className="h-12 w-16 border-l border-neutral-800 p-2 text-zinc-300 hover:bg-black/70"
							aria-label="Decrease volume"
						>
							-
						</button>
					</div>
				</div>
			</div>

			<div className="flex w-full flex-row justify-center gap-2 py-2">
				{["1x", "5x", "10x", "20x", "100x"].map((leverage) => {
					const isActive = leverage === selectedLeverage;
					return (
						<button
							key={leverage}
							onClick={() => setSelectedLeverage(leverage)}
							aria-pressed={isActive}
					className={
						"w-full rounded-lg p-2 text-sm transition-colors border " +
						(isActive
							? "border-neutral-800 bg-black/70 text-zinc-200"
							: "border-neutral-800 bg-black/50 text-zinc-300 hover:bg-black/60")
					}
						>
							{leverage}
						</button>
					);
				})}
			</div>

			<div className="w-full space-y-2 py-2">
				<label htmlFor="take-profit" className="text-xs text-zinc-300">
					Take Profit
				</label>
				<div className="flex h-12 w-full items-center justify-end rounded-lg border border-neutral-800 bg-black/50">
					<input
						id="take-profit"
						inputMode="decimal"
						type="number"
						step={0.1}
						min={0}
						value={takeProfit === "" ? "" : takeProfit}
						onChange={(e) => handleNumericInput(e.target.value, setTakeProfit)}
						placeholder="0.1"
						className="w-full bg-transparent p-2 text-sm text-zinc-200 outline-none placeholder:text-zinc-500"
						aria-label="Take profit price"
					/>
					<div className="flex flex-row">
						<button
							onClick={() => handleIncrement((v) => setTakeProfit(v), Number(takeProfit || 0))}
						className="h-12 w-16 border-l border-neutral-800 p-2 text-zinc-300 hover:bg-black/70"
							aria-label="Increase take profit"
						>
							+
						</button>
						<button
							onClick={() => handleDecrement((v) => setTakeProfit(v), Number(takeProfit || 0))}
						className="h-12 w-16 border-l border-neutral-800 p-2 text-zinc-300 hover:bg-black/70"
							aria-label="Decrease take profit"
						>
							-
						</button>
					</div>
				</div>
			</div>

			<div className="w-full space-y-2 py-2">
				<label htmlFor="stop-loss" className="text-xs text-zinc-300">
					Stop Loss
				</label>
				<div className="flex h-12 w-full items-center justify-end rounded-lg border border-neutral-800 bg-black/50">
					<input
						id="stop-loss"
						inputMode="decimal"
						type="number"
						step={0.1}
						min={0}
						value={stopLoss === "" ? "" : stopLoss}
						onChange={(e) => handleNumericInput(e.target.value, setStopLoss)}
						placeholder="0.1"
						className="w-full bg-transparent p-2 text-sm text-zinc-200 outline-none placeholder:text-zinc-500"
						aria-label="Stop loss price"
					/>
					<div className="flex flex-row">
						<button
							onClick={() => handleIncrement((v) => setStopLoss(v), Number(stopLoss || 0))}
						className="h-12 w-16 border-l border-neutral-800 p-2 text-zinc-300 hover:bg-black/70"
							aria-label="Increase stop loss"
						>
							+
						</button>
						<button
							onClick={() => handleDecrement((v) => setStopLoss(v), Number(stopLoss || 0))}
						className="h-12 w-16 border-l border-neutral-800 p-2 text-zinc-300 hover:bg-black/70"
							aria-label="Decrease stop loss"
						>
							-
						</button>
					</div>
				</div>
			</div>

			<div className="pt-2 text-[11px] text-zinc-500">
				Indicative prices. Final execution shown in the order confirmation.
			</div>
		</div>
	);
}

