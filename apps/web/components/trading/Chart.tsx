"use client";
import React, { useEffect, useState } from "react";
import CandlestickChart from "./TradingViewChart";
import { CandlestickData } from "lightweight-charts";
import { useTradeStore } from "@/store/useTradeStore";

export default function Charts() {
	const [data, setData] = useState<CandlestickData[]>([]);
	const selectedAsset = useTradeStore((s) => s.selectedAsset);

	useEffect(() => {
		async function fetchData() {
			try {
				const params = new URLSearchParams({ asset: selectedAsset, ts: "1m", limit: "500" });
				// Use relative path so Next.js rewrite proxies to backend, avoiding CORS
				const url = `/api/v1/candles?${params.toString()}`;
				const res = await fetch(url, { cache: "no-store" });
				if (!res.ok) {
					throw new Error(`Failed: ${res.status}`);
				}
				const json = await res.json();

				const normalized: CandlestickData[] = json.map((candle: any) => ({
					time: candle.time,
					open: candle.open,
					high: candle.high,
					low: candle.low,
					close: candle.close,
				}));

				setData(normalized);
			} catch (err) {
				console.error("Failed to fetch candles:", err);
			}
		}

		fetchData();
	}, [selectedAsset]);

	return (
		<div className="w-full bg-black">
			<CandlestickChart data={data} height={500} />
		</div>
	);
}

