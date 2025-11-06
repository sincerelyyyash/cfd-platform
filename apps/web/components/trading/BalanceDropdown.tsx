"use client";
import { useEffect, useState, useRef, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTradeStore } from "@/store/useTradeStore";
import { useAuth } from "@/components/auth/AuthProvider";

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

const BALANCE_DECIMAL = 100;
const PRICE_DECIMAL = 10000;
const QUANTITY_DECIMAL = 10000;

const calculateRealTimePnL = (order: OrderRow, trades: Record<string, any>): number => {
	if (order.status !== "open") return order.pnL || 0;
	
	const frontendAsset = `${order.asset}USDT`;
	const currentTrade = trades[frontendAsset];
	
	if (!currentTrade) {
		return order.pnL || 0;
	}
	
	const entryPriceScaled = order.entryPrice;
	const currentPriceScaled = order.type === "long" ? currentTrade.bid : currentTrade.ask;
	const decimals = currentTrade.decimals || 4;
	const priceDecimal = 10 ** decimals;
	
	
	let pnL = 0;
	const priceDiff = order.type === "long" 
		? (currentPriceScaled - entryPriceScaled)
		: (entryPriceScaled - currentPriceScaled);
	
	pnL = (priceDiff * order.quantity) / (priceDecimal * QUANTITY_DECIMAL);
	
	return Number.isFinite(pnL) ? pnL : (order.pnL || 0);
};

