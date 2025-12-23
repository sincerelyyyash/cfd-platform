FROM oven/bun:1.2.17 AS base
WORKDIR /app

# Copy workspace manifests
COPY package.json bun.lock turbo.json ./

# Copy shared packages and price_poller app
COPY packages ./packages
COPY apps/price_poller ./apps/price_poller

# Install dependencies and generate Prisma client
RUN bun install
RUN cd packages/database && bunx prisma generate

EXPOSE 3002
CMD ["bun", "run", "apps/price_poller/index.ts"]
