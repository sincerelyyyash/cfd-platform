"use client";
import { useEffect, useMemo, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import { sonar } from "@/components/ui/sonar";

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

const tabs = ["Open", /* "Pending",*/ "Closed"] as const;

const TradePositions = () => {
	const { signedIn } = useAuth();
	const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Open");
	const [openOrders, setOpenOrders] = useState<OrderRow[]>([]);
	const [closedOrders, setClosedOrders] = useState<OrderRow[]>([]);
	const [loading, setLoading] = useState(false);
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
				if (!isPolling) {
					sonar.error("Failed to load positions", data?.message || "");
				}
				if (!isPolling) setLoading(false);
				return;
			}
			// Engine usually wraps response in {statusCode, data} or server returned raw
			const rows: OrderRow[] = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : Array.isArray(data?.response?.data) ? data.response.data : [];
			if (tab === "Open") setOpenOrders(rows);
			else setClosedOrders(rows);
		} catch (e) {
			if (!isPolling) {
				sonar.error("Network error", (e as Error).message);
			}
		} finally {
			if (!isPolling) setLoading(false);
		}
	};

	// Start/stop polling for open orders
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
		handleFetch(activeTab);
		
		// Start polling if we have open orders or are on the Open tab
		if (activeTab === "Open") {
			startPolling();
		} else {
			stopPolling();
		}

		// Cleanup polling on unmount or when dependencies change
		return () => {
			stopPolling();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeTab, signedIn]);

	// Start polling when open orders are available
	useEffect(() => {
		if (activeTab === "Open" && openOrders.length > 0) {
			startPolling();
		} else if (activeTab === "Open" && openOrders.length === 0) {
			stopPolling();
		}
	}, [openOrders.length, activeTab]);

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
					{activeTab === "Open" && pollingIntervalRef.current && (
						<div className="flex items-center gap-1 text-xs text-zinc-500">
							<div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
							<span>Live</span>
						</div>
					)}
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
									<div className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-950/60 text-xs font-semibold text-zinc-200 shadow-[inset_0_1px_0_0_rgba(0,0,0,0.3)]">
										{row.asset.replace("USDT","")}
									</div>
									<div className="text-sm font-medium tracking-wide text-zinc-100">{row.asset}</div>
								</div>
								<div className="flex items-center gap-3">
									<span className="rounded-lg bg-emerald-500/15 px-2 py-1 text-xs font-semibold text-emerald-300 tabular-nums shadow-[inset_0_1px_0_0_rgba(16,185,129,0.2)]">Entry {row.entryPrice}</span>
									{typeof row.exitPrice === "number" ? (
										<span className="rounded-lg bg-rose-500/15 px-2 py-1 text-xs font-semibold text-rose-300 tabular-nums shadow-[inset_0_1px_0_0_rgba(239,68,68,0.2)]">Exit {row.exitPrice}</span>
									) : null}
									{activeTab === "Open" && typeof row.pnL === "number" && (
										<span className={`rounded-lg px-2 py-1 text-xs font-semibold tabular-nums shadow-[inset_0_1px_0_0_rgba(0,0,0,0.2)] ${
											row.pnL >= 0 
												? "bg-emerald-500/15 text-emerald-300" 
												: "bg-rose-500/15 text-rose-300"
										}`}>
											{row.pnL >= 0 ? "+" : ""}{row.pnL.toFixed(2)}
										</span>
									)}
									{activeTab === "Open" && row.leverage && (
										<span className="rounded-lg bg-blue-500/15 px-2 py-1 text-xs font-semibold text-blue-300 tabular-nums shadow-[inset_0_1px_0_0_rgba(59,130,246,0.2)]">
											{row.leverage}x
										</span>
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
