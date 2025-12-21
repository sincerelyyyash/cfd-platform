# Backend Benchmark Harness

This workspace provides a configurable load-test harness for the CFD backend stack (`apps/server`, `apps/engine`, `apps/price_poller`, `apps/db_worker`).

## Prerequisites

- All backend services running locally (Kafka, price poller, engine, db worker, API server).
- Ability to mint or reuse a session token (`EMAIL_TOKEN_SECRET` defaults to `email_secret`).
- Node 18+ / Bun per repository requirements.

## Usage

```bash
# From repo root
bun run benchmark:orders -- --baseUrl=http://localhost:8000/api/v1 --orders=250 --concurrency=25
```

### Common Flags

| Flag | Description | Default |
| --- | --- | --- |
| `--baseUrl` | Fully-qualified API base (`/api/v1`) | `http://localhost:8000/api/v1` |
| `--email` | Benchmark user email | `bench+<uuid>@example.com` |
| `--orders` | Total orders to attempt | `100` |
| `--concurrency` | Concurrent workers | `10` |
| `--assets` | Comma list of symbols (suffixes like USDT/USDC are auto-stripped) | `BTCUSDT,ETHUSDT,SOLUSDT` |
| `--closeOrders` | Close placed orders `true/false` | `true` |
| `--closeAfterOpen` | Close each successful order immediately | `true` |
| `--listOrders` | Fetch `/trade/open` after run | `false` |
| `--output` | Path to write JSON report | _(none)_ |

Environment overrides (`BENCHMARK_*`) mirror the flags; run `bunx tsx src/index.ts --help` for the full list.

