# Acme Dashboard

A Next.js app where customers track their orders. It reads and writes a Postgres database
through Drizzle and ships as a Docker image.

## Commands

- Install: `pnpm install`
- Dev server: `pnpm dev`, then open http://localhost:3000
- All tests: `pnpm test`
- One test file: `pnpm test lib/orders.test.ts`
- Lint and types: `pnpm lint && pnpm typecheck`
- New migration: `pnpm db:generate`, then `pnpm db:migrate`

Run the tests and the type check before you call a change done.

## Project layout

- `app/`: routes and pages (App Router)
- `components/`: shared React components; `components/ui` holds the design system
- `lib/`: server code, database queries and helpers
- `db/schema.ts`: the database schema, changed only through a migration

## Code style

- TypeScript in strict mode. Use `unknown` and narrow it instead of `any`.
- Named exports only.
- Components never query the database. Server code lives in `lib/`.
- Reuse the components in `components/ui` before writing new markup.

## Workflow

- Make the smallest change that solves the task, and leave unrelated code as it is.
- Add or update a test with every change in behavior.
- Write commit messages as Conventional Commits, such as `fix(orders): handle an empty cart`.
- Ask before you add a dependency.

## Never

- Edit a migration in `db/migrations/` that is already merged.
- Commit `.env` files or print secrets in logs.
