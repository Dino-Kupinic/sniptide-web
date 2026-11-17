import { templateOgVisual } from "@/components/templates/template-visual"
import { siteUrl } from "@/lib/site"
import { getTemplates, readTemplateFiles } from "@/lib/template-source"
import { templateIndexEntry, templatesPath } from "@/lib/templates"

// Every template in directory order at /templates.json (rewritten here in next.config.ts). The
// app's dashboard lists it so new accounts can start from a template, and opens one through
// /new?template=<name>. Any site may read it.
export const dynamic = "force-static"

export function GET() {
  const templates = getTemplates().map((template) =>
    templateIndexEntry(
      template,
      templateOgVisual(template),
      readTemplateFiles(template)[0]?.content ?? null,
    ),
  )
  return Response.json(
    { templates },
    {
      headers: {
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
        Link: `<${siteUrl}${templatesPath}>; rel="canonical"`,
      },
    },
  )
}
