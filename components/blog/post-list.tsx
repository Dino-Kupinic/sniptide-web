import { Badge } from "@sniptide/ui/components/badge"
import Image from "next/image"
import {
  categories,
  featuredPost,
  formatPostDate,
  type PostMeta,
  postAuthor,
  postImage,
  postPath,
} from "@/lib/blog"

export type ListPost = PostMeta & { minutes: number }

// How many cards the grid shows at first and adds each time the reader scrolls to its end.
export const pageSize = 9

// The whole card is the link's hit target: the title's ::after covers its positioned parent.
const coverLink =
  "outline-none after:absolute after:inset-0 after:z-10 focus-visible:after:rounded-lg focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-link"

function CategoryDate({ post }: { post: ListPost }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm leading-5 text-muted-foreground tabular-nums">
      <Badge variant="muted" className="rounded-md">
        {categories[post.category]}
      </Badge>
      <time dateTime={post.date}>{formatPostDate(post.date)}</time>
      {post.draft && <span className="text-highlight">Draft</span>}
    </div>
  )
}

// A picture with an optional dark version. The generated Open Graph card is served by a route, so
// it skips the image optimizer.
function Picture({
  src,
  darkSrc,
  sizes,
  priority,
  className,
}: {
  src: string
  darkSrc?: string
  sizes: string
  priority?: boolean
  className: string
}) {
  const unoptimized = src.endsWith("/opengraph-image")
  return (
    <>
      <Image
        src={src}
        alt=""
        fill
        sizes={sizes}
        priority={priority}
        unoptimized={unoptimized}
        className={`${className} ${darkSrc ? "dark:hidden" : ""}`}
      />
      {darkSrc && (
        <Image
          src={darkSrc}
          alt=""
          fill
          sizes={sizes}
          priority={priority}
          className={`${className} hidden dark:block`}
        />
      )}
    </>
  )
}

// The one big post at the top of the index: its cover from the product, or its share picture,
// beside the title, the description and the byline.
export function FeaturedPost({ post }: { post: ListPost }) {
  const author = postAuthor(post)
  return (
    <article className="group relative grid overflow-hidden rounded-lg border transition-colors hover:border-foreground/20 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
      <div className="relative aspect-[1200/630] overflow-hidden border-b bg-sidebar lg:aspect-auto lg:min-h-[400px] lg:border-r lg:border-b-0">
        <Picture
          src={post.cover ?? postImage(post)}
          darkSrc={post.cover ? post.coverDark : undefined}
          sizes="(min-width: 1024px) 60vw, 100vw"
          priority
          className={post.cover ? "object-cover object-left-top" : "object-cover"}
        />
      </div>
      <div className="flex min-w-0 flex-col gap-6 p-6 md:p-8 lg:justify-between lg:p-10">
        <div className="flex flex-col gap-4">
          <CategoryDate post={post} />
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
        <p className="flex items-center gap-2.5 text-sm leading-5 text-muted-foreground tabular-nums">
          <Image src={author.avatar} alt="" width={24} height={24} className="size-6 rounded-md" />
          <span className="text-foreground">{author.name}</span>
          <span aria-hidden="true">·</span>
          <span>{post.minutes} min read</span>
        </p>
      </div>
    </article>
  )
}

// Every other post: its share picture, the category and date, the title and its description.
function PostCard({ post }: { post: ListPost }) {
  return (
    <li className="group relative flex min-w-0 flex-col gap-4">
      <div className="relative aspect-[1200/630] overflow-hidden rounded-lg border bg-sidebar transition-colors group-hover:border-foreground/20">
        <Picture
          src={postImage(post)}
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-2.5">
        <CategoryDate post={post} />
        <h3 className="font-heading text-xl leading-7 font-medium tracking-[-0.02em] text-balance">
          <a
            href={postPath(post.slug)}
            className={`${coverLink} group-hover:text-link focus-visible:text-link`}
          >
            {post.title}
          </a>
        </h3>
        <p className="line-clamp-3 text-base leading-6.5 text-muted-foreground">
          {post.description}
        </p>
      </div>
    </li>
  )
}

export function PostGrid({ posts }: { posts: ListPost[] }) {
  return (
    <ol className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </ol>
  )
}

// The index as the server renders it before the filters hydrate: the featured post and the first
// page of cards.
export function IndexFallback({ posts }: { posts: ListPost[] }) {
  const featured = featuredPost(posts)
  const rest = posts.filter((post) => post !== featured).slice(0, pageSize)
  return (
    <div className="flex flex-col gap-12 md:gap-16">
      {featured && <FeaturedPost post={featured} />}
      {rest.length > 0 && <PostGrid posts={rest} />}
    </div>
  )
}
