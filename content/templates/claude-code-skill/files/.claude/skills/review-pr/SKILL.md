---
name: review-pr
description: Review the current branch or a pull request against this project's checklist. Use when asked to review changes, check a PR or look over a diff before merging.
---

# Review a pull request

Review the changes against the main branch and report problems, ordered by how much they matter.

## Steps

1. Read the diff: `git diff main...HEAD`. For a pull request number, run `gh pr diff <number>`.
2. Read each changed file in full where the diff alone doesn't show the context.
3. Run the checks: `pnpm lint && pnpm typecheck && pnpm test`.
4. Go through [checklist.md](checklist.md) for every changed file.
5. Report your findings in the format below.

## Report format

For each finding, give the file and line, what is wrong, and a concrete fix:

- **Blocking**: bugs, security problems, failing checks, missing tests for new behavior.
- **Should fix**: unclear names, duplicated code, missing error handling.
- **Optional**: style and small improvements.

End with one line: ready to merge, or the number of blocking findings.
Don't change any code during a review unless asked to.
