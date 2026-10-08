# Sniptide website

The marketing site for [Sniptide](https://github.com/Dino-Kupinic/sniptide), served at
sniptide.com. It's a small Next.js 16 app that shares its components and theme with the app through
the [`@sniptide/ui`](https://www.npmjs.com/package/@sniptide/ui) package.

Self-hosted Sniptide instances don't need this repo: the app works on its own.

## Setup

```bash
bun install
cp .env.example .env.local   # points the sign-in and paste links at a local app
bun dev                      # http://localhost:3001
```

## Shared UI

Components (`Button`, `Logo`, `Stripes`, …) and the theme come from `@sniptide/ui`, which lives in
`packages/ui` of the app repo and is published to npm. To use a new component or style change,
release a new version there, then bump it here:

```bash
bun update @sniptide/ui
```

## Deploy

Coolify builds the `Dockerfile` from `main` (port `3000`, health check `GET /`).

sniptide.com is shared with the app. Route these paths to this container and everything else to the
app:

- `/` (exactly), the landing page
- `/_site/*`, this site's scripts, styles, fonts and images (`assetPrefix` in `next.config.ts`)

The app keeps `/sign-in`, `/dashboard`, share links (`/<slug>`) and its own `/_next/*`.

In Coolify that means giving this resource the domain `https://sniptide.com` with a Traefik rule
limited to those paths and a higher priority than the app, for example:

```
traefik.http.routers.sniptide-web.rule=Host(`sniptide.com`) && (Path(`/`) || PathPrefix(`/_site`))
traefik.http.routers.sniptide-web.priority=100
```

## Checks

```bash
bunx biome ci .
bun run typecheck
bun run build
```

## License

[AGPL-3.0](LICENSE), like Sniptide itself.
