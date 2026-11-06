import { RssIcon } from "lucide-react"
import type { Metadata } from "next"
import { Suspense } from "react"
import { BlogIndex, type IndexPost } from "@/components/blog/blog-index"
import { BlogShell } from "@/components/blog/blog-shell"
import { primaryButton, secondaryButton } from "@/components/blog/buttons"
import { LifeBackground } from "@/components/blog/life-background"
import { IndexFallback } from "@/components/blog/post-list"
import { SubscribeMenu } from "@/components/blog/subscribe-menu"
import { blogPath, feedPath, feeds, readingMinutes } from "@/lib/blog"
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
    getPosts().map(async ({ entry, ...post }) => {
      const markdown = await entry.getText("processed")
      return { ...post, minutes: readingMinutes(markdown), searchText: plainText(markdown) }
    }),
  )

  return (
    <BlogShell>
      <div className="relative isolate">
        {/* A faint Game of Life behind the title and the featured post, fading out above the cards. */}
        <LifeBackground className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[1100px] w-full opacity-[0.07] [mask-image:linear-gradient(to_bottom,black_0%,black_35%,transparent_80%)] dark:opacity-[0.12]" />
        <div className="mx-auto w-full max-w-[1440px] px-5 pt-12 pb-20 md:px-10 md:pt-20 md:pb-28 lg:px-30">
          <div className="flex items-end justify-between gap-4 pb-8 md:pb-10">
            <h1 className="font-heading text-[34px] leading-9.5 font-medium tracking-[-0.03em] md:text-5xl md:leading-13">
              Blog
            </h1>
            <SubscribeMenu />
          </div>
          {posts.length > 0 ? (
            // The filters read the URL, so the index without them renders until the page hydrates.
            <Suspense fallback={<IndexFallback posts={posts} />}>
              <BlogIndex posts={posts} />
            </Suspense>
          ) : (
            <section className="flex flex-col items-start gap-6 rounded-lg border bg-sidebar px-6 py-10 md:px-12 md:py-14">
              <div className="flex max-w-[34rem] flex-col gap-3">
                <h2 className="font-heading text-2xl leading-8 font-medium tracking-[-0.02em] text-balance md:text-[28px] md:leading-9">
                  The first posts are on their way
                </h2>
                <p className="text-base leading-6.5 text-muted-foreground">
                  Subscribe to read them when they land. The release notes cover each version until
                  then.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href={feedPath} className={primaryButton}>
                  <RssIcon className="size-4" />
                  Subscribe by RSS
                </a>
                <a href={`${links.github}/releases`} className={secondaryButton}>
                  Read the release notes
                </a>
              </div>
            </section>
          )}
        </div>
      </div>
    </BlogShell>
  )
}
