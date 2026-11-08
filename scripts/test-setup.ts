import { plugin } from "bun"
import { createMdxPlugin } from "fumadocs-mdx/bun"

// Tests import modules that read the blog posts through the fumadocs-mdx macro
// (lib/blog-source.ts), such as the sitemap. Next compiles the macro when the site builds; under
// `bun test` this plugin does the same.
await plugin(
  createMdxPlugin({ macro: { include: ["lib/blog-source.ts", "lib/template-source.ts"] } }),
)
