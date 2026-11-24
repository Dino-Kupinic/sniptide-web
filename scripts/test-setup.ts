import { plugin } from "bun"
import { createMdxPlugin } from "fumadocs-mdx/bun"

// Tests import modules that read the blog posts through the fumadocs-mdx macro
// (lib/blog-source.ts), such as the sitemap. Next compiles the macro when the site builds; under
// `bun test` this plugin does the same.
await plugin(
  createMdxPlugin({ macro: { include: ["lib/blog-source.ts", "lib/template-source.ts"] } }),
)

// The changelog and the sitemap read GitHub releases. Tests get one fixed release instead of a
// network request. `bun run indexnow` preloads this file too, and keeps the real module.
if (process.env.NODE_ENV === "test") {
  const { mock } = await import("bun:test")
  mock.module("@/lib/changelog-source", () => ({
    getChangelog: async () => [{ date: "2026-11-20T09:00:00Z" }],
    getAnnouncement: async () => null,
  }))
}
