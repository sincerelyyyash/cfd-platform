"use client";
import React, { useEffect, useRef, useState } from "react";
import type { IChartApi, ISeriesApi, CandlestickData } from "lightweight-charts";
import { useTradeStore } from "@/store/useTradeStore";
type TradeStoreState = ReturnType<typeof useTradeStore.getState>;

type CandlestickChartProps = {
	data: CandlestickData[];
	height?: number;
};

const CandlestickChart: React.FC<CandlestickChartProps> = ({
    data,
    height = 500,
}) => {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const chartRef = useRef<IChartApi | null>(null);
	const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
	const [isReady, setIsReady] = useState(false);

	// Keep track of the last bar, so we can update its close in-place for realtime price
	const lastBarRef = useRef<CandlestickData | null>(null);

	const inferDecimals = (value: number): number => {
		if (!Number.isFinite(value)) return 2;
		const s = String(value);
		const dot = s.indexOf(".");
		return dot === -1 ? 0 : Math.min(10, s.length - dot - 1);
	};

	const normalizePrice = (raw: number, decimalsHint?: number): number | null => {
		if (!Number.isFinite(raw)) return null;
		const decimals = Number.isFinite(decimalsHint) ? (decimalsHint as number) : inferDecimals(raw);
		try {
			const rounded = Number(raw.toFixed(Math.max(0, Math.min(10, decimals))));
			return Number.isFinite(rounded) ? rounded : null;
		} catch {
			return null;
		}
	};

	const scaleByDecimalsIfNeeded = (raw: number, decimals: number | undefined): number => {
		if (!Number.isFinite(raw)) return NaN;
		const hasFraction = raw % 1 !== 0;
		if (hasFraction || !Number.isFinite(decimals) || (decimals as number) <= 0) {
			return raw;
		}
		const factor = Math.pow(10, decimals as number);
		// If raw is clearly too large compared to typical price ranges, scale it down
		return raw / factor;
	};

    useEffect(() => {
        if (!containerRef.current) return;

		let mounted = true;

		const initChart = async () => {
			try {
				const { createChart, CandlestickSeries } = await import("lightweight-charts");
				
				if (!mounted || !containerRef.current) return;

                const initialWidth = containerRef.current.clientWidth || 800;
                const chart = createChart(containerRef.current, {
                    width: initialWidth,
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

                // Observe width changes to keep price scale visible
                const observer = new (window as any).ResizeObserver((entries: any[]) => {
                    const entry = entries[0];
                    if (!entry) return;
                    const newWidth = Math.floor(entry.contentRect.width);
                    if (Number.isFinite(newWidth) && newWidth > 0) {
                        try {
                            chart.resize(newWidth, height);
                        } catch {}
                    }
                });
                observer.observe(containerRef.current);

                // store observer on the element for cleanup
                (containerRef.current as any).__observer = observer;
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
            if (containerRef.current && (containerRef.current as any).__observer) {
                try { (containerRef.current as any).__observer.disconnect(); } catch {}
                (containerRef.current as any).__observer = null;
            }
			chartRef.current = null;
			seriesRef.current = null;
		};
    }, [height]);

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
			// cache last bar for realtime update
			lastBarRef.current = numericData[numericData.length - 1] ?? null;
		} catch (err) {
			console.warn("Failed to set series data:", err);
		}
	}, [data, isReady]);

	// Subscribe to store updates without causing React re-renders
	useEffect(() => {
		if (!isReady) return;

		// Listener receives the full state to derive current trade based on selected asset
		const unsubscribe = useTradeStore.subscribe((state: TradeStoreState) => {
			try {
				const selected = state.selectedAsset;
				const trade = state.trades[selected];
				if (!trade || !seriesRef.current || !lastBarRef.current) return;

				const rawPrice = Number.isFinite(trade.price) && trade.price > 0 ? trade.price : trade.ask;
				const scaled = scaleByDecimalsIfNeeded(rawPrice, trade.decimals);
				const price = normalizePrice(scaled, trade.decimals);
				if (!Number.isFinite(price)) return;

				// Update the last cached bar with the latest price
				const last = lastBarRef.current;
				// Guard against extreme outliers (e.g., wrong decimals) that would blow up scale
				if (Number.isFinite(last.close) && last.close > 0) {
					const ratio = (price as number) / last.close;
					if (ratio > 100 || ratio < 0.01) return;
				}

				// If a new minute started, start a new bar
				const nowSec = Math.floor(Date.now() / 1000);
				const currentMinute = Math.floor(nowSec / 60) * 60;
				const isNewBar = typeof last.time === "number" && last.time < currentMinute;

				const updated: CandlestickData = (isNewBar
					? {
						time: currentMinute as unknown as number,
						open: price as number,
						high: price as number,
						low: price as number,
						close: price as number,
					}
					: {
						time: last.time as unknown as number,
						open: last.open,
						high: Math.max(last.high, price as number),
						low: Math.min(last.low, price as number),
						close: price as number,
					}) as unknown as CandlestickData;

				lastBarRef.current = updated;
				seriesRef.current.update(updated);
			} catch {
				// ignore
			}
		});

		return () => {
			try { unsubscribe(); } catch {}
		};
	}, [isReady]);

    return <div ref={containerRef} style={{ width: "100%", height }} />;
};

export default CandlestickChart;
