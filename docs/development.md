# Development

This page covers running the marketing site locally, the shared UI package and the checks CI runs.

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


## Checks

```bash
bunx biome ci .
bun run typecheck
bun run test
bun run build
```
