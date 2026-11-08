import { ogContentType, ogSize, renderPostOgImage } from "@/lib/og"
import { getTemplate, getTemplates } from "@/lib/template-source"

export const size = ogSize
export const contentType = ogContentType
export const alt = "Sniptide template"

export function generateStaticParams() {
  return getTemplates().map((template) => ({ name: template.name }))
}

// The blog post card with the template's title, rendered once per template at build time.
export default async function Image({ params }: { params: Promise<{ name: string }> }) {
  const template = getTemplate((await params).name)
  return renderPostOgImage({ title: template?.title ?? "Sniptide templates" })
}