export default function BalanceDropDown() {
	const { signedIn } = useAuth();
	const [balance, setBalance] = useState<number | null>(null);
	const [openOrders, setOpenOrders] = useState<OrderRow[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
	const retryCountRef = useRef(0);
	const MAX_RETRIES = 5;
	const POLLING_INTERVAL = 5000;
	const trades = useTradeStore((s) => s.trades);

	const fetchBalance = async (isPolling = false) => {
		if (!signedIn) return;
		if (!isPolling) setLoading(true);
		try {
			const res = await fetch("/api/v1/balance", { credentials: "include" });
			
			if (!res.ok) {
				if (res.status === 404 && !isPolling) {
					console.log("User not found, retrying...");
					setTimeout(() => {
						if (signedIn) {
							fetchBalance(true);
						}
					}, 2000);
					setLoading(false);
					return;
				}
				if (!isPolling) {
					console.error("Failed to fetch balance:", res.status, res.statusText);
					setError(true);
				}
				return;
			}
			
			const data = await res.json().catch(() => null);
			
			console.log("Balance API response:", data);
			
			setError(false);
			
			let balanceValue: number | null = null;
			if (typeof data?.data === "number") {
				balanceValue = data.data;
			} else if (typeof data?.response?.data === "number") {
				balanceValue = data.response.data;
			} else if (typeof data === "number") {
				balanceValue = data;
			} else if (data && typeof data === "object" && data.statusCode === 200) {
				if (typeof data.data === "number") {
					balanceValue = data.data;
				}
			}
			
			console.log("Parsed balance value:", balanceValue);
			
			if (typeof balanceValue === "number") {
				const balanceInUSD = balanceValue / BALANCE_DECIMAL;
				console.log("Setting balance to:", balanceInUSD, "USD");
				setBalance(balanceInUSD);
				retryCountRef.current = 0;
			} else if (retryCountRef.current < MAX_RETRIES) {
				retryCountRef.current++;
				console.log(`Balance value not found in response, retry ${retryCountRef.current}/${MAX_RETRIES}...`);
				setTimeout(() => {
					if (signedIn) {
						fetchBalance(true);
					}
				}, 2000);
			} else if (!isPolling) {
				console.error("Max retries reached, balance not available");
				setError(true);
			}
		} catch (e) {
			console.error("Error fetching balance:", e);
			if (!isPolling) {
				setError(true);
			}
		} finally {
			if (!isPolling) setLoading(false);
		}
	};

	const fetchOpenOrders = async (isPolling = false) => {
		if (!signedIn) return;
		try {
			const res = await fetch("/api/v1/trade/open", { credentials: "include" });
			
			if (!res.ok) {
				// If 404 or 400, set empty array (no open orders) - this is normal
				// No error notification needed for empty orders
				console.log("No open orders or error fetching orders:", res.status);
				setOpenOrders([]);
				return;
			}
			
			const data = await res.json().catch(() => null);
			
			// Response structure: { statusCode: 200, success: true, message: "...", data: [...] }
			// Handle different response structures
			let rows: OrderRow[] = [];
			if (Array.isArray(data?.data)) {
				rows = data.data;
			} else if (Array.isArray(data)) {
				rows = data;
			} else if (Array.isArray(data?.response?.data)) {
				rows = data.response.data;
			}
			
			console.log("Open orders response:", data, "Parsed rows:", rows);
			setOpenOrders(rows || []);
		} catch (e) {
			console.error("Error fetching open orders:", e);
			// Silently fail - set empty array (no open orders)
			setOpenOrders([]);
		}
	};

	const handleFetch = async (isPolling = false) => {
		await Promise.all([fetchBalance(isPolling), fetchOpenOrders(isPolling)]);
	};

	const startPolling = () => {
		if (pollingIntervalRef.current) {
			clearInterval(pollingIntervalRef.current);
		}
		pollingIntervalRef.current = setInterval(() => {
			handleFetch(true);
		}, POLLING_INTERVAL);
	};

	const stopPolling = () => {
		if (pollingIntervalRef.current) {
			clearInterval(pollingIntervalRef.current);
			pollingIntervalRef.current = null;
		}
	};

	useEffect(() => {
		if (!signedIn) {
			setBalance(null);
			setOpenOrders([]);
			setError(false);
			retryCountRef.current = 0;
			stopPolling();
			return;
		}

		retryCountRef.current = 0;
		
		handleFetch();
		startPolling();

		const handleBalanceRefresh = () => {
			console.log("Balance refresh event received, refreshing balance and orders with retries...");
			handleFetch(false);
			setTimeout(() => {
				if (signedIn) handleFetch(true);
			}, 500);
			setTimeout(() => {
				if (signedIn) handleFetch(true);
			}, 1500);
			setTimeout(() => {
				if (signedIn) handleFetch(true);
			}, 3000);
		};
		
		window.addEventListener("balance-refresh", handleBalanceRefresh);

		return () => {
			stopPolling();
			window.removeEventListener("balance-refresh", handleBalanceRefresh);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [signedIn]);

	const totalPnL = useMemo(() => {
		return openOrders.reduce((sum, order) => {
			const orderPnL = calculateRealTimePnL(order, trades);
			return sum + orderPnL;
		}, 0);
	}, [openOrders, trades]);

	const totalMargin = useMemo(() => {
		return openOrders.reduce((sum, order) => sum + (order.margin || 0), 0) / BALANCE_DECIMAL;
	}, [openOrders]);

	const netWorth = useMemo(() => {
		return balance !== null ? balance + totalPnL : null;
	}, [balance, totalPnL]);

	const equity = useMemo(() => {
		return netWorth !== null ? netWorth : null;
	}, [netWorth]);

	const freeMargin = useMemo(() => {
		return balance !== null ? balance - totalMargin : null;
	}, [balance, totalMargin]);

	const formatCurrency = (value: number | null) => {
		if (value === null) return "—";
		return `${value.toFixed(2)} USD`;
	};

	const displayNetWorth = useMemo(() => {
		if (balance !== null) {
			return `${(balance + totalPnL).toFixed(2)} USD`;
		}
		if (!signedIn) {
			return "—";
		}
		if (loading) {
			return "Loading...";
		}
		if (error) {
			return "Error";
		}
		return "...";
	}, [balance, totalPnL, signedIn, loading, error]);

	return (
		<div className="p-2 width-60">
			<DropdownMenu>
				<DropdownMenuTrigger 
					className="text-zinc-100 hover:text-zinc-200 transition-colors"
					disabled={loading && balance === null}
				>
					{displayNetWorth}
				</DropdownMenuTrigger>
				<DropdownMenuContent className="bg-neutral-900/95 border-neutral-800/50 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.4)]">
					<DropdownMenuLabel className="text-zinc-100">My Account</DropdownMenuLabel>
					<DropdownMenuItem className="text-zinc-200 hover:bg-neutral-800/50">
						Balance: {formatCurrency(balance)}
					</DropdownMenuItem>
					<DropdownMenuItem className="text-zinc-200 hover:bg-neutral-800/50">
						Equity: {formatCurrency(equity)}
					</DropdownMenuItem>
					<DropdownMenuItem className="text-zinc-200 hover:bg-neutral-800/50">
						Margin: {formatCurrency(totalMargin)}
					</DropdownMenuItem>
					<DropdownMenuItem className="text-zinc-200 hover:bg-neutral-800/50">
						Free Margin: {formatCurrency(freeMargin)}
					</DropdownMenuItem>
					{openOrders.length > 0 && (
						<DropdownMenuItem className="text-zinc-200 hover:bg-neutral-800/50">
							Unrealized P&L: {formatCurrency(totalPnL)}
						</DropdownMenuItem>
					)}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
