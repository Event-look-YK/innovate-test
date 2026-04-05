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
COPY apps/web/package.json ./apps/web/

RUN pnpm install --frozen-lockfile

COPY packages/ ./packages/
COPY apps/web/ ./apps/web/

ARG VITE_SERVER_URL
ENV VITE_SERVER_URL=${VITE_SERVER_URL}

RUN pnpm --filter=web build
RUN pnpm --filter=web deploy --prod --legacy /standalone
RUN cp -r apps/web/dist /standalone/dist
RUN cp apps/web/server.mjs /standalone/server.mjs

FROM node:22-alpine AS runner
WORKDIR /app

COPY --from=builder /standalone ./

ENV PORT=3001
EXPOSE 3001

CMD ["node", "server.mjs"]
