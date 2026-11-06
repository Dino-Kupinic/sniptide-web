import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { BlogShell } from "@/components/blog/blog-shell"
import { blogMdxComponents } from "@/components/blog/mdx"
import { PostFooter } from "@/components/blog/post-footer"
import {
  blogPath,
  feedPath,
  formatPostDate,
  postAuthor,
  postMarkdownPath,
  postPath,
  postStructuredData,
  readingMinutes,
} from "@/lib/blog"
import { adjacentPosts, getPost, getPosts } from "@/lib/blog-source"
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

  return (
    <BlogShell>
      <script
        type="application/ld+json"
        // Built from the post's frontmatter and escaped by serializeJsonLd.
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be raw script text.
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(postStructuredData(post)) }}
      />
      <article className="mx-auto w-full max-w-[1440px] px-5 pt-10 pb-20 md:px-10 md:pt-16 md:pb-28 lg:px-30">
        <div className="mx-auto max-w-[42.5rem]">
          <a
            href={blogPath}
            className="text-sm leading-5 font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Blog
          </a>
          <h1 className="mt-4 font-heading text-[34px] leading-10 font-medium tracking-[-0.03em] text-balance md:text-5xl md:leading-[3.5rem]">
            {post.title}
          </h1>
          <p className="mt-5 text-lg leading-7 text-muted-foreground">{post.description}</p>
          <div className="mt-8 flex items-center gap-3 border-b pb-8">
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
              <p className="text-muted-foreground tabular-nums">
                <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                <span aria-hidden="true"> · </span>
                {minutes} min read
                {post.draft && <span className="text-highlight"> · Draft</span>}
              </p>
            </div>
          </div>

          <div className="blog-prose mt-10">
            <Body components={blogMdxComponents} />
          </div>

          <PostFooter post={post} newer={newer} older={older} />
        </div>
      </article>
    </BlogShell>
  )
}
