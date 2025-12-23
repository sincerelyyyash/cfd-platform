FROM oven/bun:1.2.17 AS base
WORKDIR /app

# Copy workspace manifests
COPY package.json bun.lock turbo.json ./

# Copy shared packages and engine app
COPY packages ./packages
COPY apps/engine ./apps/engine

# Install dependencies and generate Prisma client
RUN bun install
RUN cd packages/database && bunx prisma generate

CMD ["bun", "run", "apps/engine/src/index.ts"]
