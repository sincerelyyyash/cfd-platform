"use client";
import { useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import { sonar } from "@/components/ui/sonar";
import { useTradeStore } from "@/store/useTradeStore";

type OrderRow = {
	id: string;
	userId: string;
	type: "long" | "short";
	status: "open" | "closed" | "pending";
	asset: string;
	quantity: number;
	entryPrice: number;
	exitPrice?: number;
	pnL?: number;
	leverage?: number;
	margin?: number;
	stopLoss?: number;
	takeProfit?: number;
};

const tabs = ["Open", "Closed"] as const;

const assetLogos: Record<string, string> = {
	BTCUSDT: "/Bitcoin.png",
	ETHUSDT: "/ethereum.png",
	SOLUSDT: "/Solana.png",
};

const BALANCE_DECIMAL = 100;
const PRICE_DECIMAL = 10000;
const QUANTITY_DECIMAL = 10000;

const TradePositions = () => {
	const { signedIn } = useAuth();
	const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Open");
	const [openOrders, setOpenOrders] = useState<OrderRow[]>([]);
	const [closedOrders, setClosedOrders] = useState<OrderRow[]>([]);
	const [loading, setLoading] = useState(false);
	const [closingOrderId, setClosingOrderId] = useState<string | null>(null);
	const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
	const POLLING_INTERVAL = 5000; // Poll every 5 seconds

	const handleFetch = async (tab: (typeof tabs)[number], isPolling = false) => {
		if (!signedIn) return;
		if (!isPolling) setLoading(true);
		try {
			const endpoint = tab === "Open" ? "/api/v1/trade/open" : "/api/v1/trade/closed";
			const res = await fetch(endpoint, { credentials: "include" });
			const data = await res.json().catch(() => ({} as any));

			if (!res.ok) {
				if (tab === "Closed" && res.status === 404) {
					console.log("No closed orders found (404)");
					setClosedOrders([]);
					if (!isPolling) setLoading(false);
					return;
				}
				if (!isPolling) {
					console.error(`Failed to load ${tab} positions:`, res.status, data);
					sonar.error("Failed to load positions", data?.message || `HTTP ${res.status}`);
				}
				if (!isPolling) setLoading(false);
				return;
			}

			const rows: OrderRow[] = Array.isArray(data?.data)
				? data.data
				: Array.isArray(data)
					? data
					: Array.isArray(data?.response?.data)
						? data.response.data
						: [];

			console.log(`Fetched ${tab} orders:`, rows.length, rows);

			if (tab === "Open") {
				setOpenOrders(rows);
			} else {
				setClosedOrders(rows);
			}
		} catch (e) {
			console.error(`Error fetching ${tab} orders:`, e);
			if (!isPolling) {
				sonar.error("Network error", (e as Error).message);
			}
			if (tab === "Open") {
				setOpenOrders([]);
			} else {
				setClosedOrders([]);
			}
		} finally {
			if (!isPolling) setLoading(false);
		}
	};

	const startPolling = () => {
		if (pollingIntervalRef.current) {
			clearInterval(pollingIntervalRef.current);
		}
		pollingIntervalRef.current = setInterval(() => {
			handleFetch("Open", true);
		}, POLLING_INTERVAL);
	};

	const stopPolling = () => {
		if (pollingIntervalRef.current) {
			clearInterval(pollingIntervalRef.current);
			pollingIntervalRef.current = null;
		}
	};

	useEffect(() => {
		if (!signedIn) return;

		handleFetch("Open", false);
		handleFetch("Closed", false);

		if (activeTab === "Open") {
			startPolling();
		} else {
			stopPolling();
		}

		return () => {
			stopPolling();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [signedIn]);

	useEffect(() => {
		if (!signedIn) return;
		handleFetch(activeTab, false);
	}, [activeTab, signedIn]);

	useEffect(() => {
		if (!signedIn) return;

		const handlePositionsRefresh = () => {
			console.log("Positions refresh event received, refreshing positions...");
			handleFetch("Open", false);
			handleFetch("Closed", false);
		};

		window.addEventListener("positions-refresh", handlePositionsRefresh);

		return () => {
			window.removeEventListener("positions-refresh", handlePositionsRefresh);
		};
	}, [signedIn]);

	useEffect(() => {
		if (activeTab === "Open" && openOrders.length > 0) {
			startPolling();
		} else if (activeTab === "Open" && openOrders.length === 0) {
			stopPolling();
		}
	}, [openOrders.length, activeTab]);

	const trades = useTradeStore((s) => s.trades);

	const calculateRealTimePnL = (order: OrderRow): number | null => {
		if (order.status !== "open") return null;

		const frontendAsset = `${order.asset}USDT`;
		const currentTrade = trades[frontendAsset];

		if (!currentTrade) return null;

		const entryPriceScaled = order.entryPrice;
		const currentPriceScaled = order.type === "long" ? currentTrade.bid : currentTrade.ask;
		const decimals = currentTrade.decimals;
		const priceDecimal = 10 ** decimals;

		let pnL = 0;
		const priceDiff = order.type === "long"
			? (currentPriceScaled - entryPriceScaled)
			: (entryPriceScaled - currentPriceScaled);

		pnL = (priceDiff * order.quantity) / (priceDecimal * QUANTITY_DECIMAL);

		return Number.isFinite(pnL) ? pnL : null;
	};

	const handleCloseOrder = async (orderId: string) => {
		if (!signedIn) return;

		setClosingOrderId(orderId);
		try {
			const res = await fetch("/api/v1/trade/close", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ orderId }),
			});

			if (res.status === 401 || res.status === 403) {
				sonar.error("Not logged in", "Please sign in to close orders.");
				return;
			}

			const data = await res.json().catch(() => ({} as any));

			if (!res.ok || data?.success === false || (data?.statusCode && data.statusCode >= 400)) {
				const msg = data?.message || "Failed to close order";
				sonar.error("Close order failed", msg);
				return;
			}

			const pnLScaled = data?.data?.pnL;
			const pnL = typeof pnLScaled === "number" ? pnLScaled / BALANCE_DECIMAL : null;
			const pnLMessage = typeof pnL === "number"
				? ` P&L: ${pnL >= 0 ? "+" : ""}${pnL.toFixed(2)} USD`
				: "";

			sonar.success("Order closed", `Order closed successfully.${pnLMessage}`);

			// Refresh open and closed orders
			await Promise.all([
				handleFetch("Open", false),
				handleFetch("Closed", false),
			]);

			// Trigger balance refresh by dispatching a custom event
			// BalanceDropdown will listen for this event and refresh
			window.dispatchEvent(new CustomEvent("balance-refresh"));
		} catch (e) {
			sonar.error("Network error", (e as Error).message);
		} finally {
			setClosingOrderId(null);
		}
	};

	const rows = useMemo(() => (activeTab === "Open" ? openOrders : closedOrders), [activeTab, openOrders, closedOrders]);

	if (!signedIn) {
		return (
			<div className="flex flex-col bg-[#08080a]">
				<div className="flex flex-row items-center justify-between border-b border-white/5 bg-[#08080a]">
					<div className="flex flex-row gap-1 p-2">
						<div role="tablist" aria-label="Positions filter" className="flex items-center gap-1">
							{tabs.map((tab) => {
								const isActive = tab === activeTab;
								return (
									<button
										key={tab}
										role="tab"
										aria-selected={isActive}
										onClick={() => setActiveTab(tab)}
										className={
											"rounded-[1px] px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 outline-none font-space " +
											(isActive
												? "bg-white text-black"
												: "text-neutral-500 hover:text-white hover:bg-white/5")
										}
									>
										{tab}
									</button>
								);
							})}
						</div>
					</div>
					<div className="flex flex-row items-center gap-2 p-2 text-zinc-400">
						<Button
							variant="outline"
							className="px-2 py-1 text-[10px] h-7 bg-transparent border-white/10 hover:bg-white/5"
							aria-label="Refresh positions"
							disabled
						>
							Refresh
						</Button>
					</div>
				</div>
				<div className="p-4">
					<div className="flex flex-col items-center justify-center rounded-[1px] border border-white/5 bg-white/[0.01] px-4 py-12 text-center">
						<div className="mb-4 text-xs text-neutral-500 font-mono">Log in to view your open and closed positions.</div>
						<Button
							variant="outline"
							className="px-6 py-2 text-xs font-bold uppercase tracking-wider bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-[1px]"
							aria-label="Log in to view your positions"
							onClick={() => (window.location.href = "/signin")}
						>
							Log in
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col bg-[#08080a] h-full">
			<div className="flex flex-row items-center justify-between border-b border-white/5 bg-[#08080a] sticky top-0 z-10">
				<div className="flex flex-row gap-1 p-2">
					<div role="tablist" aria-label="Positions filter" className="flex items-center gap-1">
						{tabs.map((tab) => {
							const isActive = tab === activeTab;
							return (
								<button
									key={tab}
									role="tab"
									aria-selected={isActive}
									onClick={() => setActiveTab(tab)}
									className={
										"rounded-[1px] px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 outline-none font-space " +
										(isActive
											? "bg-white text-black"
											: "text-neutral-500 hover:text-white hover:bg-white/5")
									}
								>
									{tab}
								</button>
							);
						})}
					</div>
				</div>
				<div className="flex flex-row items-center gap-2 p-2 text-zinc-400">
					<Button
						variant="outline"
						className="px-2 py-1 text-[10px] h-7 bg-transparent border-white/10 hover:bg-white/5 uppercase tracking-wide rounded-[1px]"
						aria-label="Refresh positions"
						onClick={() => handleFetch(activeTab)}
						disabled={loading}
					>
						{loading ? "Loading..." : "Refresh"}
					</Button>
				</div>
			</div>
			<div className="flex-1 overflow-auto">
				<div role="list" aria-label={`${activeTab} positions`} className="w-full">
					{rows.length === 0 ? (
						<div className="flex items-center justify-center py-12 text-neutral-600 text-xs font-mono uppercase tracking-wider">
							No {activeTab.toLowerCase()} positions
						</div>
					) : (
						<div className="min-w-full">
							<div className="grid grid-cols-12 px-4 py-2 border-b border-white/5 text-[9px] uppercase tracking-wider text-neutral-500 font-space font-bold sticky top-0 bg-[#08080a] z-10">
								<div className="col-span-3">Asset</div>
								<div className="col-span-2 text-right">Size</div>
								<div className="col-span-2 text-right">Entry</div>
								<div className="col-span-2 text-right">Mark</div>
								<div className="col-span-2 text-right">PnL</div>
								<div className="col-span-1"></div>
							</div>
							{rows.map((row) => (
								<div
									key={row.id}
									role="listitem"
									className="group grid grid-cols-12 items-center px-4 py-3 border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors"
								>
									<div className="col-span-3 flex items-center gap-3">
										{(() => {
											// Convert asset from backend format (BTC) to frontend format (BTCUSDT)
											const frontendAsset = `${row.asset}USDT`;
											const logo = assetLogos[frontendAsset] || "/Bitcoin.png";
											const shortName = row.asset.replace("USDT", "");

											return (
												<>
													<Image
														src={logo}
														alt={`${shortName} logo`}
														width={20}
														height={20}
														className="rounded-full"
													/>
													<div className="flex flex-col">
														<span className="text-sm font-bold tracking-tight text-white font-space">{row.asset}</span>
														<span className={`text-[10px] uppercase tracking-wider font-bold ${row.type === 'long' ? 'text-emerald-500' : 'text-rose-500'}`}>{row.type} {row.leverage}x</span>
													</div>
												</>
											);
										})()}
									</div>
									<div className="col-span-2 text-right text-sm font-bold font-space text-neutral-400">
										{row.quantity}
									</div>
									<div className="col-span-2 text-right text-sm font-bold font-space text-neutral-300">
										{(row.entryPrice / PRICE_DECIMAL).toFixed(2)}
									</div>

									<div className="col-span-2 text-right">
										{activeTab === "Open" && (() => {
											const frontendAsset = `${row.asset}USDT`;
											const currentTrade = trades[frontendAsset];
											const markPrice = row.type === "long" ? currentTrade?.bid : currentTrade?.ask;

											if (!markPrice || !currentTrade) return <span className="text-sm font-space text-neutral-600">-</span>;

											return (
												<span className="text-sm font-bold font-space text-neutral-300">
													{(markPrice / (10 ** currentTrade.decimals)).toFixed(2)}
												</span>
											)
										})()}
										{activeTab === "Closed" && typeof row.exitPrice === "number" && (
											<span className="text-sm font-bold font-space text-neutral-300">
												{(row.exitPrice / PRICE_DECIMAL).toFixed(2)}
											</span>
										)}
									</div>

									<div className="col-span-2 text-right">
										{activeTab === "Open" && (() => {
											const realTimePnL = calculateRealTimePnL(row);
											const displayPnL = realTimePnL !== null ? realTimePnL : (typeof row.pnL === "number" ? row.pnL / BALANCE_DECIMAL : null);

											if (displayPnL === null) return <span className="text-sm font-space text-neutral-600">-</span>;

											return (
												<div className={`text-sm font-bold font-space tracking-tight ${displayPnL >= 0
													? "text-emerald-400"
													: "text-rose-500"
													}`}>
													{displayPnL >= 0 ? "+" : ""}{displayPnL.toFixed(2)}
												</div>
											);
										})()}
										{activeTab === "Closed" && typeof row.pnL === "number" && (() => {
											const displayPnL = row.pnL / BALANCE_DECIMAL;
											return (
												<div className={`text-sm font-bold font-space tracking-tight ${displayPnL >= 0
													? "text-emerald-400"
													: "text-rose-500"
													}`}>
													{displayPnL >= 0 ? "+" : ""}{displayPnL.toFixed(2)}
												</div>
											);
										})()}
									</div>

									<div className="col-span-1 flex justify-end">
										{activeTab === "Open" && (
											<Button
												variant="ghost"
												className="px-2 py-0.5 text-[9px] h-6 bg-white/5 hover:bg-white/10 text-white rounded-[1px] border border-white/5 uppercase tracking-wide hover:border-red-500/50 hover:text-red-400 transition-colors"
												onClick={() => handleCloseOrder(row.id)}
												disabled={closingOrderId === row.id}
												aria-label={`Close order ${row.id}`}
											>
												{closingOrderId === row.id ? "..." : "Close"}
											</Button>
										)}
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default TradePositions;
