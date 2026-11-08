# AGENTS.md

## Project

Acme Dashboard is a Next.js app where customers track their orders. TypeScript throughout,
Postgres through Drizzle, deployed as a Docker image.

## Setup

- Install dependencies: `pnpm install`
- Copy the environment: `cp .env.example .env`
- Start Postgres: `docker compose up -d db`
- Run migrations: `pnpm db:migrate`
- Start the dev server: `pnpm dev`

## Checks

Run these before you finish a task. All of them must pass.

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`, or `pnpm test <path>` for one file

## Code style

- TypeScript strict mode, no `any`.
- Named exports. One component per file in `components/`.
- Database access only in `lib/db`. Pages and components call functions from there.
- Format with Prettier (`pnpm format`). Don't hand-format.

## Testing

- Put tests next to the code as `*.test.ts`.
- Add a test for every bug fix that fails without the fix.
- Tests that touch the database use the `withTestDb` helper from `lib/db/testing.ts`.

## Pull requests

- Title: Conventional Commits, such as `feat(orders): add CSV export`.
- Keep one change per pull request, and describe what you checked.
- Update `docs/` in the same pull request when behavior changes.

## Security

- Never commit `.env` or any key, token or password.
- Ask before you add a dependency or change CI.
