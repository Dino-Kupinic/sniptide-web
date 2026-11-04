<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Code graph

Graphify is optional, and these steps apply when `graphify` is on your PATH. If `graphify-out/graph.json` is missing, run `graphify update .` once. It parses the code locally in a few seconds and sends nothing to a model.

When the graph exists, run `graphify query "<question>"` before a broad search to find the files that matter, then read those files before you change them. `graphify path "<A>" "<B>"` shows how two symbols connect, and `graphify explain "<symbol>"` describes one. Use grep directly when you are looking for exact text.

The graph can lag behind your branch, so the source files decide what is true. `graphify-out/` stays out of git.
