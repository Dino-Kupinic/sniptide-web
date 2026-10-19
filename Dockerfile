# The Sniptide website as a standalone Next.js server, for Coolify (or any Docker host).
# Build: docker build -t sniptide-web .   Run: docker run -p 3000:3000 sniptide-web

# Node runs Next; Bun only installs packages and runs scripts (as in the app repo).
FROM node:24-slim AS build
COPY --from=oven/bun:1.3.13 /usr/local/bin/bun /usr/local/bin/bun
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
# NEXT_PUBLIC_* values are baked in at build time; Coolify passes build variables as build args.
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_POSTHOG_KEY
ARG NEXT_PUBLIC_POSTHOG_HOST
RUN bun run build

FROM node:24-slim AS run
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
# Standalone output leaves public/ out; it holds the web app manifest icons.
COPY --from=build --chown=node:node /app/public ./public
USER node

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "server.js"]
