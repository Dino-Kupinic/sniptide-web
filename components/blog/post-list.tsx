import { formatPostDate, type PostMeta, postPath } from "@/lib/blog"

// The index: one row per post, newest first, with the date in tabular numerals, the title as the
// link and its one-sentence description. A row's whole area is the link's hit target.
export function PostList({ posts }: { posts: PostMeta[] }) {
  return (
    <ol className="divide-y border-y">
      {posts.map((post) => (
        <li key={post.slug} className="relative">
          <article className="grid gap-x-10 gap-y-1.5 py-6 md:grid-cols-[9rem_minmax(0,1fr)] md:py-7">
            <time
              dateTime={post.date}
              className="text-sm leading-6 text-muted-foreground tabular-nums md:pt-0.5"
            >
              {formatPostDate(post.date)}
            </time>
            <div className="flex min-w-0 flex-col gap-1.5">
              <h2 className="font-heading text-xl leading-7 font-medium tracking-[-0.02em] md:text-2xl md:leading-8">
                <a
                  href={postPath(post.slug)}
                  className="outline-none after:absolute after:inset-0 hover:text-link focus-visible:text-link focus-visible:after:rounded-md focus-visible:after:outline-2 focus-visible:after:outline-link"
                >
                  {post.title}
                </a>
              </h2>
              <p className="max-w-[62ch] text-base leading-6.5 text-muted-foreground">
                {post.description}
              </p>
              {post.draft && <p className="text-sm leading-5 text-highlight">Draft</p>}
            </div>
          </article>
        </li>
      ))}
    </ol>
  )
}
