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
			<div className="flex flex-col bg-neutral-950">
				<div className="flex flex-row items-center justify-between bg-neutral-950 shadow-[0_1px_0_0_rgba(255,255,255,0.03)]">
					<div className="flex flex-row gap-1 p-2 sm:gap-2 sm:p-3">
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
											"rounded-md px-3 py-2 text-sm transition-all duration-200 outline-none " +
											(isActive
												? "bg-neutral-900/40 text-zinc-100 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
												: "bg-neutral-950/40 text-zinc-300 hover:bg-neutral-800/30")
										}
									>
										{tab}
									</button>
								);
							})}
						</div>
					</div>
					<div className="flex flex-row items-center gap-2 p-2 sm:p-3 text-zinc-400">
						<Button
							variant="outline"
							className="px-2 py-1 text-xs"
							aria-label="Refresh positions"
							disabled
						>
							Refresh
						</Button>
					</div>
				</div>
				<div className="p-3 sm:p-4">
					<div className="flex flex-col items-center justify-center rounded-xl bg-neutral-900/30 px-3 py-10 text-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]">
						<div className="mb-4 text-sm text-zinc-300">Log in to view your open and closed positions.</div>
						<Button
							variant="outline"
							className="px-6 py-2 text-sm"
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
		<div className="flex flex-col bg-neutral-950">
			<div className="flex flex-row items-center justify-between bg-neutral-950 shadow-[0_1px_0_0_rgba(255,255,255,0.03)]">
				<div className="flex flex-row gap-1 p-2 sm:gap-2 sm:p-3">
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
										"rounded-md px-3 py-2 text-sm transition-all duration-200 outline-none " +
										(isActive
											? "bg-neutral-900/40 text-zinc-100 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
											: "bg-neutral-950/40 text-zinc-300 hover:bg-neutral-800/30")
									}
								>
									{tab}
								</button>
							);
						})}
					</div>
				</div>
				<div className="flex flex-row items-center gap-2 p-2 sm:p-3 text-zinc-400">
					<Button
						variant="outline"
						className="px-2 py-1 text-xs"
						aria-label="Refresh positions"
						onClick={() => handleFetch(activeTab)}
						disabled={loading}
					>
						{loading ? "Loading..." : "Refresh"}
					</Button>
				</div>
			</div>
			<div className="p-3 sm:p-4">
				<div role="list" aria-label={`${activeTab} positions`} className="space-y-2">
					{rows.length === 0 ? (
						<div className="flex items-center justify-center rounded-xl bg-neutral-900/30 px-3 py-6 text-zinc-400 text-sm shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]">
							No {activeTab.toLowerCase()} positions.
						</div>
					) : (
						rows.map((row) => (
							<div
								key={row.id}
								role="listitem"
								className="group flex items-center justify-between rounded-lg bg-neutral-900/30 px-3 py-2 text-zinc-200 transition-all duration-200 hover:bg-neutral-800/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]"
							>
								<div className="flex items-center gap-3">
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
													width={24}
													height={24}
													className="rounded-full"
												/>
												<div className="text-sm font-medium tracking-wide text-zinc-100">{row.asset}</div>
											</>
										);
									})()}
								</div>
								<div className="flex items-center gap-3">
									<span className="rounded-lg bg-emerald-500/15 px-2 py-1 text-xs font-semibold text-emerald-300 tabular-nums shadow-[inset_0_1px_0_0_rgba(16,185,129,0.2)]">Entry {(row.entryPrice / PRICE_DECIMAL).toFixed(2)}</span>
									{typeof row.exitPrice === "number" ? (
										<span className="rounded-lg bg-rose-500/15 px-2 py-1 text-xs font-semibold text-rose-300 tabular-nums shadow-[inset_0_1px_0_0_rgba(239,68,68,0.2)]">Exit {(row.exitPrice / PRICE_DECIMAL).toFixed(2)}</span>
									) : null}
									{activeTab === "Open" && (() => {
										const realTimePnL = calculateRealTimePnL(row);
										const displayPnL = realTimePnL !== null ? realTimePnL : (typeof row.pnL === "number" ? row.pnL / BALANCE_DECIMAL : null);
										
										if (displayPnL === null) return null;
										
										return (
											<span className={`rounded-lg px-2 py-1 text-xs font-semibold tabular-nums shadow-[inset_0_1px_0_0_rgba(0,0,0,0.2)] ${
												displayPnL >= 0 
													? "bg-emerald-500/15 text-emerald-300" 
													: "bg-rose-500/15 text-rose-300"
											}`}>
												{displayPnL >= 0 ? "+" : ""}{displayPnL.toFixed(2)}
											</span>
										);
									})()}
									{activeTab === "Closed" && typeof row.pnL === "number" && (() => {
										// PnL from backend is in BALANCE_DECIMAL scale, so convert to USD
										const displayPnL = row.pnL / BALANCE_DECIMAL;
										return (
											<span className={`rounded-lg px-2 py-1 text-xs font-semibold tabular-nums shadow-[inset_0_1px_0_0_rgba(0,0,0,0.2)] ${
												displayPnL >= 0 
													? "bg-emerald-500/15 text-emerald-300" 
													: "bg-rose-500/15 text-rose-300"
											}`}>
												{displayPnL >= 0 ? "+" : ""}{displayPnL.toFixed(2)}
											</span>
										);
									})()}
									{activeTab === "Open" && row.leverage && (
										<span className="rounded-lg bg-blue-500/15 px-2 py-1 text-xs font-semibold text-blue-300 tabular-nums shadow-[inset_0_1px_0_0_rgba(59,130,246,0.2)]">
											{row.leverage}x
										</span>
									)}
									{activeTab === "Closed" && row.leverage && (
										<span className="rounded-lg bg-blue-500/15 px-2 py-1 text-xs font-semibold text-blue-300 tabular-nums shadow-[inset_0_1px_0_0_rgba(59,130,246,0.2)]">
											{row.leverage}x
										</span>
									)}
									{activeTab === "Open" && (
										<Button
											variant="destructive"
											className="px-3 py-1 text-xs h-7"
											onClick={() => handleCloseOrder(row.id)}
											disabled={closingOrderId === row.id}
											aria-label={`Close order ${row.id}`}
										>
											{closingOrderId === row.id ? "Closing..." : "Close"}
										</Button>
									)}
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
};

export default TradePositions;
