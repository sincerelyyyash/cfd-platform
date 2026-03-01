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
	const [isLoading, setIsLoading] = useState(true);
	const selectedAsset = useTradeStore((s) => s.selectedAsset);
	const { isMobile, mobileHeight } = useIsMobile();
	const chartHeight = isMobile ? mobileHeight - 40 : 510;

	useEffect(() => {
		let isMounted = true;
		async function fetchData() {
			try {
				setIsLoading(true);
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

				if (isMounted) {
					setData(normalized);
				}
			} catch (err) {
				console.error("Failed to fetch candles:", err);
			} finally {
				if (isMounted) setIsLoading(false);
			}
		}

		fetchData();
		return () => { isMounted = false; };
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
			<div className="flex-1 min-h-0 relative">
				{isLoading ? (
					<div className="absolute inset-0 p-4 border-t border-white/5 bg-[#08080a] overflow-hidden">
						<div className="w-full h-full animate-pulse relative border-r border-b border-white/[0.03]">
							{/* Faint Grid Lines */}
							<div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

							{/* Y-axis labels skeleton */}
							<div className="absolute right-0 top-0 bottom-0 w-12 border-l border-white/[0.03] bg-[#08080a] flex flex-col justify-between py-4 items-center">
								{[0, 1, 2, 3, 4, 5, 6].map(i => (
									<div key={i} className="h-2 w-8 bg-white/5 rounded-[1px]" />
								))}
							</div>

							{/* Data area skeleton to imply loaded shape */}
							<div className="absolute inset-0 flex items-end justify-center px-[50px] gap-2 md:gap-4 pb-8 opacity-40">
								{[0.3, 0.4, 0.35, 0.5, 0.6, 0.4, 0.7, 0.8, 0.65, 0.7, 0.5].map((h, i) => (
									<div key={`c-${i}`} className="flex-1 flex flex-col items-center justify-end h-full">
										<div style={{ height: `${h * 100}%` }} className="w-[1px] bg-white/10" />
										<div style={{ height: `${(h * 0.6) * 100}%` }} className="w-full max-w-[8px] bg-white/10 mt-[-50%] rounded-[1px]" />
									</div>
								))}
							</div>
						</div>
					</div>
				) : (
					<CandlestickChart data={data} height={chartHeight} timeframe={timeframe} />
				)}
			</div>
		</div>
	);
}
