"use client";
import React, { useEffect, useRef, useState } from "react";
import type { IChartApi, ISeriesApi, CandlestickData } from "lightweight-charts";

type CandlestickChartProps = {
	data: CandlestickData[];
	width?: number;
	height?: number;
};

const CandlestickChart: React.FC<CandlestickChartProps> = ({
	data,
	width = 800,
	height = 500,
}) => {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const chartRef = useRef<IChartApi | null>(null);
	const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		if (!containerRef.current) return;

		let mounted = true;

		const initChart = async () => {
			try {
				const { createChart, CandlestickSeries } = await import("lightweight-charts");
				
				if (!mounted || !containerRef.current) return;

				const chart = createChart(containerRef.current, {
					width,
					height,
					layout: {
						textColor: "#e5e7eb",
						background: { color: "#000000" },
					},
					grid: {
						vertLines: { color: "#0b0b0b" },
						horzLines: { color: "#0b0b0b" },
					},
					rightPriceScale: {
						visible: true,
						borderVisible: true,
						borderColor: "#111111",
					},
					timeScale: {
						visible: true,
						borderVisible: true,
						borderColor: "#111111",
						timeVisible: true,
						secondsVisible: false,
					},
				});

				chartRef.current = chart;

				const anyChart = chart as unknown as {
					addSeries?: (seriesCtor: any, options?: any) => ISeriesApi<"Candlestick">;
					addCandlestickSeries?: (options?: any) => ISeriesApi<"Candlestick">;
				};

				let series: ISeriesApi<"Candlestick"> | null = null;
				if (typeof anyChart.addSeries === "function" && CandlestickSeries) {
					series = anyChart.addSeries(CandlestickSeries as any, {
						upColor: "#26a69a",
						downColor: "#ef5350",
						borderVisible: false,
						wickUpColor: "#26a69a",
						wickDownColor: "#ef5350",
					});
				} else if (typeof anyChart.addCandlestickSeries === "function") {
					series = anyChart.addCandlestickSeries({
					upColor: "#26a69a",
					downColor: "#ef5350",
					borderVisible: false,
					wickUpColor: "#26a69a",
					wickDownColor: "#ef5350",
					});
				} else {
					console.warn("Chart API missing series methods; rendering without series", anyChart);
					return;
				}

				seriesRef.current = series;
				setIsReady(true);

				chart.timeScale().fitContent();
			} catch (err) {
				console.error("Failed to initialize chart:", err);
			}
		};

		initChart();

		return () => {
			mounted = false;
			try {
				chartRef.current?.remove();
			} catch {}
			chartRef.current = null;
			seriesRef.current = null;
		};
	}, [width, height]);

	useEffect(() => {
		if (!isReady || !seriesRef.current || !Array.isArray(data) || data.length === 0) return;

		const numericData = data
			.map((c) => {
				const original = c.time as unknown;
				const timeNum =
					typeof original === "number"
						? original > 1e12
							? Math.floor(original / 1000)
							: original
						: NaN;

				if (!Number.isFinite(timeNum)) return null;

				return {
					time: timeNum as number,
					open: c.open,
					high: c.high,
					low: c.low,
					close: c.close,
				} as CandlestickData;
			})
			.filter(Boolean) as CandlestickData[];

		try {
			seriesRef.current.setData(numericData);
		} catch (err) {
			console.warn("Failed to set series data:", err);
		}
	}, [data, isReady]);

	return <div ref={containerRef} style={{ width, height }} />;
};

export default CandlestickChart;
