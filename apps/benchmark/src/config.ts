import { randomUUID } from "node:crypto";
import { z } from "zod";

const argValue = (name: string, args: Record<string, string | boolean | undefined>) => {
  const value = args[name];
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  return value;
};

const parseArgs = () => {
  const args: Record<string, string | boolean> = {};
  for (const raw of process.argv.slice(2)) {
    if (!raw.startsWith("--")) {
      continue;
    }
    const trimmed = raw.slice(2);
    if (trimmed.includes("=")) {
      const [key, ...rest] = trimmed.split("=");
      args[key] = rest.join("=") || "";
      continue;
    }
    if (trimmed.startsWith("no-")) {
      args[trimmed.slice(3)] = false;
      continue;
    }
    args[trimmed] = true;
  }
  return args;
};

const numberOr = (value: string | undefined, fallback: number) => {
  if (value === undefined || value === "") {
    return fallback;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const booleanOr = (value: string | undefined, fallback: boolean) => {
  if (value === undefined) {
    return fallback;
  }
  if (value === "true" || value === "1") {
    return true;
  }
  if (value === "false" || value === "0") {
    return false;
  }
  return fallback;
};

const args = parseArgs();

const configSchema = z.object({
  baseUrl: z.string().url(),
  email: z.string().email(),
  emailTokenSecret: z.string().min(1),
  sessionToken: z.string().min(1).optional(),
  concurrency: z.number().int().min(1),
  totalOrders: z.number().int().min(1),
  assets: z.array(z.string().min(1)).min(1),
  shouldCloseOrders: z.boolean(),
  shouldListOrders: z.boolean(),
  closeAfterOpen: z.boolean(),
  warmup: z.boolean(),
  requestTimeoutMs: z.number().int().min(100),
  orderSpacingMs: z.number().int().min(0),
  minQuantity: z.number().positive(),
  maxQuantity: z.number().positive(),
  minLeverage: z.number().positive(),
  maxLeverage: z.number().positive(),
  maxFailures: z.number().int().min(0),
  seed: z.number().int().min(0),
  outputPath: z.string().optional(),
});

export type BenchmarkConfig = z.infer<typeof configSchema>;

export const loadConfig = (): BenchmarkConfig => {
  const defaultEmail = `bench+${randomUUID()}@example.com`;
  const baseUrl = argValue("baseUrl", args) ?? process.env.BENCHMARK_BASE_URL ?? "http://localhost:8000/api/v1";
  const email = argValue("email", args) ?? process.env.BENCHMARK_EMAIL ?? defaultEmail;
  const sessionToken = argValue("sessionToken", args) ?? process.env.BENCHMARK_SESSION_TOKEN;
  const emailSecret = argValue("emailTokenSecret", args) ?? process.env.BENCHMARK_EMAIL_TOKEN_SECRET ?? "email_secret";
  const concurrency = numberOr(argValue("concurrency", args) ?? process.env.BENCHMARK_CONCURRENCY, 10);
  const totalOrders = numberOr(argValue("orders", args) ?? process.env.BENCHMARK_ORDERS, 100);
  const assetsRaw = argValue("assets", args) ?? process.env.BENCHMARK_ASSETS ?? "BTCUSDT,ETHUSDT,SOLUSDT";
  const shouldCloseOrders = booleanOr(argValue("closeOrders", args) ?? process.env.BENCHMARK_CLOSE_ORDERS, true);
  const shouldListOrders = booleanOr(argValue("listOrders", args) ?? process.env.BENCHMARK_LIST_ORDERS, false);
  const closeAfterOpen = booleanOr(argValue("closeAfterOpen", args) ?? process.env.BENCHMARK_CLOSE_AFTER_OPEN, true);
  const warmup = booleanOr(argValue("warmup", args) ?? process.env.BENCHMARK_WARMUP, true);
  const requestTimeoutMs = numberOr(argValue("requestTimeoutMs", args) ?? process.env.BENCHMARK_REQUEST_TIMEOUT_MS, 10000);
  const orderSpacingMs = numberOr(argValue("orderSpacingMs", args) ?? process.env.BENCHMARK_ORDER_SPACING_MS, 0);
  const minQuantity = numberOr(argValue("minQuantity", args) ?? process.env.BENCHMARK_MIN_QUANTITY, 0.01);
  const maxQuantity = numberOr(argValue("maxQuantity", args) ?? process.env.BENCHMARK_MAX_QUANTITY, 0.5);
  const minLeverage = numberOr(argValue("minLeverage", args) ?? process.env.BENCHMARK_MIN_LEVERAGE, 2);
  const maxLeverage = numberOr(argValue("maxLeverage", args) ?? process.env.BENCHMARK_MAX_LEVERAGE, 10);
  const maxFailures = numberOr(argValue("maxFailures", args) ?? process.env.BENCHMARK_MAX_FAILURES, totalOrders);
  const seed = numberOr(argValue("seed", args) ?? process.env.BENCHMARK_SEED, Date.now());
  const outputPath = argValue("output", args) ?? process.env.BENCHMARK_OUTPUT_PATH;

  return configSchema.parse({
    baseUrl,
    email,
    emailTokenSecret: emailSecret,
    sessionToken: sessionToken || undefined,
    concurrency,
    totalOrders,
    assets: assetsRaw.split(",").map((value) => value.trim()).filter(Boolean),
    shouldCloseOrders,
    shouldListOrders,
    closeAfterOpen,
    warmup,
    requestTimeoutMs,
    orderSpacingMs,
    minQuantity,
    maxQuantity,
    minLeverage,
    maxLeverage,
    maxFailures,
    seed,
    outputPath: outputPath || undefined,
  });
};

export const summarizeConfig = (config: BenchmarkConfig) => ({
  baseUrl: config.baseUrl,
  email: config.email,
  concurrency: config.concurrency,
  totalOrders: config.totalOrders,
  assets: config.assets.join(", "),
  closeOrders: config.shouldCloseOrders,
  closeAfterOpen: config.closeAfterOpen,
  listOrders: config.shouldListOrders,
  warmup: config.warmup,
});

