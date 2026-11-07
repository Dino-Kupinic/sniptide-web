import { Badge } from "@sniptide/ui/components/badge"
import { ArrowLeftIcon } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { BlogShell } from "@/components/blog/blog-shell"
import { secondaryButton } from "@/components/blog/buttons"
import { LifeBackground } from "@/components/blog/life-background"
import { blogMdxComponents } from "@/components/blog/mdx"
import { PostActionsBar, PostRailActions } from "@/components/blog/post-actions"
import { PostFooter } from "@/components/blog/post-footer"
import { TableOfContents } from "@/components/blog/table-of-contents"
import {
  blogPath,
  categories,
  feedPath,
  formatPostDate,
  postAuthor,
  postMarkdownPath,
  postPath,
  postStructuredData,
  readingMinutes,
} from "@/lib/blog"
import { adjacentPosts, getPost, getPosts } from "@/lib/blog-source"
import { siteUrl } from "@/lib/site"
import { serializeJsonLd } from "@/lib/structured-data"

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false
export const revalidate = 3600

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug)
  if (!post) return {}
  const author = postAuthor(post)
  return {
    title: post.title,
    description: post.description,
    authors: [{ name: author.name, url: author.url }],
    keywords: post.tags,
    alternates: {
      canonical: postPath(post.slug),
      types: {
        "text/markdown": postMarkdownPath(post.slug),
        "application/rss+xml": [{ url: feedPath, title: "Sniptide blog" }],
      },
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: postPath(post.slug),
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: [author.name],
      tags: post.tags,
      ...(post.image ? { images: [post.image] } : {}),
    },
    twitter: {
      title: post.title,
      description: post.description,
      ...(post.image ? { images: [post.image] } : {}),
    },
    ...(post.draft ? { robots: { index: false } } : {}),
  }
}

export default async function Page({ params }: Props) {
  const post = getPost((await params).slug)
  if (!post) notFound()

  const author = postAuthor(post)
  const minutes = readingMinutes(await post.entry.getText("processed"))
  const Body = post.entry.body
  const { newer, older } = adjacentPosts(post.slug)
  // The contents list needs at least two sections to be worth showing.
  const actions = {
    title: post.title,
    url: `${siteUrl}${postPath(post.slug)}`,
    markdownPath: postMarkdownPath(post.slug),
    markdownUrl: `${siteUrl}${postMarkdownPath(post.slug)}`,
  }
  const hasToc = post.entry.toc.filter((item) => item.depth === 2 || item.depth === 3).length >= 2

  return (
    <BlogShell cta>
      <script
        type="application/ld+json"
        // Built from the post's frontmatter and escaped by serializeJsonLd.
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be raw script text.
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(postStructuredData(post)) }}
      />
      <div className="relative isolate">
        {/* The index's Game of Life, fainter, behind the top of the post. */}
        <LifeBackground className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] w-full opacity-[0.05] [mask-image:linear-gradient(to_bottom,black_0%,black_25%,transparent_90%)] dark:opacity-[0.09]" />
        {/* On wide screens the text keeps its 35rem column in the middle. The left rail holds the way
            back, the author and the actions, the right rail the contents, and both stay in view. */}
        <article className="mx-auto grid w-full max-w-[1440px] px-5 pt-8 pb-12 md:px-10 md:pt-14 md:pb-16 lg:px-30 xl:grid-cols-[minmax(0,1fr)_35rem_minmax(0,1fr)] xl:gap-x-16">
          <aside
            aria-label="About this post"
            className="hidden xl:col-start-1 xl:row-span-2 xl:row-start-1 xl:block xl:justify-self-end"
          >
            <div className="sticky top-24 flex w-56 flex-col gap-8">
              <BackLink />
              <div className="flex items-center gap-3">
                <Image
                  src={author.avatar}
                  alt=""
                  width={40}
                  height={40}
                  className="size-10 shrink-0 rounded-md"
                />
                <div className="flex min-w-0 flex-col text-sm leading-5">
                  <a href={author.url} className="font-medium hover:underline">
                    {author.name}
                  </a>
                  <span className="text-muted-foreground tabular-nums">{minutes} min read</span>
                </div>
              </div>
              <PostRailActions {...actions} />
            </div>
          </aside>

          <header className="mx-auto w-full max-w-[35rem] xl:col-start-2 xl:row-start-1">
            <div className="mb-8 xl:hidden">
              <BackLink />
            </div>
            <p className="flex items-center gap-3 text-sm leading-5 text-muted-foreground tabular-nums">
              <a href={`${blogPath}?category=${post.category}`}>
                <Badge variant="muted" className="rounded-md hover:text-foreground">
                  {categories[post.category]}
                </Badge>
              </a>
              <time dateTime={post.date}>{formatPostDate(post.date)}</time>
              {post.draft && <span className="text-highlight">Draft</span>}
            </p>
            <h1 className="mt-5 font-heading text-[34px] leading-10 font-medium tracking-[-0.03em] text-balance md:text-5xl md:leading-[3.5rem]">
              {post.title}
            </h1>
            <p className="mt-5 text-lg leading-7 text-pretty text-muted-foreground md:text-xl md:leading-8">
              {post.description}
            </p>
            <div className="mt-8 flex flex-col gap-5 border-b pb-8 xl:hidden">
              <div className="flex items-center gap-3">
                <Image
                  src={author.avatar}
                  alt=""
                  width={40}
                  height={40}
                  className="size-10 shrink-0 rounded-md"
                />
                <div className="flex min-w-0 flex-col text-sm leading-5">
                  <a href={author.url} className="font-medium hover:underline">
                    {author.name}
                  </a>
                  <span className="text-muted-foreground tabular-nums">{minutes} min read</span>
                </div>
              </div>
              <PostActionsBar {...actions} />
            </div>
            <div className="mt-10 hidden border-b xl:block" />
          </header>

          {hasToc && (
            <aside className="mx-auto mt-6 w-full max-w-[35rem] xl:col-start-3 xl:row-span-2 xl:row-start-1 xl:mx-0 xl:mt-0 xl:max-w-60">
              <div className="xl:sticky xl:top-24">
                <TableOfContents items={post.entry.toc} />
              </div>
            </aside>
          )}

          <div className="mx-auto w-full max-w-[35rem] min-w-0 xl:col-start-2 xl:row-start-2">
            <div className="blog-prose mt-10">
              <Body components={blogMdxComponents} />
            </div>
            <PostFooter post={post} newer={newer} older={older} />
          </div>
        </article>
      </div>
    </BlogShell>
  )
}

function BackLink() {
  return (
    <a href={blogPath} className={`${secondaryButton} self-start`}>
      <ArrowLeftIcon aria-hidden="true" className="size-4" />
      All posts
    </a>
  )
}
