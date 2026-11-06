"use client"

import { Radio } from "@base-ui/react/radio"
import { RadioGroup } from "@base-ui/react/radio-group"
import { SearchIcon, XIcon } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useMemo, useState } from "react"
import { PostList } from "@/components/blog/post-list"
import { type Category, categories, type PostMeta } from "@/lib/blog"

export type IndexPost = PostMeta & { searchText: string }

// Whether a post matches every word of the query, in its title, description, tags or text.
export function matchesQuery(post: IndexPost, query: string) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (words.length === 0) return true
  const haystack =
    `${post.title} ${post.description} ${post.tags.join(" ")} ${post.searchText}`.toLowerCase()
  return words.every((word) => haystack.includes(word))
}

function isCategory(value: string | null): value is Category {
  return value !== null && value in categories
}

// The URL keeps the filters (?category=engineering&q=mcp), so a filtered list can be shared and the
// back button restores it. replaceState updates the address without a server round trip.
function writeParams(category: Category | null, query: string) {
  const params = new URLSearchParams()
  if (category) params.set("category", category)
  if (query.trim()) params.set("q", query.trim())
  const search = params.toString()
  window.history.replaceState(null, "", search ? `?${search}` : window.location.pathname)
}

// The index with a search field and a category filter above the list. Only categories that have
// posts are offered.
export function BlogIndex({ posts }: { posts: IndexPost[] }) {
  const params = useSearchParams()
  const initialCategory = params.get("category")
  const [category, setCategory] = useState<Category | null>(
    isCategory(initialCategory) ? initialCategory : null,
  )
  const [query, setQuery] = useState(params.get("q") ?? "")

  const used = useMemo(
    () =>
      (Object.keys(categories) as Category[]).filter((key) =>
        posts.some((post) => post.category === key),
      ),
    [posts],
  )
  const visible = posts.filter(
    (post) => (!category || post.category === category) && matchesQuery(post, query),
  )

  function pick(next: Category | null) {
    setCategory(next)
    writeParams(next, query)
  }

  function search(next: string) {
    setQuery(next)
    writeParams(category, next)
  }

  function clear() {
    setCategory(null)
    setQuery("")
    writeParams(null, "")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="scrollbar-subtle -mx-5 flex overflow-x-auto px-5 md:mx-0 md:px-0">
          <RadioGroup
            aria-label="Category"
            value={category ?? "all"}
            onValueChange={(value) =>
              pick(isCategory(value as string) ? (value as Category) : null)
            }
            className="flex shrink-0 gap-0.5 rounded-lg bg-muted p-[3px]"
          >
            {["all", ...used].map((key) => (
              <Radio.Root
                key={key}
                value={key}
                className="inline-flex h-[30px] shrink-0 items-center rounded-md px-3 text-[13px] leading-[18px] whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-link data-checked:bg-background data-checked:font-medium data-checked:text-foreground data-checked:shadow-[0_1px_2px_rgb(0_0_0/0.08)]"
              >
                {isCategory(key) ? categories[key] : "All"}
              </Radio.Root>
            ))}
          </RadioGroup>
        </div>
        <div className="relative md:w-72">
          <SearchIcon
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => search(event.target.value)}
            placeholder="Search posts"
            aria-label="Search posts"
            className="h-10 w-full rounded-lg border border-input bg-background pr-9 pl-9 text-sm leading-5 outline-none placeholder:text-muted-foreground focus:border-2 focus:border-primary focus:pr-[35px] focus:pl-[35px] dark:focus:border-link [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => search("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-1.5 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-link"
            >
              <XIcon className="size-4" />
            </button>
          )}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {visible.length === 1 ? "1 post" : `${visible.length} posts`}
      </p>

      {visible.length > 0 ? (
        <PostList posts={visible} />
      ) : (
        <div className="flex flex-col items-start gap-3 border-y py-10">
          <p className="text-base leading-6.5 text-muted-foreground">
            {query.trim()
              ? `No posts match “${query.trim()}”${category ? ` in ${categories[category]}` : ""}.`
              : "No posts in this category yet."}
          </p>
          <button
            type="button"
            onClick={clear}
            className="text-sm leading-5 font-medium text-link underline-offset-4 hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}
