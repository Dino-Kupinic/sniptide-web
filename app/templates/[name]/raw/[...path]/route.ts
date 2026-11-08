import { siteUrl } from "@/lib/site"
import { getTemplate, getTemplates, readTemplateFiles } from "@/lib/template-source"
import { templatePath } from "@/lib/templates"

// One file of a template as plain text at /templates/<name>/raw/<path>, for the Raw link above
// each file and for curl.
export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return getTemplates().flatMap((template) =>
    template.files.map((file) => ({ name: template.name, path: file.split("/") })),
  )
}

type Params = { params: Promise<{ name: string; path: string[] }> }

export async function GET(_request: Request, { params }: Params) {
  const { name, path } = await params
  const template = getTemplate(name)
  const file = template && readTemplateFiles(template).find((f) => f.path === path.join("/"))
  if (!template || !file) return new Response("Not found", { status: 404 })
  return new Response(file.content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "X-Robots-Tag": "noindex",
      Link: `<${siteUrl}${templatePath(template.name)}>; rel="canonical"`,
    },
  })
}
