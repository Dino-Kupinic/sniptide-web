# Contributing

Setup and the checks live in the [README](README.md). This page covers how we write commits and
pull requests. The app ([Dino-Kupinic/sniptide](https://github.com/Dino-Kupinic/sniptide)) follows
the same rules.

## Conventional Commits

Sniptide uses [Conventional Commits](https://www.conventionalcommits.org/). Every commit message
and every pull request title looks like this:

```
<type>(<optional scope>): <description>
```

```
feat(landing): add a pricing section
fix(proxy): keep share links on sniptide.com
docs: explain NEXT_PUBLIC_APP_URL
refactor(proxy)!: move app pages under /app
```

- **type** is one of `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`,
  `chore` or `revert`. Use `feat` for something users can do that they couldn't before and `fix`
  for a bug; the rest don't change behavior.
- **scope** is optional. It names the part of the repo that changed, such as `landing`, `proxy`, `deps`
  or `docker`.
- **description** is imperative, lowercase at the start, and has no trailing period ("add",
  not "Added" or "Adds"). Keep the whole first line under 100 characters.
- A breaking change gets a `!` after the type or scope, and a `BREAKING CHANGE:` paragraph in the
  body that says what to do about it.

## How it's enforced

- A `commit-msg` hook ([husky](https://typicode.github.io/husky/) running
  [commitlint](https://commitlint.js.org/)) rejects a commit message that doesn't follow the
  format. `bun install` sets the hook up. The rules are in `commitlint.config.mjs`.
- Pull requests are squash-merged, so the PR title becomes the commit on `main`.
  `.github/workflows/pr-title.yml` checks the title and fails the PR if it isn't conventional.
  The commits inside a PR are squashed away, but the hook keeps them tidy while you work.

History from before this convention (everything up to the commit that introduced it) uses plain
sentences. It is left as it is: rewriting `main` would change every hash and break links, forks
and open PRs.

## Pull requests

- Keep a PR to one change, and say in the description what it does and why.
- Run the checks from the README before pushing; CI runs the same ones.
