"use client";
import { useEffect, useMemo, useState } from "react";
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

	const handleFetch = async (tab: (typeof tabs)[number]) => {
		if (!signedIn) return;
		setLoading(true);
		try {
			const endpoint = tab === "Open" ? "/api/v1/trade/open" : "/api/v1/trade/closed";
			const res = await fetch(endpoint, { credentials: "include" });
			const data = await res.json().catch(() => ({} as any));
			if (!res.ok) {
				sonar.error("Failed to load positions", data?.message || "");
				setLoading(false);
				return;
			}
			// Engine usually wraps response in {statusCode, data} or server returned raw
			const rows: OrderRow[] = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : Array.isArray(data?.response?.data) ? data.response.data : [];
			if (tab === "Open") setOpenOrders(rows);
			else setClosedOrders(rows);
		} catch (e) {
			sonar.error("Network error", (e as Error).message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (!signedIn) return;
		handleFetch(activeTab);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeTab, signedIn]);

	const rows = useMemo(() => (activeTab === "Open" ? openOrders : closedOrders), [activeTab, openOrders, closedOrders]);

	if (!signedIn) {
		return (
			<div className="flex flex-col bg-black">
				<div className="flex flex-row items-center justify-between border-b border-neutral-900/60">
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
							"rounded-md px-3 py-2 text-sm transition-colors outline-none border " +
							(isActive
								? "border-neutral-800 bg-black text-zinc-200"
								: "border-neutral-800 bg-black text-zinc-300 hover:bg-black")
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
				<div className="flex flex-col items-center justify-center rounded-lg border border-neutral-900/80 bg-black px-3 py-10 text-center">
					<div className="mb-3 text-sm text-zinc-300">Log in to view your open and closed positions.</div>
					<Button
						variant="outline"
						className="px-4 py-2 text-sm"
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
		<div className="flex flex-col bg-black">
			<div className="flex flex-row items-center justify-between border-b border-neutral-900/60">
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
							"rounded-md px-3 py-2 text-sm transition-colors outline-none border " +
							(isActive
								? "border-neutral-800 bg-black text-zinc-200"
								: "border-neutral-800 bg-black text-zinc-300 hover:bg-black")
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
						<div className="flex items-center justify-center rounded-lg border border-neutral-900/80 bg-black px-3 py-6 text-zinc-400 text-sm">
							No {activeTab.toLowerCase()} positions.
						</div>
					) : (
						rows.map((row) => (
							<div
								key={row.id}
								role="listitem"
							className="group flex items-center justify-between rounded-lg border border-neutral-900/80 bg-black px-3 py-2 text-zinc-200 transition-colors hover:bg-black"
							>
								<div className="flex items-center gap-3">
								<div className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-xs font-semibold">
										{row.asset.replace("USDT","")}
									</div>
									<div className="text-sm font-medium tracking-wide">{row.asset}</div>
								</div>
								<div className="flex items-center gap-3">
									<span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 tabular-nums">Entry {row.entryPrice}</span>
									{typeof row.exitPrice === "number" ? (
										<span className="rounded-md bg-rose-500/10 px-2 py-0.5 text-xs font-semibold text-rose-400 tabular-nums">Exit {row.exitPrice}</span>
									) : null}
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
