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

Coolify builds the `Dockerfile` from `main` (port `3000`, health check `GET /`) and serves it at
`https://sniptide.com`. The app runs separately at `https://app.sniptide.com`.

sniptide.com is shared with the app in two ways (`next.config.ts`):

- **Share links stay on sniptide.com.** Any path without a page here (`/k7Qe2x`, `/k7Qe2x/raw`,
  the app's `/_next/*` assets those pages load) is proxied to the app, so the address bar keeps
  sniptide.com. This site's own assets live under `/_site` so they never collide with the app's.
- **App pages redirect.** `/sign-in`, `/dashboard`, `/new`, `/settings`, … and `/api/auth/*` get a
  308 to the same path on app.sniptide.com. Add new app sections to `appPages` there.

The app needs `SHARE_URL=https://sniptide.com` so its dashboard copies sniptide.com links.

Build-time setting: `NEXT_PUBLIC_APP_URL`, where buttons, redirects and the proxy point. Defaults
to `https://app.sniptide.com`.

## Checks

```bash
bunx biome ci .
bun run typecheck
bun run build
```

## Contributing

Commits and PR titles follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`,
`fix:`, `docs:`, …), enforced by a git hook and a CI check. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[AGPL-3.0](LICENSE), like Sniptide itself.
