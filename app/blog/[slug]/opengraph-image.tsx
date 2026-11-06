import { getPost, getPosts } from "@/lib/blog-source"
import { ogContentType, ogSize, renderPostOgImage } from "@/lib/og"

export const size = ogSize
export const contentType = ogContentType
export const alt = "Sniptide blog post"

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug)
  return renderPostOgImage({ title: post?.title ?? "Sniptide blog" })
}
