import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import { primaryButton, secondaryButton } from "@/components/blog/buttons"
import { type PostMeta, postPath } from "@/lib/blog"
import { links } from "@/lib/links"

// The end of a post: its tags, one way into the product, and the posts on either side of it.
export function PostFooter({
  post,
  newer,
  older,
}: {
  post: PostMeta
  newer?: PostMeta
  older?: PostMeta
}) {
  return (
    <footer className="mt-16 flex flex-col gap-10">
      {post.tags.length > 0 && (
        <p className="text-sm leading-5 text-muted-foreground">
          Filed under{" "}
          {post.tags.map((tag, index) => (
            <span key={tag}>
              <span className="font-mono text-[0.8125rem] text-foreground">{tag}</span>
              {index < post.tags.length - 1 && ", "}
            </span>
          ))}
        </p>
      )}

      <section
        aria-labelledby="post-cta"
        className="flex flex-col gap-5 rounded-lg border bg-card p-6 md:flex-row md:items-center md:justify-between"
      >
        <div className="flex flex-col gap-1">
          <h2
            id="post-cta"
            className="font-heading text-xl leading-7 font-medium tracking-[-0.02em]"
          >
            Give your agent a snippet library
          </h2>
          <p className="text-[0.9375rem] leading-6 text-muted-foreground">
            Use the hosted app, or run Sniptide on your own server.
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <a href={links.docs} className={secondaryButton}>
            Read the docs
          </a>
          <a href={links.signUp} className={primaryButton}>
            Get started
          </a>
        </div>
      </section>

      {(newer || older) && (
        <nav aria-label="More posts" className="grid gap-3 sm:grid-cols-2">
          {older ? <AdjacentLink post={older} direction="older" /> : <span />}
          {newer && <AdjacentLink post={newer} direction="newer" />}
        </nav>
      )}
    </footer>
  )
}

function AdjacentLink({ post, direction }: { post: PostMeta; direction: "older" | "newer" }) {
  const newer = direction === "newer"
  return (
    <a
      href={postPath(post.slug)}
      className={`flex flex-col gap-1 rounded-lg border p-4 transition-colors hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link ${newer ? "sm:col-start-2 sm:items-end sm:text-right" : ""}`}
    >
      <span className="inline-flex items-center gap-1 text-sm leading-5 text-muted-foreground">
        {!newer && <ArrowLeftIcon aria-hidden="true" className="size-3.5" />}
        {newer ? "Newer post" : "Older post"}
        {newer && <ArrowRightIcon aria-hidden="true" className="size-3.5" />}
      </span>
      <span className="text-[0.9375rem] leading-6 font-medium">{post.title}</span>
    </a>
  )
}
