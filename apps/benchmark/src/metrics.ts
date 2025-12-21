export type SamplePhase = "open" | "close" | "list";

export type SampleRecord = {
  phase: SamplePhase;
  latencyMs: number;
  status: number;
  ok: boolean;
  error?: string;
};

export type MetricsSummary = {
  total: number;
  successes: number;
  failures: number;
  avgLatency: number;
  minLatency: number;
  maxLatency: number;
  p50: number;
  p95: number;
  p99: number;
  byStatus: Record<string, number>;
};

const percentile = (values: number[], p: number) => {
  if (!values.length) {
    return 0;
  }
  const sorted = [...values].sort((a, b) => a - b);
  const rank = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(rank);
  const upper = Math.ceil(rank);
  if (lower === upper) {
    return sorted[lower];
  }
  const weight = rank - lower;
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
};

const summarizePhase = (records: SampleRecord[]): MetricsSummary => {
  if (!records.length) {
    return {
      total: 0,
      successes: 0,
      failures: 0,
      avgLatency: 0,
      minLatency: 0,
      maxLatency: 0,
      p50: 0,
      p95: 0,
      p99: 0,
      byStatus: {},
    };
  }

  let latencySum = 0;
  let minLatency = Number.POSITIVE_INFINITY;
  let maxLatency = 0;
  const statusCounts: Record<string, number> = {};
  for (const record of records) {
    latencySum += record.latencyMs;
    minLatency = Math.min(minLatency, record.latencyMs);
    maxLatency = Math.max(maxLatency, record.latencyMs);
    statusCounts[record.status] = (statusCounts[record.status] ?? 0) + 1;
  }

  const latencies = records.map((record) => record.latencyMs);
  const successes = records.filter((record) => record.ok).length;
  const failures = records.length - successes;

  return {
    total: records.length,
    successes,
    failures,
    avgLatency: latencySum / records.length,
    minLatency,
    maxLatency,
    p50: percentile(latencies, 50),
    p95: percentile(latencies, 95),
    p99: percentile(latencies, 99),
    byStatus: statusCounts,
  };
};

export const createMetricsCollector = () => {
  const records: SampleRecord[] = [];

  const push = (record: SampleRecord) => {
    records.push(record);
  };

  const summary = () => {
    const phases: Record<SamplePhase, SampleRecord[]> = {
      open: [],
      close: [],
      list: [],
    };
    for (const record of records) {
      phases[record.phase].push(record);
    }
    return {
      open: summarizePhase(phases.open),
      close: summarizePhase(phases.close),
      list: summarizePhase(phases.list),
      combined: summarizePhase(records),
    };
  };

  return { push, summary };
};

