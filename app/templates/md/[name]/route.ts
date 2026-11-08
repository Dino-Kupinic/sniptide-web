import { stripMdxComments } from "@/lib/blog"
import { siteUrl } from "@/lib/site"
import { getTemplate, getTemplates, readTemplateFiles } from "@/lib/template-source"
import { renderTemplateMarkdown, templatePath } from "@/lib/templates"

// A template as Markdown at /templates/<name>.md (rewritten here in next.config.ts), like a blog
// post's twin, for agents and readers that prefer plain text.
export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return getTemplates().map((template) => ({ name: template.name }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const template = getTemplate((await params).name)
  if (!template) return new Response("Not found", { status: 404 })
  const canonical = `${siteUrl}${templatePath(template.name)}`
  const explanation = stripMdxComments(await template.entry.getText("processed"))
  return new Response(renderTemplateMarkdown(template, readTemplateFiles(template), explanation), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      Link: `<${canonical}>; rel="canonical"`,
    },
  })
}
