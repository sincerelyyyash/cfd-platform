import type { Response, Request } from "express";

export const getSupportedAssets = async (req: Request, res: Response) => {

  try {
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: (err as Error).message,
    })
  }

}

export const getCandles = async (req: Request, res: Response) => {
  const asset = (req.query.asset as string) || "BTCUSDT";
  const ts = (req.query.ts as string) || "1m";
  const limitParam = (req.query.limit as string) || "500";

  const SYMBOL_MAP: Record<string, string> = {
    BTCUSDT: "BTC_USDC",
    ETHUSDT: "ETH_USDC",
    SOLUSDT: "SOL_USDC",
  };

  const INTERVAL_MAP: Record<string, string> = {
    "1m": "1m",
    "5m": "5m",
    "15m": "15m",
    "1h": "1h",
    "4h": "4h",
    "1d": "1d",
  };

  const upstreamSymbol = SYMBOL_MAP[asset];
  const interval = INTERVAL_MAP[ts] ?? "1m";
  const limit = Math.min(Math.max(parseInt(limitParam, 10) || 500, 1), 1000);

  if (!upstreamSymbol) {
    return res.status(400).json({ message: "Unsupported asset" });
  }

  try {
    // Try Backpack first
    const bpBase = process.env.BACKPACK_API_BASE || "https://api.backpack.exchange";
    const bpUrl = `${bpBase}/api/v1/candles?symbol=${encodeURIComponent(upstreamSymbol)}&interval=${encodeURIComponent(interval)}&limit=${limit}`;

    let response = await fetch(bpUrl, { headers: { "accept": "application/json" } });
    if (!response.ok) {
      // Fallback to Binance if Backpack fails
      const binanceSymbol = asset; // already like BTCUSDT, ETHUSDT, SOLUSDT
      const binanceInterval = interval; // compatible intervals
      const binanceUrl = `https://api.binance.com/api/v3/klines?symbol=${encodeURIComponent(binanceSymbol)}&interval=${encodeURIComponent(binanceInterval)}&limit=${limit}`;
      response = await fetch(binanceUrl, { headers: { "accept": "application/json" } });
      if (!response.ok) {
        return res.status(response.status).json({ message: "Upstream error", status: response.status });
      }

      const binanceJson: any = await response.json();
      const bRows: any[] = Array.isArray(binanceJson) ? binanceJson : [];

      const bCandles = bRows.map((row: any[]) => {
        // Binance: [open time, open, high, low, close, volume, close time, ...]
        const openTime = row[0];
        const open = row[1];
        const high = row[2];
        const low = row[3];
        const close = row[4];
        return {
          time: typeof openTime === "number" && openTime > 1e12 ? Math.floor(openTime / 1000) : Math.floor(Number(openTime) / 1000),
          open: Number(open),
          high: Number(high),
          low: Number(low),
          close: Number(close),
        };
      }).filter((c: any) => Number.isFinite(c?.open) && Number.isFinite(c?.high) && Number.isFinite(c?.low) && Number.isFinite(c?.close));

      return res.json(bCandles);
    }

    const json: any = await response.json();
    const rows: any[] = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];

    const candles = rows.map((row: any) => {
      if (Array.isArray(row)) {
        const [time, open, high, low, close] = row;
        return {
          time: typeof time === "number" && time > 1e12 ? Math.floor(time / 1000) : time,
          open: Number(open),
          high: Number(high),
          low: Number(low),
          close: Number(close),
        };
      }
      const t = row.time ?? row.t ?? row.timestamp ?? row.startTime;
      const o = row.open ?? row.o;
      const h = row.high ?? row.h;
      const l = row.low ?? row.l;
      const c = row.close ?? row.c;
      return {
        time: typeof t === "number" && t > 1e12 ? Math.floor(t / 1000) : t,
        open: Number(o),
        high: Number(h),
        low: Number(l),
        close: Number(c),
      };
    }).filter((c: any) => Number.isFinite(c?.open) && Number.isFinite(c?.high) && Number.isFinite(c?.low) && Number.isFinite(c?.close));

    return res.json(candles);
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch candles",
      error: (err as Error).message,
    });
  }
};