FROM oven/bun:1.2.17 AS base
WORKDIR /app

# Copy workspace manifests
COPY package.json bun.lock turbo.json ./

# Copy shared packages and server app
COPY packages ./packages
COPY apps/server ./apps/server

# Install dependencies and generate Prisma client
RUN bun install
RUN cd packages/database && bunx prisma generate

EXPOSE 3001
CMD ["bun", "run", "apps/server/index.ts"]
