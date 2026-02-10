"use client";
import React, { useEffect, useState } from "react";
import CandlestickChart from "./TradingViewChart";
import { CandlestickData } from "lightweight-charts";
import { useTradeStore } from "@/store/useTradeStore";

function useIsMobile(breakpoint = 1024) {
	const [isMobile, setIsMobile] = useState(false);
	const [mobileHeight, setMobileHeight] = useState(300);
	useEffect(() => {
		const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
		const update = () => {
			setIsMobile(mql.matches);
			if (mql.matches) {
				setMobileHeight(window.innerHeight - 112);
			}
		};
		update();
		mql.addEventListener("change", update);
		window.addEventListener("resize", update);
		return () => {
			mql.removeEventListener("change", update);
			window.removeEventListener("resize", update);
		};
	}, [breakpoint]);
	return { isMobile, mobileHeight };
}

export default function Charts() {
	const [data, setData] = useState<CandlestickData[]>([]);
	const selectedAsset = useTradeStore((s) => s.selectedAsset);
	const { isMobile, mobileHeight } = useIsMobile();
	const chartHeight = isMobile ? mobileHeight : 550;

	useEffect(() => {
		async function fetchData() {
			try {
				const params = new URLSearchParams({ asset: selectedAsset, ts: "1m", limit: "500" });

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
		<div className="w-full h-full bg-[#08080a] border border-white/5 rounded-[1px]">
			<CandlestickChart data={data} height={chartHeight} />
		</div>
	);
}


