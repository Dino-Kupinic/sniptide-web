import { templateOgVisual } from "@/components/templates/template-visual"
import { ogContentType, ogSize, renderPostOgImage, renderTemplateOgImage } from "@/lib/og"
import { getTemplate, getTemplates, readTemplateFiles } from "@/lib/template-source"

export const size = ogSize
export const contentType = ogContentType
export const alt = "Sniptide template"

export function generateStaticParams() {
  return getTemplates().map((template) => ({ name: template.name }))
}

// The template's title beside a glimpse of its main file under its logo or icon, rendered once per template at build time.
export default async function Image({ params }: { params: Promise<{ name: string }> }) {
  const template = getTemplate((await params).name)
  const visual = template && templateOgVisual(template)
  if (!template || !visual)
    return renderPostOgImage({ title: template?.title ?? "Sniptide templates" })
  const [first] = readTemplateFiles(template)
  return renderTemplateOgImage({
    title: template.title,
    file: first?.path ?? "",
    code: first?.content ?? "",
    visual,
  })
}
