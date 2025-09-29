"use client";
import React, { useEffect, useRef } from "react";
import type {
	IChartApi,
	ISeriesApi,
	CandlestickData,
} from "lightweight-charts";


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

	useEffect(() => {
		if (!containerRef.current) return;

		let disposed = false;

		(async () => {
			try {
				const mod = await import("lightweight-charts");
				const createChart = mod.createChart;

				if (!createChart || typeof createChart !== "function") {
					console.warn("lightweight-charts createChart not available");
					return;
				}

				if (disposed || !containerRef.current) return;

				chartRef.current = createChart(containerRef.current, {
					width,
					height,
					layout: {
						textColor: "white",
						background: { color: "black" },
					},
				});

				const chartApi = chartRef.current as unknown as {
					addCandlestickSeries?: (options?: any) => ISeriesApi<"Candlestick">;
					timeScale?: () => { fitContent?: () => void };
				};

				if (chartApi && typeof chartApi.addCandlestickSeries === "function") {
					seriesRef.current = chartApi.addCandlestickSeries({
						upColor: "#26a69a",
						downColor: "#ef5350",
						borderVisible: false,
						wickUpColor: "#26a69a",
						wickDownColor: "#ef5350",
					});
				} else {
					console.warn("Chart API missing addCandlestickSeries; rendering without series");
				}

				if (typeof chartApi?.timeScale === "function") {
					chartApi.timeScale()?.fitContent?.();
				}
			} catch (err) {
				console.error("Failed to initialize chart:", err);
			}
		})();

		return () => {
			disposed = true;
			try {
				chartRef.current?.remove?.();
			} catch {}
			chartRef.current = null;
			seriesRef.current = null;
		};
	}, [width, height]);

	useEffect(() => {
		if (!seriesRef.current || !Array.isArray(data) || data.length === 0) return;

		const normalized = data.map((c) => ({
			...c,
			time:
				typeof c.time === "number" && c.time > 1e12
					? Math.floor(c.time / 1000)
					: c.time,
		}));

		try {
			seriesRef.current.setData(normalized);
		} catch (err) {
			console.warn("Failed to set series data:", err);
		}
	}, [data]);

	return <div ref={containerRef} style={{ width, height }} />;
};

export default CandlestickChart;

