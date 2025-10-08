"use client";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { useTradeStore } from "@/store/useTradeStore";
import { Button } from "@/components/ui/button";
import { sonar } from "@/components/ui/sonar";
import { useRouter } from "next/navigation";

const assetLogos: Record<string, string> = {
	BTCUSDT: "/Bitcoin.png",
	ETHUSDT: "/ethereum.png",
	SOLUSDT: "/Solana.png",
};

export default function TradingModal() {
	const selectedAsset = useTradeStore((s) => s.selectedAsset);
	const trades = useTradeStore((s) => s.trades);

	const [volume, setVolume] = useState<number>(0.1);
	const [percent, setPercent] = useState<number>(0); // 0-100 slider controlling volume
	const [takeProfit, setTakeProfit] = useState<string>("");
	const [stopLoss, setStopLoss] = useState<string>("");
	const [selectedLeverage, setSelectedLeverage] = useState<string>("1x");
	const [side, setSide] = useState<"buy" | "sell">("buy");
	const [showRiskFields, setShowRiskFields] = useState<boolean>(false);
	const [submitting, setSubmitting] = useState<boolean>(false);
	const router = useRouter();

	const handleIncrement = (setter: (val: number) => void, current: number, step = 0.1) => {
		const next = parseFloat((current + step).toFixed(4));
		setter(next);
	};

	const handleDecrement = (setter: (val: number) => void, current: number, step = 0.1) => {
		const next = Math.max(0, parseFloat((current - step).toFixed(4)));
		setter(next);
	};

	const handleNumericStringInput = (
		value: string,
		setter: (val: string) => void
	) => {
		const next = value.replace(/,/g, ".");
		if (/^[0-9]*\.?[0-9]*$/.test(next)) setter(next);
	};

	const currentTrade = selectedAsset ? trades[selectedAsset] : undefined;
	const priceInfo = useMemo(() => {
		if (!currentTrade) return { bid: 0, ask: 0, decimals: 0 };
		const { bid, ask, decimals } = currentTrade;
		return { bid: bid / 10 ** decimals, ask: ask / 10 ** decimals, decimals };
	}, [currentTrade]);

	// derive displayed price and order value
	const displayedPrice = side === "buy" ? priceInfo.ask : priceInfo.bid;
	const accountBalanceUsd = 5000; // replace with real account balance when available
	const leverageNumber = useMemo(() => Number(selectedLeverage.replace("x", "")) || 1, [selectedLeverage]);
	const maxQuantity = useMemo(() => {
		if (!displayedPrice || displayedPrice <= 0) return 0;
		const notionalBuyingPower = accountBalanceUsd * leverageNumber;
		return Number((notionalBuyingPower / displayedPrice).toFixed(8));
	}, [accountBalanceUsd, leverageNumber, displayedPrice]);
	const orderValue = useMemo(() => Number((volume * displayedPrice).toFixed(8)), [volume, displayedPrice]);

	const validateOrder = useCallback((): string | null => {
		if (!selectedAsset) return "Select an asset to trade.";
		if (!currentTrade) return `Waiting for ${selectedAsset} data.`;
		if (!volume || Number.isNaN(volume) || volume <= 0) return "Volume must be greater than 0.";
		if (takeProfit && Number.isNaN(Number(takeProfit))) return "Take profit must be a number.";
		if (stopLoss && Number.isNaN(Number(stopLoss))) return "Stop loss must be a number.";
		return null;
	}, [currentTrade, selectedAsset, stopLoss, takeProfit, volume]);

	const placeOrder = useCallback(
		async (action: "buy" | "sell") => {
			const error = validateOrder();
			if (error) {
				sonar.error("Order validation failed", error);
				return;
			}
			if (!currentTrade) return;
			const type = action === "buy" ? "long" : "short";
			const entryPrice = action === "buy" ? priceInfo.ask : priceInfo.bid;
			const leverage = Number(selectedLeverage.replace("x", ""));
			const maybeTP = takeProfit.trim() === "" ? undefined : Number(takeProfit);
			const maybeSL = stopLoss.trim() === "" ? undefined : Number(stopLoss);

			try {
				setSubmitting(true);
				const res = await fetch("/api/v1/trade/create", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify({
						type,
						status: "open",
						asset: selectedAsset,
						quantity: volume,
						entryPrice,
						leverage,
						// send only if provided to satisfy backend schema while keeping null semantics client-side
						...(maybeTP !== undefined ? { takeProfit: maybeTP } : {}),
						...(maybeSL !== undefined ? { stopLoss: maybeSL } : {}),
					}),
				});

				if (res.status === 401 || res.status === 403) {
					sonar.error("Not logged in", "Please sign in to place orders.");
					setTimeout(() => router.push("/signin"), 800);
					return;
				}

				if (!res.ok) {
					const data = await res.json().catch(() => ({} as any));
					const msg = data?.message || "Failed to place order";
					sonar.error("Order failed", msg);
					return;
				}

				const data = await res.json();
				sonar.success(
					"Order placed",
					`${type === "long" ? "Buy" : "Sell"} ${volume} ${selectedAsset.replace(
						"USDT",
						""
					)} @ ${entryPrice}`
				);
			} catch (e) {
				sonar.error("Network error", (e as Error).message);
			} finally {
				setSubmitting(false);
			}
		},
		[validateOrder, currentTrade, priceInfo.ask, priceInfo.bid, selectedLeverage, takeProfit, stopLoss, volume, selectedAsset, router]
	);

	if (!selectedAsset) {
		return (
			<div className="flex flex-col p-4 border-l border-slate-900 bg-black h-screen items-center justify-center text-zinc-400">
				Select an asset to start trading
			</div>
		);
	}

	const trade = trades[selectedAsset];
	if (!trade) {
		return (
			<div className="flex flex-col p-4 border-l border-slate-900 bg-black h-screen items-center justify-center text-zinc-400">
				Waiting for {selectedAsset} data...
			</div>
		);
	}

	const shortName = selectedAsset.replace("USDT", "");
	const logo = assetLogos[selectedAsset] || "/Bitcoin.png";

	return (
		<div className="flex h-screen flex-col bg-neutral-950 p-4">
			{/* Asset header with depth layering */}
			<div className="flex items-center justify-between rounded-xl bg-neutral-900/40 px-4 py-3 text-zinc-100 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_2px_8px_-2px_rgba(0,0,0,0.3)]">
				<div className="flex items-center gap-3">
					<Image
						src={logo}
						alt={`${shortName} logo`}
						width={24}
						height={24}
						className="rounded-full"
					/>
					<span className="font-medium tracking-wide text-zinc-100">{shortName}</span>
				</div>
				<div className="flex items-center gap-2 text-xs">
					<span className="rounded-lg bg-emerald-500/15 px-3 py-1 font-semibold text-emerald-300 tabular-nums shadow-[inset_0_1px_0_0_rgba(16,185,129,0.2)]">
						{(trade.bid / 10 ** trade.decimals).toFixed(trade.decimals)}
					</span>
					<span className="rounded-lg bg-rose-500/15 px-3 py-1 font-semibold text-rose-300 tabular-nums shadow-[inset_0_1px_0_0_rgba(239,68,68,0.2)]">
						{(trade.ask / 10 ** trade.decimals).toFixed(trade.decimals)}
					</span>
				</div>
			</div>



			{/* Trading form with depth layering */}
			<div className="mt-4 w-full rounded-xl bg-neutral-900/30 p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03),0_2px_8px_-2px_rgba(0,0,0,0.4)]">
				{/* Buy/Sell toggle with enhanced depth */}
				<div className="flex w-full rounded-lg bg-neutral-950/50 p-1 shadow-[inset_0_1px_0_0_rgba(0,0,0,0.2)]">
					<button
						className={
							"flex-1 rounded-md px-3 py-2 text-sm font-semibold transition-all duration-200 " +
							(side === "buy" 
								? "bg-emerald-500/20 text-emerald-200 shadow-[inset_0_1px_0_0_rgba(16,185,129,0.3)]" 
								: "text-zinc-400 hover:text-zinc-200 hover:bg-neutral-800/30")
						}
						onClick={() => setSide("buy")}
						aria-pressed={side === "buy"}
					>
						Buy
					</button>
					<button
						className={
							"flex-1 rounded-md px-3 py-2 text-sm font-semibold transition-all duration-200 " +
							(side === "sell" 
								? "bg-rose-500/20 text-rose-200 shadow-[inset_0_1px_0_0_rgba(239,68,68,0.3)]" 
								: "text-zinc-400 hover:text-zinc-200 hover:bg-neutral-800/30")
						}
						onClick={() => setSide("sell")}
						aria-pressed={side === "sell"}
					>
						Sell
					</button>
				</div>


				{/* Market price input with depth */}
				<div className="mt-4">
					<div className="flex items-center gap-2 text-xs text-zinc-400">
						<span>Market Price</span>
						<span className={side === "buy" ? "text-emerald-300" : "text-rose-300"}>
							{side === "buy" ? "(Ask)" : "(Bid)"}
						</span>
					</div>
					<div className="mt-2 flex h-12 w-full items-center justify-between rounded-lg bg-neutral-950/60 px-3 shadow-[inset_0_1px_0_0_rgba(0,0,0,0.3)]">
						<input
							value={displayedPrice ? displayedPrice.toFixed(priceInfo.decimals) : "0"}
							readOnly
							className="w-full bg-transparent text-sm text-zinc-100 outline-none"
							aria-label="Display price"
						/>
						<span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 shadow-[inset_0_1px_0_0_rgba(16,185,129,0.2)]">$</span>
					</div>
				</div>

				{/* Quantity input with depth */}
				<div className="mt-4">
					<div className="text-xs text-zinc-400">Quantity</div>
					<div className="mt-2 flex h-12 w-full items-center justify-between rounded-lg bg-neutral-950/60 px-3 shadow-[inset_0_1px_0_0_rgba(0,0,0,0.3)]">
						<input
							id="volume"
							inputMode="decimal"
							type="text"
							pattern="^[0-9]*[.,]?[0-9]*$"
							step={0.1}
							min={0}
							value={String(volume)}
							onChange={(e) => {
								const next = Number(e.target.value.replace(/,/g, "."));
								const clamped = Math.max(0, Math.min(maxQuantity, next));
								setVolume(clamped);
								const p = maxQuantity > 0 ? Math.max(0, Math.min(100, Math.round((clamped / maxQuantity) * 100))) : 0;
								setPercent(Number.isFinite(p) ? p : 0);
							}}
							placeholder="0.1"
							className="w-full bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
							aria-label="Trade volume"
						/>
						<div className="flex items-center pr-2">
							<Image src={logo} alt={`${shortName} logo`} width={22} height={22} className="rounded-full" />
						</div>
					</div>
				</div>

				{/* Percentage slider */}
				<div className="mt-4">
					<div className="flex items-center justify-between text-xs text-zinc-400">
						<span>0</span>
						<span>100%</span>
					</div>
					<input
						type="range"
						min={0}
						max={100}
						value={percent}
						onChange={(e) => {
							const p = Number(e.target.value);
							setPercent(p);
							const nextVol = parseFloat(((p / 100) * maxQuantity).toFixed(4));
							setVolume(nextVol);
						}}
						className="mt-2 w-full cursor-pointer appearance-none rounded-full bg-neutral-900 accent-sky-500"
						aria-label="Volume percentage"
					/>
				</div>

				{/* Order value with depth */}
				<div className="mt-4">
					<div className="text-xs text-zinc-400">Order Value</div>
					<div className="mt-2 flex h-12 w-full items-center justify-between rounded-lg bg-neutral-950/60 px-3 shadow-[inset_0_1px_0_0_rgba(0,0,0,0.3)]">
						<div className="text-sm text-zinc-100 tabular-nums">{orderValue || 0}</div>
						<span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 shadow-[inset_0_1px_0_0_rgba(16,185,129,0.2)]">$</span>
					</div>
				</div>
			</div>

			{/* Leverage section with depth */}
			<div className="mt-4 rounded-xl bg-neutral-900/20 p-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]">
				<div className="flex items-center justify-between text-xs text-zinc-400 mb-3">
					<span>Selected leverage</span>
					<span className="rounded-lg bg-neutral-950/60 px-3 py-1 text-zinc-100 shadow-[inset_0_1px_0_0_rgba(0,0,0,0.3)]" aria-live="polite">{selectedLeverage}</span>
				</div>
				<div className="flex w-full flex-row justify-center gap-2">
					{["1x", "5x", "10x", "20x", "100x"].map((leverage) => {
						const isActive = leverage === selectedLeverage;
						return (
							<button
								key={leverage}
								onClick={() => {
									setSelectedLeverage(leverage);
									// Recompute percent based on new maxQuantity keeping order value proportion
									setPercent((prev) => {
										const newMaxQ = (accountBalanceUsd * Number(leverage.replace("x", ""))) / (displayedPrice || 1);
										const newP = newMaxQ > 0 ? Math.max(0, Math.min(100, Math.round((volume / newMaxQ) * 100))) : 0;
										return Number.isFinite(newP) ? newP : 0;
									});
								}}
								aria-pressed={isActive}
								className={
									"w-full rounded-lg p-2 text-sm transition-all duration-200 " +
									(isActive
										? "bg-sky-500/20 text-sky-200 shadow-[inset_0_1px_0_0_rgba(14,165,233,0.3)]"
										: "bg-neutral-950/40 text-zinc-300 hover:bg-neutral-800/50 hover:text-zinc-200")
								}
							>
								{leverage}
							</button>
						);
					})}
				</div>
			</div>

			{/* Advanced options with depth */}
			<div className="w-full pt-2">
				<button
					onClick={() => setShowRiskFields((s) => !s)}
					aria-expanded={showRiskFields}
					className="flex w-full items-center justify-between rounded-lg bg-neutral-950/40 px-3 py-2 text-left text-sm text-zinc-300 hover:bg-neutral-900/50 transition-all duration-200 shadow-[inset_0_1px_0_0_rgba(0,0,0,0.2)]"
				>
					<span className="flex items-center gap-2">
						<span className="text-zinc-100">Advanced (optional)</span>
						<span className="text-[11px] text-zinc-500">TP / SL</span>
					</span>
					<svg
						className={"h-4 w-4 transition-transform " + (showRiskFields ? "rotate-180" : "rotate-0")}
						viewBox="0 0 20 20"
						fill="currentColor"
						aria-hidden="true"
					>
						<path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.116l3.71-3.885a.75.75 0 111.08 1.04l-4.24 4.44a.75.75 0 01-1.08 0L5.25 8.27a.75.75 0 01-.02-1.06z" clipRule="evenodd" />
					</svg>
				</button>
				{showRiskFields && (
					<div className="mt-3 grid grid-cols-1 gap-3">
						<div className="space-y-2">
							<label htmlFor="take-profit" className="text-xs text-zinc-300">Take Profit</label>
							<div className="flex h-12 w-full items-center justify-end rounded-lg bg-neutral-950/60 shadow-[inset_0_1px_0_0_rgba(0,0,0,0.3)]">
								<input
									id="take-profit"
									inputMode="decimal"
									type="text"
									pattern="^[0-9]*[.,]?[0-9]*$"
									step={0.1}
									min={0}
									value={takeProfit}
									onChange={(e) => handleNumericStringInput(e.target.value, setTakeProfit)}
									placeholder={(trade.ask / 10 ** trade.decimals).toFixed(trade.decimals)}
									className="w-full bg-transparent px-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
									aria-label="Take profit price"
								/>
							</div>
						</div>
						<div className="space-y-2">
							<label htmlFor="stop-loss" className="text-xs text-zinc-300">Stop Loss</label>
							<div className="flex h-12 w-full items-center justify-end rounded-lg bg-neutral-950/60 shadow-[inset_0_1px_0_0_rgba(0,0,0,0.3)]">
								<input
									id="stop-loss"
									inputMode="decimal"
									type="text"
									pattern="^[0-9]*[.,]?[0-9]*$"
									step={0.1}
									min={0}
									value={stopLoss}
									onChange={(e) => handleNumericStringInput(e.target.value, setStopLoss)}
									placeholder={(trade.bid / 10 ** trade.decimals).toFixed(trade.decimals)}
									className="w-full bg-transparent px-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
									aria-label="Stop loss price"
								/>
							</div>
						</div>
					</div>
				)}
			</div>

			<div className="pt-3 text-[11px] text-zinc-500">
				Indicative prices. Final execution shown in the order confirmation.
			</div>

			{/* Submit */}
			<div className="mt-4 flex gap-3">
				<Button
					variant={side === "buy" ? "primary" : "destructive"}
					className="w-full h-12 text-sm"
					disabled={submitting}
					onClick={() => placeOrder(side)}
					aria-label={side === "buy" ? "Place buy order" : "Place sell order"}
				>
					{side === "buy" ? "Buy" : "Sell"}
				</Button>
			</div>
		</div>
	);
}

