FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.18.2 --activate

FROM base AS builder
WORKDIR /repo

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/auth/package.json ./packages/auth/
COPY packages/config/package.json ./packages/config/
COPY packages/db/package.json ./packages/db/
COPY packages/env/package.json ./packages/env/
COPY packages/ui/package.json ./packages/ui/
COPY apps/server/package.json ./apps/server/

RUN pnpm install --frozen-lockfile

COPY packages/ ./packages/
COPY apps/server/ ./apps/server/

RUN pnpm --filter=server build

RUN pnpm --filter=server deploy --prod /standalone

FROM node:22-alpine AS runner
WORKDIR /app

COPY --from=builder /standalone ./

EXPOSE 3000
CMD ["node", "dist/index.mjs"]
