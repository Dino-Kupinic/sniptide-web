import Image from "next/image"
import {
  categories,
  featuredPost,
  formatPostDate,
  type PostMeta,
  postAuthor,
  postPath,
} from "@/lib/blog"

export type ListPost = PostMeta & { minutes: number }

// The whole card or row is the link's hit target: the title's ::after covers its positioned parent.
const coverLink =
  "outline-none after:absolute after:inset-0 after:z-10 focus-visible:after:rounded-lg focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-link"

function Meta({ post }: { post: ListPost }) {
  return (
    <p className="flex flex-wrap gap-x-2 text-sm leading-5 text-muted-foreground tabular-nums">
      <span className="font-medium text-foreground">{categories[post.category]}</span>
      <span aria-hidden="true">·</span>
      <time dateTime={post.date}>{formatPostDate(post.date)}</time>
      {post.draft && <span className="text-highlight">Draft</span>}
    </p>
  )
}

function Byline({ post }: { post: ListPost }) {
  const author = postAuthor(post)
  return (
    <p className="flex items-center gap-2.5 text-sm leading-5 text-muted-foreground tabular-nums">
      <Image src={author.avatar} alt="" width={24} height={24} className="size-6 rounded-md" />
      <span className="text-foreground">{author.name}</span>
      <span aria-hidden="true">·</span>
      <span>{post.minutes} min read</span>
    </p>
  )
}

// The post at the top of the index: a cover from the product beside the title, the description and
// the byline. Without a cover it is the same panel with the text alone.
export function FeaturedPost({ post }: { post: ListPost }) {
  const cover = post.cover
  return (
    <article
      className={`group relative grid overflow-hidden rounded-lg border transition-colors hover:border-foreground/20 ${cover ? "lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]" : ""}`}
    >
      {cover && (
        <div className="relative aspect-[16/10] overflow-hidden border-b bg-sidebar lg:aspect-auto lg:min-h-[400px] lg:border-r lg:border-b-0">
          <Image
            src={cover}
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 60vw, 100vw"
            className={`object-cover object-left-top ${post.coverDark ? "dark:hidden" : ""}`}
          />
          {post.coverDark && (
            <Image
              src={post.coverDark}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="hidden object-cover object-left-top dark:block"
            />
          )}
        </div>
      )}
      <div
        className={`flex min-w-0 flex-col gap-4 p-6 md:p-8 ${cover ? "lg:justify-between lg:p-10" : "md:p-10"}`}
      >
        <div className="flex flex-col gap-4">
          <Meta post={post} />
          <h2 className="font-heading text-[28px] leading-[34px] font-medium tracking-[-0.02em] text-balance md:text-4xl md:leading-[44px]">
            <a
              href={postPath(post.slug)}
              className={`${coverLink} group-hover:text-link focus-visible:text-link`}
            >
              {post.title}
            </a>
          </h2>
          <p className="max-w-[62ch] text-base leading-6.5 text-muted-foreground md:text-lg md:leading-7">
            {post.description}
          </p>
        </div>
        <div className="pt-2">
          <Byline post={post} />
        </div>
      </div>
    </article>
  )
}

// Every other post: one quiet row each, newest first, with the category and date, the title and
// its one-sentence description.
export function PostList({ posts }: { posts: ListPost[] }) {
  return (
    <ol className="divide-y border-y">
      {posts.map((post) => (
        <li key={post.slug} className="group relative">
          <article className="grid gap-x-10 gap-y-1.5 py-6 md:grid-cols-[11rem_minmax(0,1fr)_auto] md:items-baseline">
            <p className="flex gap-2 text-sm leading-5 text-muted-foreground tabular-nums md:flex-col md:gap-0.5">
              <time dateTime={post.date}>{formatPostDate(post.date)}</time>
              <span aria-hidden="true" className="md:hidden">
                ·
              </span>
              <span>{categories[post.category]}</span>
            </p>
            <div className="flex min-w-0 flex-col gap-1.5">
              <h3 className="font-heading text-xl leading-7 font-medium tracking-[-0.02em]">
                <a
                  href={postPath(post.slug)}
                  className={`${coverLink} group-hover:text-link focus-visible:text-link`}
                >
                  {post.title}
                </a>
              </h3>
              <p className="max-w-[62ch] text-base leading-6.5 text-muted-foreground">
                {post.description}
              </p>
              {post.draft && <p className="text-sm leading-5 text-highlight">Draft</p>}
            </div>
            <p className="hidden text-sm leading-5 text-muted-foreground tabular-nums md:block">
              {post.minutes} min read
            </p>
          </article>
        </li>
      ))}
    </ol>
  )
}

// The index before any filter: the featured post on top and the rest as rows below it.
export function UnfilteredIndex({ posts }: { posts: ListPost[] }) {
  const featured = featuredPost(posts)
  const rest = posts.filter((post) => post !== featured)
  return (
    <div className="flex flex-col gap-14 md:gap-20">
      {featured && <FeaturedPost post={featured} />}
      {rest.length > 0 && (
        <section aria-labelledby="more-posts" className="flex flex-col gap-4">
          <h2
            id="more-posts"
            className="font-heading text-xl leading-7 font-medium tracking-[-0.02em]"
          >
            More posts
          </h2>
          <PostList posts={rest} />
        </section>
      )}
    </div>
  )
}
