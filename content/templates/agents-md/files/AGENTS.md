# AGENTS.md

<!-- Acme Dashboard is an example. Replace the commands and paths with ones you verified. -->

## Project

Acme Dashboard is a Next.js app where customers track their orders. TypeScript throughout,
Postgres through Drizzle, deployed as a Docker image.

## Setup

Run from the repository root with the Node version in `.nvmrc`, pnpm and Docker Compose v2.

- Install dependencies with `pnpm install --frozen-lockfile`.
- On a fresh clone, copy `.env.example` to `.env` and fill the required values.
- Start Postgres: `docker compose up -d --wait db`
- Run migrations: `pnpm db:migrate`
- Start the dev server with `pnpm dev` and open http://localhost:3000.
- Stop the dev server with Ctrl+C and stop Postgres with `docker compose stop db`.

## Checks

Run the checks below before opening a pull request. List any check you could not run and why.

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`, or `pnpm test <path>` for one file

## Code style

- TypeScript strict mode, no `any`.
- Use named exports in `components/` and default exports for Next.js route files that require them.
- Keep queries in server-only modules under `lib/db`. Client components call server actions or API routes.
- Format with Prettier (`pnpm format`). Don't hand-format.

## Testing

- Put tests next to the code as `*.test.ts`.
- Add a test for every bug fix that fails without the fix.
- Use `withTestDb` from `lib/db/testing.ts` for database tests. Set `TEST_DATABASE_URL` to a disposable local database.

## Pull requests

- Title: Conventional Commits, such as `feat(orders): add CSV export`.
- Keep one change per pull request, and describe what you checked.
- Update `docs/` in the same pull request when behavior changes.

## Security

- Never commit `.env` or any key, token or password.
- Ask before you add a dependency or change CI.
