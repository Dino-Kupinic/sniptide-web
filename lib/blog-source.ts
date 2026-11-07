import { applyMdxPreset } from "fumadocs-mdx/config"
import { defineCollections } from "fumadocs-mdx/macro"
import { type PostMeta, postSchema, publishedPosts, slugFromPath } from "@/lib/blog"
import { codeTheme } from "@/lib/code-theme"

// The posts in content/blog, compiled by fumadocs-mdx when the site builds (next.config.ts). Each
// entry carries its frontmatter, the compiled body and its Markdown for the .md twin.
const collection = defineCollections({
  type: "doc",
  dir: "content/blog",
  schema: postSchema,
  postprocess: { includeProcessedMarkdown: true },
  // Fumadocs' defaults with the app's code colours in place of GitHub's themes.
  mdxOptions: applyMdxPreset({
    rehypeCodeOptions: { themes: { light: codeTheme, dark: codeTheme } },
  }),
})

type Entry = (typeof collection.entries)[number]
export type Post = PostMeta & { entry: Entry }

const allPosts: Post[] = collection.entries.map((entry) => ({
  ...postSchema.parse(entry),
  slug: slugFromPath(entry.info.path),
  entry,
}))

// Published posts, newest first. Drafts join them in development.
export function getPosts(): Post[] {
  return publishedPosts(allPosts)
}

// Every post, drafts included, for checks that look at the files rather than the site.
export function getAllPosts(): Post[] {
  return publishedPosts(allPosts, true)
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((post) => post.slug === slug)
}

// The posts before and after one, for the links at the end of a post.
export function adjacentPosts(slug: string) {
  const posts = getPosts()
  const index = posts.findIndex((post) => post.slug === slug)
  return { newer: index > 0 ? posts[index - 1] : undefined, older: posts[index + 1] }
}
