import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { BlogShell } from "@/components/blog/blog-shell"
import { blogMdxComponents } from "@/components/blog/mdx"
import { PostFooter } from "@/components/blog/post-footer"
import { ShareButtons } from "@/components/blog/share"
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
  const hasToc = post.entry.toc.filter((item) => item.depth === 2 || item.depth === 3).length >= 2

  return (
    <BlogShell cta>
      <script
        type="application/ld+json"
        // Built from the post's frontmatter and escaped by serializeJsonLd.
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be raw script text.
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(postStructuredData(post)) }}
      />
      {/* On wide screens the text keeps its 35rem column in the middle and the table of contents
          takes the right-hand track; the left track balances it. */}
      <article className="mx-auto grid w-full max-w-[1440px] px-5 pt-10 pb-12 md:px-10 md:pt-16 md:pb-16 lg:px-30 xl:grid-cols-[minmax(0,1fr)_35rem_minmax(0,1fr)] xl:gap-x-16">
        <header className="mx-auto w-full max-w-[35rem] xl:col-start-2">
          <nav
            aria-label="Breadcrumb"
            className="text-sm leading-5 font-medium text-muted-foreground"
          >
            <a href={blogPath} className="transition-colors hover:text-foreground">
              Blog
            </a>
            <span aria-hidden="true"> / </span>
            <a
              href={`${blogPath}?category=${post.category}`}
              className="transition-colors hover:text-foreground"
            >
              {categories[post.category]}
            </a>
          </nav>
          <h1 className="mt-4 font-heading text-[34px] leading-10 font-medium tracking-[-0.03em] text-balance md:text-5xl md:leading-[3.5rem]">
            {post.title}
          </h1>
          <p className="mt-5 text-lg leading-7 text-pretty text-muted-foreground md:text-xl md:leading-8">
            {post.description}
          </p>
          <div className="mt-8 flex items-center gap-3 border-b pb-8">
            <Image
              src={author.avatar}
              alt=""
              width={40}
              height={40}
              className="size-10 shrink-0 rounded-md"
            />
            <div className="flex min-w-0 flex-1 flex-col text-sm leading-5">
              <a href={author.url} className="font-medium hover:underline">
                {author.name}
              </a>
              <p className="text-muted-foreground tabular-nums">
                <time dateTime={post.date} className="whitespace-nowrap">
                  {formatPostDate(post.date)}
                </time>
                <span aria-hidden="true"> · </span>
                <span className="whitespace-nowrap">{minutes} min read</span>
                {post.draft && <span className="text-highlight"> · Draft</span>}
              </p>
            </div>
            <ShareButtons title={post.title} url={`${siteUrl}${postPath(post.slug)}`} />
          </div>
        </header>

        {hasToc && (
          <aside className="mx-auto mt-8 w-full max-w-[35rem] xl:col-start-3 xl:row-span-2 xl:row-start-2 xl:mx-0 xl:mt-10 xl:max-w-60">
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
    </BlogShell>
  )
}
