# Acme Dashboard

<!-- Example repository. Replace the commands and paths with ones you verified. -->

A Next.js app where customers track their orders. It reads and writes a Postgres database
through Drizzle and ships as a Docker image.

## Commands

Run commands from the repository root with the Node version in `.nvmrc` and pnpm. On a
fresh clone, copy `.env.example` to `.env`, fill the required values and start the local
database with `docker compose up -d --wait db`.

- Install dependencies with `pnpm install --frozen-lockfile`.
- Dev server: `pnpm dev`, then open http://localhost:3000
- All tests: `pnpm test`
- One test file: `pnpm test lib/orders.test.ts`
- Lint and types: `pnpm lint && pnpm typecheck`
- Apply migrations to the local database with `pnpm db:migrate`. For schema changes, run
  `pnpm db:generate` first and review the SQL.

Run lint, types and the relevant tests before opening a pull request. Report any check you could not run.

## Project layout

- `app/`: routes and pages (App Router)
- `components/`: shared React components; `components/ui` holds the design system
- `lib/`: server code, database queries and helpers
- `db/schema.ts`: the database schema, changed only through a migration

## Code style

- TypeScript in strict mode. Use `unknown` and narrow it instead of `any`.
- Use named exports for shared components and keep Next.js route exports in the framework's required form.
- Keep database access in server-only modules under `lib/`. Client components use server actions or API routes.
- Reuse the components in `components/ui` before writing new markup.

## Workflow

- Make the smallest change that solves the task, and leave unrelated code as it is.
- Add or update a test with every change in behavior.
- Write commit messages as Conventional Commits, such as `fix(orders): handle an empty cart`.
- Ask before you add a dependency.

## Data and secrets

- Add a new migration for changes to a released schema.
- Keep secrets in the local environment. Commit only the placeholder values in `.env.example`.
