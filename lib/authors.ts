// The people who write for the blog, with 96px square avatars in public/blog/authors. A post names
// its author by key in its frontmatter, so a key that isn't listed here fails the build instead of
// shipping a post without a byline.
export const authors = {
  dino: {
    name: "Dino Kupinic",
    role: "Founder",
    avatar: "/blog/authors/dino.jpg",
    url: "https://github.com/Dino-Kupinic",
  },
} as const

export type AuthorKey = keyof typeof authors
export type Author = (typeof authors)[AuthorKey]

export const authorKeys = Object.keys(authors) as [AuthorKey, ...AuthorKey[]]
