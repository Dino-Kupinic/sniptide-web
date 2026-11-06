import type { Metadata } from "next"
import { Suspense } from "react"
import { BlogIndex, type IndexPost } from "@/components/blog/blog-index"
import { BlogShell } from "@/components/blog/blog-shell"
import { PostList } from "@/components/blog/post-list"
import { SubscribeMenu } from "@/components/blog/subscribe-menu"
import { blogPath, feeds } from "@/lib/blog"
import { getPosts } from "@/lib/blog-source"
import { links } from "@/lib/links"

export const metadata: Metadata = {
  alternates: {
    canonical: blogPath,
    types: Object.fromEntries(
      feeds.map((feed) => [
        feed.type,
        [{ url: feed.path, title: `Sniptide blog (${feed.label})` }],
      ]),
    ),
  },
  title: "Blog",
  description: "Product news and notes on building Sniptide, the pastebin for coding agents.",
}

export const revalidate = 3600

// A post's text for search: its Markdown without code, markup or heading ids.
function plainText(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\[#[^\]]*\]/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#*_`>|[\]()-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

export default async function Page() {
  const posts: IndexPost[] = await Promise.all(
    getPosts().map(async ({ entry, ...post }) => ({
      ...post,
      searchText: plainText(await entry.getText("processed")),
    })),
  )

  return (
    <BlogShell>
      <div className="mx-auto w-full max-w-[1440px] px-5 pt-12 pb-20 md:px-10 md:pt-20 md:pb-28 lg:px-30">
        <div className="flex items-end justify-between gap-4 pb-8 md:pb-10">
          <h1 className="font-heading text-[34px] leading-9.5 font-medium tracking-[-0.03em] md:text-5xl md:leading-13">
            Blog
          </h1>
          <SubscribeMenu />
        </div>
        {posts.length > 0 ? (
          // The filters read the URL, so the list without them renders until the page hydrates.
          <Suspense fallback={<PostList posts={posts} />}>
            <BlogIndex posts={posts} />
          </Suspense>
        ) : (
          <p className="max-w-[62ch] border-y py-7 text-base leading-6.5 text-muted-foreground">
            The first posts are on their way. Until then, the{" "}
            <a href={`${links.github}/releases`} className="text-link underline underline-offset-4">
              release notes on GitHub
            </a>{" "}
            list what changed in each version.
          </p>
        )}
      </div>
    </BlogShell>
  )
}
