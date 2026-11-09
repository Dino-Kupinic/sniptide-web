# Agents and search engines

`/llms.txt` and `/llms-full.txt` ([llmstxt.org](https://llmstxt.org)) describe Sniptide for AI
agents. Both are built from `lib/llms.ts`, so edit that file; they are real routes here, so the
share-link fallback never proxies them to the app. The home page also carries JSON-LD
(`Organization`, `WebSite`, `SoftwareApplication`) from `lib/structured-data.ts`. Shared product
facts live in `lib/site.ts`.

Documentation lives at https://docs.sniptide.com. Legacy `/docs`, `/docs/mcp`, and
`/docs/auth` paths redirect to the canonical guides. `lib/agent-docs.ts` owns discovery links
and MCP metadata; `/auth.md` is a short authentication index.

`/.well-known/mcp.json` advertises the remote server and links its server card at
`/.well-known/mcp/server-card.json`. The discovery records describe OAuth with a personal bearer token alternative and
link to the canonical guides. The public documentation MCP at `/api/mcp`, A2A agent at
`/api/a2a`, and conversational search at `/ask` return lightweight documentation indexes.
The llms files and robots.txt point to canonical documentation. About and contact pages
remain in the sitemap; redirected documentation pages do not.

`/api/status` reports whether the app's `/api/health` answers, cached for a minute, and the
footer's status line reads it.

The server card follows the [experimental MCP Server Card schema](https://github.com/modelcontextprotocol/ext-server-card).
Its required `$schema` URL currently returns 404, so validate against that repository's generated
`schema.json`, using `$defs.ServerCard`. The extension may change before it becomes part of MCP.

With a local server running on port 3193, check the rendered routes and discovery chain:

```bash
bun run check:agents
```

After deployment, run `bun run check:agents https://sniptide.com` before requesting a fresh Ora
scan. The script checks response bodies, content types, canonical URLs, and local cross-links.


## Browser agent tools


When a browser exposes WebMCP, the site registers two read-only tools with canonical setup guide links and the product MCP endpoint. It prefers `document.modelContext` and falls back to `navigator.modelContext` for older hosts. Unsupported browsers and rejected registrations continue to render the site normally. These tools do not access account data or accept credentials. Registration ends when the site component unmounts; the navigator fallback also supports legacy `unregisterTool` hosts.
