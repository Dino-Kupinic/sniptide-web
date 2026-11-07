import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import { type PostMeta, postPath } from "@/lib/blog"

// The end of a post: the posts on either side of it. The way into the product is the
// wide call to action below the post (BlogShell).
export function PostFooter({ newer, older }: { newer?: PostMeta; older?: PostMeta }) {
  return (
    <footer className="mt-16 flex flex-col gap-10">
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
