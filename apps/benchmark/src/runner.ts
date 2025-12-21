import { performance } from "node:perf_hooks";
import type { BenchmarkConfig } from "./config";
import type { AuthContext } from "./auth";
import { bearerHeaders } from "./auth";
import { jsonRequest } from "./http";
import { createOrderFactory, buildClosePayload } from "./orders";
import { createMetricsCollector, type MetricsSummary } from "./metrics";
import { joinPath, sleep } from "./utils";

export type BenchmarkReport = {
  timestamp: string;
  durationMs: number;
  throughput: number;
  openedOrders: number;
  closedOrders: number;
  errors: string[];
  metrics: {
    open: MetricsSummary;
    close: MetricsSummary;
    list: MetricsSummary;
    combined: MetricsSummary;
  };
};

type ProgressUpdate = {
  completed: number;
  total: number;
};

type ProgressCallback = (update: ProgressUpdate) => void;

const createProgress = (total: number, callback?: ProgressCallback) => {
  let completed = 0;
  return () => {
    completed += 1;
    callback?.({ completed, total });
  };
};

const extractOrderId = (data: any) => {
  if (!data) {
    return undefined;
  }
  if (typeof data === "string") {
    return data;
  }
  if (data.orderId) {
    return data.orderId;
  }
  if (data.data?.orderId) {
    return data.data.orderId;
  }
  if (Array.isArray(data.data) && data.data[0]?.orderId) {
    return data.data[0].orderId;
  }
  return undefined;
};

type RequestPhase = "open" | "close" | "list";

const performRequest = async <T>(
  phase: RequestPhase,
  url: string,
  config: BenchmarkConfig,
  headers: Record<string, string>,
  body?: unknown
) => {
  const started = performance.now();
  try {
    const response = await jsonRequest<T>({
      url,
      method: body ? "POST" : "GET",
      headers,
      body,
      timeoutMs: config.requestTimeoutMs,
    });
    const latency = performance.now() - started;
    return { response, latency };
  } catch (err) {
    const latency = performance.now() - started;
    throw { err: err as Error, latency };
  }
};

export const runBenchmark = async (
  config: BenchmarkConfig,
  auth: AuthContext,
  onProgress?: ProgressCallback
): Promise<BenchmarkReport> => {
  const headers = { ...bearerHeaders(auth.token) };
  const metrics = createMetricsCollector();
  const orderFactory = createOrderFactory(config);
  const progress = createProgress(config.totalOrders, onProgress);
  const openedOrderIds: string[] = [];
  const errors: string[] = [];
  let failed = 0;
  let succeeded = 0;
  let closedOrders = 0;
  let index = 0;

  const closeOrder = async (orderId: string) => {
    try {
      const { response, latency } = await performRequest<any>(
        "close",
        joinPath(config.baseUrl, "/trade/close"),
        config,
        headers,
        buildClosePayload(orderId)
      );
      metrics.push({
        phase: "close",
        latencyMs: latency,
        status: response.status,
        ok: response.ok,
        error: response.ok ? undefined : (response.data as any)?.message,
      });
    } catch (cause) {
      const { err, latency } = cause as { err: Error; latency: number };
      metrics.push({
        phase: "close",
        latencyMs: latency,
        status: 0,
        ok: false,
        error: err.message,
      });
      errors.push(err.message);
    }
  };

  const openOrder = async () => {
    const orderPayload = orderFactory();
    try {
      const { response, latency } = await performRequest<any>(
        "open",
        joinPath(config.baseUrl, "/trade/create"),
        config,
        headers,
        orderPayload
      );
      metrics.push({
        phase: "open",
        latencyMs: latency,
        status: response.status,
        ok: response.ok,
        error: response.ok ? undefined : (response.data as any)?.message,
      });
      if (response.ok) {
        const orderId = extractOrderId(response.data);
        succeeded += 1;
        if (config.shouldCloseOrders && config.closeAfterOpen) {
          if (orderId) {
            await closeOrder(orderId);
            closedOrders += 1;
          }
        } else if (orderId) {
          openedOrderIds.push(orderId);
        }
      } else {
        failed += 1;
        errors.push((response.data as any)?.message ?? "Unknown error");
      }
    } catch (cause) {
      const { err, latency } = cause as { err: Error; latency: number };
      failed += 1;
      errors.push(err.message);
      metrics.push({
        phase: "open",
        latencyMs: latency,
        status: 0,
        ok: false,
        error: err.message,
      });
    } finally {
      progress();
    }
    await sleep(config.orderSpacingMs);
  };

  const workers = Array.from({ length: config.concurrency }, async () => {
    while (true) {
      const current = index;
      index += 1;
      if (current >= config.totalOrders) {
        return;
      }
      await openOrder();
      if (failed > config.maxFailures) {
        return;
      }
    }
  });

  const startedAt = performance.now();
  await Promise.all(workers);
  const openDuration = performance.now() - startedAt;

  if (config.shouldCloseOrders && openedOrderIds.length && !config.closeAfterOpen) {
    let pointer = 0;
    const closeWorkers = Array.from(
      { length: Math.min(config.concurrency, openedOrderIds.length) },
      async () => {
        while (true) {
          const current = pointer;
          pointer += 1;
          if (current >= openedOrderIds.length) {
            return;
          }
          await closeOrder(openedOrderIds[current]);
          closedOrders += 1;
        }
      }
    );
    await Promise.all(closeWorkers);
  }

  if (config.shouldListOrders) {
    try {
      const { response, latency } = await performRequest<any>(
        "list",
        joinPath(config.baseUrl, "/trade/open"),
        config,
        headers
      );
      metrics.push({
        phase: "list",
        latencyMs: latency,
        status: response.status,
        ok: response.ok,
        error: response.ok ? undefined : (response.data as any)?.message,
      });
    } catch (cause) {
      const { err, latency } = cause as { err: Error; latency: number };
      metrics.push({
        phase: "list",
        latencyMs: latency,
        status: 0,
        ok: false,
        error: err.message,
      });
      errors.push(err.message);
    }
  }

  const durationMs = performance.now() - startedAt;
  const throughput = openDuration > 0 ? succeeded / (openDuration / 1000) : 0;

  return {
    timestamp: new Date().toISOString(),
    durationMs,
    throughput,
    openedOrders: openedOrderIds.length,
    closedOrders,
    errors,
    metrics: metrics.summary(),
  };
};

