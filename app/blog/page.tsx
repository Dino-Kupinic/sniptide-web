import type { Metadata } from "next"
import { BlogShell } from "@/components/blog/blog-shell"
import { PostList } from "@/components/blog/post-list"
import { blogPath, feedPath } from "@/lib/blog"
import { getPosts } from "@/lib/blog-source"
import { links } from "@/lib/links"

export const metadata: Metadata = {
  alternates: {
    canonical: blogPath,
    types: { "application/rss+xml": [{ url: feedPath, title: "Sniptide blog" }] },
  },
  title: "Blog",
  description: "Product news and notes on building Sniptide, the pastebin for coding agents.",
}

export const revalidate = 3600

export default function Page() {
  const posts = getPosts()
  return (
    <BlogShell>
      <div className="mx-auto w-full max-w-[1440px] px-5 pt-12 pb-20 md:px-10 md:pt-20 md:pb-28 lg:px-30">
        <div className="flex flex-col gap-4 pb-10 md:flex-row md:items-end md:justify-between md:pb-14">
          <h1 className="font-heading text-[34px] leading-9.5 font-medium tracking-[-0.03em] md:text-5xl md:leading-13">
            Blog
          </h1>
          <a
            href={feedPath}
            className="text-sm leading-5 font-medium text-link underline-offset-4 hover:underline"
          >
            Subscribe with RSS
          </a>
        </div>
        {posts.length > 0 ? (
          <PostList posts={posts} />
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
