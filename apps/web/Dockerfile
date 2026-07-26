# Build from the monorepo root: docker build -f apps/web/Dockerfile .
#
# Adapted from the backgroundgone/viraltiktokslideshows web Dockerfiles —
# same stack and monorepo shape (pnpm workspaces with the `catalog:`
# protocol, Next.js web app depending only on @personaboard/env +
# @personaboard/ui + @personaboard/config, no database dependency).
#
# Unlike those repos, this app uses Next's `output: "export"` (static
# export), so the runtime stage is nginx serving apps/web/out — there is no
# Node server in production.

# ---- Builder ----
FROM node:22-slim AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.4.0 --activate

# Copy workspace manifests + lockfile first for layer caching.
# packages/db is intentionally excluded — the web app has no database
# dependency (only @personaboard/env, @personaboard/ui, @personaboard/config).
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc ./
COPY packages/config/package.json packages/config/
COPY packages/env/package.json packages/env/
COPY packages/ui/package.json packages/ui/
COPY apps/web/package.json apps/web/

# NEXT_PUBLIC_SERVER_URL (packages/env/src/web.ts) is baked into the client
# bundle at build time — setting it as a *runtime* env var has no effect, the
# bundle already shipped with whatever was present at build time. It MUST be
# passed as a build arg:
#   docker build -f apps/web/Dockerfile \
#     --build-arg NEXT_PUBLIC_SERVER_URL=https://api.example.com -t pb-web .
ARG NEXT_PUBLIC_SERVER_URL=http://localhost:3000
ENV NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL} \
    NEXT_TELEMETRY_DISABLED=1

RUN pnpm install --frozen-lockfile

# Source after install for better layer caching.
COPY packages/config/ packages/config/
COPY packages/env/ packages/env/
COPY packages/ui/ packages/ui/
COPY apps/web/ apps/web/

RUN pnpm --filter web build

# ---- Runner: static files only, served by nginx ----
FROM nginx:alpine AS runner

COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/web/out /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://localhost/ || exit 1
