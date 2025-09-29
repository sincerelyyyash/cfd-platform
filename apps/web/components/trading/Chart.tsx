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
				const params = new URLSearchParams({ asset: selectedAsset, ts: "1m" });
				const res = await fetch(`/api/v1/candles?${params.toString()}`);
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
		<div className="w-full rounded-lg border border-slate-900 bg-slate-950/40">
			<CandlestickChart data={data} width={900} height={500} />
		</div>
	);
}

