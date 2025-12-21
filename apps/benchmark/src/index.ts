import { writeFile } from "node:fs/promises";
import ora from "ora";
import { bold, cyan, green, red, yellow } from "colorette";
import { ensureAuthContext } from "./auth";
import { loadConfig, summarizeConfig } from "./config";
import { runBenchmark, type BenchmarkReport } from "./runner";

const formatNumber = (value: number, digits = 2) => Number(value.toFixed(digits));

const logMetrics = (label: string, metrics: BenchmarkReport["metrics"]["open"]) => {
  console.log(
    `${bold(label)} | total: ${metrics.total} | success: ${metrics.successes} | fail: ${metrics.failures} | avg: ${formatNumber(metrics.avgLatency)}ms | p95: ${formatNumber(metrics.p95)}ms | p99: ${formatNumber(metrics.p99)}ms`
  );
};

const main = async () => {
  const config = loadConfig();
  console.log(cyan("Benchmark configuration"));
  console.table(summarizeConfig(config));

  const authSpinner = ora("Bootstrapping benchmark user").start();
  try {
    const auth = await ensureAuthContext(config);
    authSpinner.succeed(`Authenticated as ${auth.email} (${auth.userId})`);

    const runSpinner = ora("Placing orders...").start();
    const result = await runBenchmark(config, auth, ({ completed, total }) => {
      runSpinner.text = `Placing orders (${completed}/${total})`;
    });
    runSpinner.succeed("Benchmark complete");

    console.log(bold("\nResults"));
    console.log(`Duration: ${formatNumber(result.durationMs)}ms`);
    console.log(`Throughput: ${green(`${formatNumber(result.throughput)} ops/sec`)}`);
    console.log(`Opened orders: ${result.openedOrders}`);
    console.log(`Closed orders: ${result.closedOrders}`);

    logMetrics("Open", result.metrics.open);
    logMetrics("Close", result.metrics.close);
    logMetrics("List", result.metrics.list);
    logMetrics("Combined", result.metrics.combined);

    if (result.errors.length) {
      console.log(yellow("\nEncountered errors:"));
      for (const err of result.errors.slice(0, 10)) {
        console.log(` • ${err}`);
      }
      if (result.errors.length > 10) {
        console.log(` … and ${result.errors.length - 10} more`);
      }
    }

    if (config.outputPath) {
      await writeFile(config.outputPath, JSON.stringify({ config, result }, null, 2));
      console.log(cyan(`Report saved to ${config.outputPath}`));
    }
  } catch (err) {
    authSpinner.fail(red((err as Error).message));
    process.exitCode = 1;
  }
};

main().catch((err) => {
  console.error(red((err as Error).stack ?? (err as Error).message));
  process.exitCode = 1;
});

