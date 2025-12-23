FROM oven/bun:1.2.17 AS base
WORKDIR /app

# Copy workspace manifests
COPY package.json bun.lock turbo.json ./

# Copy shared packages and db_worker app
COPY packages ./packages
COPY apps/db_worker ./apps/db_worker

# Install dependencies and generate Prisma client
RUN bun install
RUN cd packages/database && bunx prisma generate

CMD ["bun", "run", "apps/db_worker/src/index.ts"]
