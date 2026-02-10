"use client";
import Image from "next/image";
import { useCallback, useMemo, useState, useEffect } from "react";
import { useTradeStore } from "@/store/useTradeStore";
import { Button } from "@/components/ui/button";
import { sonar } from "@/components/ui/sonar";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";


const assetLogos: Record<string, string> = {
	BTCUSDT: "/Bitcoin.png",
	ETHUSDT: "/ethereum.png",
	SOLUSDT: "/Solana.png",
};

export default function TradingModal() {
	const selectedAsset = useTradeStore((s) => s.selectedAsset);
	const trades = useTradeStore((s) => s.trades);
	const { signedIn } = useAuth();
	const router = useRouter();

	const [volume, setVolume] = useState<number>(0.1);
	const [percent, setPercent] = useState<number>(0);
	const [takeProfit, setTakeProfit] = useState<string>("");
	const [stopLoss, setStopLoss] = useState<string>("");
	const [selectedLeverage, setSelectedLeverage] = useState<string>("1x");
	const [side, setSide] = useState<"buy" | "sell">("buy");
	const [showRiskFields, setShowRiskFields] = useState<boolean>(false);
	const [submitting, setSubmitting] = useState<boolean>(false);

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
	const [accountBalanceUsd, setAccountBalanceUsd] = useState<number>(5000);
	const BALANCE_DECIMAL = 100;
	const leverageNumber = useMemo(() => Number(selectedLeverage.replace("x", "")) || 1, [selectedLeverage]);
	const maxQuantity = useMemo(() => {
		if (!displayedPrice || displayedPrice <= 0) return 0;
		const notionalBuyingPower = accountBalanceUsd * leverageNumber;
		return Number((notionalBuyingPower / displayedPrice).toFixed(8));
	}, [accountBalanceUsd, leverageNumber, displayedPrice]);
	const orderValue = useMemo(() => Number((volume * displayedPrice).toFixed(8)), [volume, displayedPrice]);

	const fetchBalance = useCallback(async () => {
		if (!signedIn) return;
		try {
			const res = await fetch("/api/v1/balance", { credentials: "include" });
			if (!res.ok) {
				console.error("Failed to fetch balance:", res.status);
				return;
			}
			const data = await res.json();

			const rawBalance =
				typeof data === "number"
					? data
					: data?.data !== undefined
						? data.data
						: data?.response?.data !== undefined
							? data.response.data
							: null;

			if (rawBalance !== null && typeof rawBalance === "number") {
				const balanceUsd = rawBalance / BALANCE_DECIMAL;
				setAccountBalanceUsd(balanceUsd);
			}
		} catch (err) {
			console.error("Error fetching balance:", err);
		}
	}, [signedIn]);

	useEffect(() => {
		if (!signedIn) return;
		fetchBalance();
	}, [signedIn, fetchBalance]);

	useEffect(() => {
		if (!signedIn) return;

		const handleBalanceRefresh = () => {
			console.log("Balance refresh event received in TradingModal, refreshing balance with retries...");
			fetchBalance();
			setTimeout(() => {
				if (signedIn) fetchBalance();
			}, 500);
			setTimeout(() => {
				if (signedIn) fetchBalance();
			}, 1500);
			setTimeout(() => {
				if (signedIn) fetchBalance();
			}, 3000);
		};

		window.addEventListener("balance-refresh", handleBalanceRefresh);

		return () => {
			window.removeEventListener("balance-refresh", handleBalanceRefresh);
		};
	}, [signedIn, fetchBalance]);

	useEffect(() => {
		if (!signedIn) return;

		const handlePositionsRefresh = () => {
			console.log("Positions refresh event received in TradingModal, refreshing balance with retries...");
			fetchBalance();
			setTimeout(() => {
				if (signedIn) fetchBalance();
			}, 500);
			setTimeout(() => {
				if (signedIn) fetchBalance();
			}, 1500);
			setTimeout(() => {
				if (signedIn) fetchBalance();
			}, 3000);
		};

		window.addEventListener("positions-refresh", handlePositionsRefresh);

		return () => {
			window.removeEventListener("positions-refresh", handlePositionsRefresh);
		};
	}, [signedIn, fetchBalance]);

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

			const backendAsset = selectedAsset.replace("USDT", "");

			try {
				setSubmitting(true);
				const res = await fetch("/api/v1/trade/create", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify({
						type,
						status: "open",
						asset: backendAsset,
						quantity: volume,
						entryPrice,
						leverage,
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
				// Check if the response indicates success
				if (data?.success === false || (data?.statusCode && data.statusCode >= 400)) {
					const msg = data?.message || "Failed to place order";
					sonar.error("Order failed", msg);
					return;
				}

				sonar.success(
					"Order placed",
					`${type === "long" ? "Buy" : "Sell"} ${volume} ${selectedAsset.replace(
						"USDT",
						""
					)} @ ${entryPrice}`
				);

				window.dispatchEvent(new CustomEvent("positions-refresh"));
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
			<div className="flex flex-col p-4 border-l border-white/5 bg-[#08080a] min-h-0 lg:h-screen items-center justify-center text-zinc-400 font-ibm-plex-sans text-sm">
				Select an asset to start trading
			</div>
		);
	}

	const trade = trades[selectedAsset];
	if (!trade) {
		return (
			<div className="flex flex-col p-4 border-l border-white/5 bg-[#08080a] min-h-0 lg:h-screen items-center justify-center text-zinc-400 font-ibm-plex-sans text-sm">
				Waiting for {selectedAsset} data...
			</div>
		);
	}

	const shortName = selectedAsset.replace("USDT", "");
	const logo = assetLogos[selectedAsset] || "/Bitcoin.png";

	return (
		<div className="flex min-h-0 lg:h-screen flex-col bg-[#08080a] border-l border-white/5 p-4 pb-16 lg:pb-4 overflow-y-auto font-ibm-plex-sans">
			<div className="flex items-center justify-between rounded-[1px] bg-white/[0.02] border border-white/5 px-4 py-3 text-zinc-100 shadow-xl relative overflow-hidden">
				<div className="absolute inset-0 bg-white/[0.02] pointer-events-none" />
				<div className="flex flex-row items-center gap-3">
					<div className="relative h-8 w-8 overflow-hidden rounded-full bg-white/5 border border-white/10 p-0.5">
						<Image src={logo} alt={selectedAsset} fill className="object-cover" />
					</div>
					<div>
						<h2 className="text-lg font-bold tracking-tight text-white font-space">
							{selectedAsset}
						</h2>
					</div>
				</div>
				<div className="flex items-center gap-2 text-xs relative z-10 font-mono">
					<span className="rounded-[1px] bg-white/5 border border-white/10 px-2 py-0.5 font-medium text-zinc-300 tabular-nums">
						{(trade.bid / 10 ** trade.decimals).toFixed(trade.decimals)}
					</span>
					<span className="rounded-[1px] bg-white/5 border border-white/10 px-2 py-0.5 font-medium text-zinc-300 tabular-nums">
						{(trade.ask / 10 ** trade.decimals).toFixed(trade.decimals)}
					</span>
				</div>
			</div>



			<div className="mt-4 w-full rounded-[1px] bg-[#08080a] border border-white/5 p-4 shadow-xl">
				<div className="flex w-full rounded-[1px] bg-[#08080a] border border-white/5 p-[2px] gap-1">
					<button
						className={
							"flex-1 text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 font-space border-l-2 " +
							(side === "buy"
								? "border-emerald-500 bg-emerald-500/5 text-emerald-400"
								: "border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/5")
						}
						onClick={() => setSide("buy")}
						aria-pressed={side === "buy"}
					>
						Buy
					</button>
					<button
						className={
							"flex-1 text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 font-space border-l-2 " +
							(side === "sell"
								? "border-rose-500 bg-rose-500/5 text-rose-400"
								: "border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/5")
						}
						onClick={() => setSide("sell")}
						aria-pressed={side === "sell"}
					>
						Sell
					</button>
				</div>


				<div className="mt-4">
					<div className="flex items-center justify-between text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1.5 font-space">
						<span>Market Price</span>
						<span className={side === "buy" ? "text-emerald-400" : "text-rose-400"}>
							{side === "buy" ? "(Ask)" : "(Bid)"}
						</span>
					</div>
					<div className="flex h-10 w-full items-center justify-between rounded-[1px] bg-[#08080a] border border-white/10 px-3 focus-within:border-white/20 transition-colors">
						<input
							value={displayedPrice ? displayedPrice.toFixed(priceInfo.decimals) : "0"}
							readOnly
							className="w-full bg-transparent text-lg font-space text-zinc-100 outline-none font-space"
							aria-label="Display price"
						/>
						<span className="text-zinc-600 text-xs font-mono">USD</span>
					</div>
				</div>

				<div className="mt-4">
					<style jsx>{`
						input[type="number"].no-spinners::-webkit-inner-spin-button,
						input[type="number"].no-spinners::-webkit-outer-spin-button {
							-webkit-appearance: none;
							margin: 0;
						}
						input[type="number"].no-spinners {
							-moz-appearance: textfield;
						}
					`}</style>
					<div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1.5 font-space">Quantity</div>
					<div className="flex w-full items-center justify-between rounded-[1px] bg-[#08080a] border border-white/10 px-3 py-2 transition-colors focus-within:border-white/30 focus-within:ring-1 focus-within:ring-white/20">
						<input
							id="volume"
							type="number"
							value={volume}
							onChange={(e) => {
								const next = Number(e.target.value);
								const clamped = Math.max(0, Math.min(maxQuantity, next));
								setVolume(clamped);
								const p = maxQuantity > 0 ? Math.max(0, Math.min(100, Math.round((clamped / maxQuantity) * 100))) : 0;
								setPercent(Number.isFinite(p) ? p : 0);
							}}
							className="no-spinners w-full bg-transparent text-right text-lg font-bold font-space text-white placeholder-neutral-600 outline-none"
							placeholder="0.00"
							step="0.01"
							min="0"
							aria-label="Trade volume"
						/>
						<span className="ml-2 text-zinc-600 text-xs font-mono shrink-0">{shortName}</span>
					</div>
				</div>

				<div className="mt-4">
					<style jsx>{`
						input[type="range"].custom-slider {
							-webkit-appearance: none;
							appearance: none;
							background: transparent;
							cursor: pointer;
						}
						input[type="range"].custom-slider::-webkit-slider-track {
							background: rgba(255, 255, 255, 0.05);
							height: 4px;
							border-radius: 1px;
							border: 1px solid rgba(255, 255, 255, 0.1);
						}
						input[type="range"].custom-slider::-webkit-slider-thumb {
							-webkit-appearance: none;
							appearance: none;
							width: 14px;
							height: 14px;
							background: #ffffff;
							border-radius: 1px;
							border: 1px solid rgba(255, 255, 255, 0.3);
							margin-top: -5px;
							transition: all 0.2s;
						}
						input[type="range"].custom-slider::-webkit-slider-thumb:hover {
							background: #e0e0e0;
							box-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
						}
						input[type="range"].custom-slider::-moz-range-track {
							background: rgba(255, 255, 255, 0.05);
							height: 4px;
							border-radius: 1px;
							border: 1px solid rgba(255, 255, 255, 0.1);
						}
						input[type="range"].custom-slider::-moz-range-thumb {
							width: 14px;
							height: 14px;
							background: #ffffff;
							border-radius: 1px;
							border: 1px solid rgba(255, 255, 255, 0.3);
							transition: all 0.2s;
						}
						input[type="range"].custom-slider::-moz-range-thumb:hover {
							background: #e0e0e0;
							box-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
						}
					`}</style>
					<div className="flex items-center justify-between mb-2">
						<div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider font-space">Amount</div>
						<div className="text-xs font-bold font-space text-white">{percent}%</div>
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
						className="custom-slider w-full mb-3"
						aria-label="Volume percentage"
					/>
					<div className="flex gap-1">
						{[25, 50, 75, 100].map((preset) => (
							<button
								key={preset}
								onClick={() => {
									setPercent(preset);
									const nextVol = parseFloat(((preset / 100) * maxQuantity).toFixed(4));
									setVolume(nextVol);
								}}
								className={`flex-1 px-2 py-1 text-[10px] font-bold uppercase tracking-wide rounded-[1px] border transition-all ${percent === preset
									? 'bg-white text-black border-white'
									: 'bg-white/[0.02] text-neutral-400 border-white/10 hover:bg-white/[0.05] hover:text-white hover:border-white/20'
									}`}
							>
								{preset}%
							</button>
						))}
					</div>
				</div>
			</div>

			<div className="mt-4">
				<div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1.5 font-space">Order Value</div>
				<div className="flex h-10 w-full items-center justify-between rounded-[1px] bg-[#08080a] border border-white/5 px-3">
					<div className="text-sm font-space text-zinc-300 tabular-nums font-space">{orderValue || 0}</div>
					<span className="text-zinc-600 text-xs font-mono">USD</span>
				</div>
			</div>

			<div className="mt-4 rounded-[1px] bg-[#08080a] border border-white/5 p-3">
				<div className="flex items-center justify-between text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-3">
					<span>Leverage</span>
					<span className="text-white font-space" aria-live="polite">{selectedLeverage}</span>
				</div>
				<div className="flex w-full flex-row justify-center gap-1">
					{["1x", "5x", "10x", "20x", "100x"].map((leverage) => {
						const isActive = leverage === selectedLeverage;
						return (
							<button
								key={leverage}
								onClick={() => {
									setSelectedLeverage(leverage);
									setPercent((prev) => {
										const newMaxQ = (accountBalanceUsd * Number(leverage.replace("x", ""))) / (displayedPrice || 1);
										const newP = newMaxQ > 0 ? Math.max(0, Math.min(100, Math.round((volume / newMaxQ) * 100))) : 0;
										return Number.isFinite(newP) ? newP : 0;
									});
								}}
								aria-pressed={isActive}
								className={
									"w-full rounded-[1px] py-1.5 text-[10px] font-mono transition-all duration-200 border " +
									(isActive
										? "bg-white/10 text-white border-white/20"
										: "bg-transparent text-zinc-500 border-transparent hover:bg-white/5 hover:text-zinc-300")
								}
							>
								{leverage}
							</button>
						);
					})}
				</div>
			</div>

			<div className="w-full pt-2">
				<button
					onClick={() => setShowRiskFields((s) => !s)}
					aria-expanded={showRiskFields}
					className="flex w-full items-center justify-between rounded-[1px] bg-white/[0.02] border border-white/5 px-3 py-2 text-left text-xs hover:bg-white/5 transition-all duration-200"
				>
					<div className="flex items-center gap-2">
						<span className="text-zinc-500 font-sans text-xs uppercase tracking-wide">Available</span>
						<span className="text-zinc-200 font-space font-bold text-sm tracking-tight hover:text-white transition-colors cursor-default">
							${(accountBalanceUsd).toFixed(2)}
						</span>
					</div>
					<svg
						className={"h-3 w-3 text-zinc-500 transition-transform " + (showRiskFields ? "rotate-180" : "rotate-0")}
						viewBox="0 0 20 20"
						fill="currentColor"
						aria-hidden="true"
					>
						<path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.116l3.71-3.885a.75.75 0 111.08 1.04l-4.24 4.44a.75.75 0 01-1.08 0L5.25 8.27a.75.75 0 01-.02-1.06z" clipRule="evenodd" />
					</svg>
				</button>
				{showRiskFields && (
					<div className="mt-2 grid grid-cols-2 gap-2">
						<div className="space-y-1">
							<label htmlFor="take-profit" className="text-[9px] text-zinc-500 uppercase tracking-wide">Take Profit</label>
							<div className="flex h-9 w-full items-center justify-end rounded-[1px] bg-[#08080a] border border-white/10 px-2 focus-within:border-white/20 transition-colors">
								<input
									id="take-profit"
									type="number"
									value={takeProfit || ""}
									onChange={(e) => handleNumericStringInput(e.target.value, setTakeProfit)}
									className="block w-full bg-transparent text-right text-sm font-bold font-space text-white placeholder-neutral-600 outline-none"
									placeholder="0.00"
									aria-label="Take profit price"
								/>
							</div>
						</div>
						<div className="space-y-1">
							<label htmlFor="stop-loss" className="text-[9px] text-zinc-500 uppercase tracking-wide">Stop Loss</label>
							<div className="flex h-9 w-full items-center justify-end rounded-[1px] bg-[#08080a] border border-white/10 px-2 focus-within:border-white/20 transition-colors">
								<input
									id="stop-loss"
									pattern="^[0-9]*[.,]?[0-9]*$"
									step={0.1}
									min={0}
									value={stopLoss}
									onChange={(e) => handleNumericStringInput(e.target.value, setStopLoss)}
									placeholder={(trade.bid / 10 ** trade.decimals).toFixed(trade.decimals)}
									className="w-full bg-transparent text-xs font-space text-zinc-100 outline-none placeholder:text-zinc-700"
									aria-label="Stop loss price"
								/>
							</div>
						</div>
					</div>
				)}
			</div>

			<div className="pt-4 text-[9px] text-zinc-600 text-center font-mono">
				Prices are indicative. Final execution shown in confirmation.
			</div>

			<div className="mt-4 flex gap-3">
				<Button
					variant="ghost"
					className={`w-full h-12 text-sm font-bold uppercase tracking-wider rounded-[1px] font-space transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${side === 'buy'
						? 'bg-white hover:bg-neutral-200 text-black shadow-[0_0_20px_rgba(255,255,255,0.08)]'
						: 'bg-neutral-300 text-black hover:bg-neutral-400 shadow-[0_0_20px_rgba(255,255,255,0.05)]'
						}`}
					disabled={submitting}
					onClick={() => placeOrder(side)}
					aria-label={side === "buy" ? "Place buy order" : "Place sell order"}
				>
					{submitting ? "Processing..." : (side === "buy" ? "Place Buy Order" : "Place Sell Order")}
				</Button>
			</div>
		</div >
	);
}

