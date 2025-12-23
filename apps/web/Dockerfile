FROM oven/bun:1.2.17 AS base
WORKDIR /app

# Copy workspace manifests
COPY package.json bun.lock turbo.json ./

# Copy shared packages and web app
COPY packages ./packages
COPY apps/web ./apps/web

# Install dependencies and generate Prisma client
RUN bun install
RUN cd packages/database && bunx prisma generate

# Build the Next.js app
RUN cd apps/web && bun run build

WORKDIR /app/apps/web
EXPOSE 3000
CMD ["bun", "run", "start"]
