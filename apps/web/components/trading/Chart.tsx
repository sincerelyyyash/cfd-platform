"use client";
import React, { useEffect, useState } from "react";
import CandlestickChart from "./TradingViewChart";
import { CandlestickData } from "lightweight-charts";
import { useTradeStore } from "@/store/useTradeStore";

type Timeframe = "1m" | "5m" | "15m" | "1h" | "4h" | "1d";

const TIMEFRAMES: Timeframe[] = ["1m", "5m", "15m", "1h", "4h", "1d"];

type ChartsProps = {
	timeframe: Timeframe;
	onTimeframeChange: (tf: Timeframe) => void;
};

const useIsMobile = (breakpoint = 1024) => {
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
};

export default function Charts({ timeframe, onTimeframeChange }: ChartsProps) {
	const [data, setData] = useState<CandlestickData[]>([]);
	const selectedAsset = useTradeStore((s) => s.selectedAsset);
	const { isMobile, mobileHeight } = useIsMobile();
	const chartHeight = isMobile ? mobileHeight - 40 : 510;

	useEffect(() => {
		async function fetchData() {
			try {
				const params = new URLSearchParams({
					asset: selectedAsset,
					ts: timeframe,
					limit: "500",
				});

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
	}, [selectedAsset, timeframe]);

	return (
		<div className="flex h-full w-full flex-col bg-[#08080a] border border-white/5 rounded-[1px]">
			<div
				className="flex items-center gap-1 px-3 py-2 border-b border-white/5 overflow-x-auto scrollbar-none shrink-0"
				role="group"
				aria-label="Chart timeframe selector"
			>
				{TIMEFRAMES.map((tf) => {
					const isActive = tf === timeframe;
					return (
						<button
							key={tf}
							onClick={() => onTimeframeChange(tf)}
							aria-pressed={isActive}
							className={
								"px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider font-mono rounded-[1px] border transition-all duration-200 whitespace-nowrap " +
								(isActive
									? "bg-white/10 text-white border-white/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
									: "bg-transparent text-zinc-500 border-transparent hover:bg-white/[0.04] hover:text-zinc-300")
							}
						>
							{tf}
						</button>
					);
				})}
			</div>
			<div className="flex-1 min-h-0">
				<CandlestickChart data={data} height={chartHeight} timeframe={timeframe} />
			</div>
		</div>
	);
}
