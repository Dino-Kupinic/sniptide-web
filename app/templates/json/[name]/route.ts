import { siteUrl } from "@/lib/site"
import { getTemplate, getTemplates, readTemplateFiles } from "@/lib/template-source"
import { templateJson, templatePath } from "@/lib/templates"

// A template's files as JSON at /templates/<name>.json (rewritten here in next.config.ts). The
// app's editor reads it for /new?template=<name>, so the files in this repository are the one
// source for both. Any site may read it.
export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return getTemplates().map((template) => ({ name: template.name }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const template = getTemplate((await params).name)
  if (!template) return Response.json({ error: "Not found" }, { status: 404 })
  const canonical = `${siteUrl}${templatePath(template.name)}`
  return Response.json(templateJson(template, readTemplateFiles(template)), {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
      Link: `<${canonical}>; rel="canonical"`,
    },
  })
}
