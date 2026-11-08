import type { Metadata } from "next"
import { Suspense } from "react"
import { BlogShell } from "@/components/blog/blog-shell"
import { LifeBackground } from "@/components/blog/life-background"
import { TemplateGrid } from "@/components/templates/template-card"
import { TemplateIndex } from "@/components/templates/template-index"
import { templateCards } from "@/components/templates/template-preview"
import { serializeJsonLd } from "@/lib/structured-data"
import { getTemplates } from "@/lib/template-source"
import { directoryStructuredData, templatesDescription, templatesPath } from "@/lib/templates"

export const metadata: Metadata = {
  title: "Templates",
  description: templatesDescription,
  alternates: { canonical: templatesPath },
}

export const dynamic = "force-static"

// The public directory of templates: a department filter and search above a grid of cards, each
// with a peek at the template's main file.
export default async function Page() {
  const templates = getTemplates()
  const cards = await templateCards(templates)

  return (
    <BlogShell cta>
      <script
        type="application/ld+json"
        // Built from the templates' frontmatter and escaped by serializeJsonLd.
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be raw script text.
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(directoryStructuredData(templates)) }}
      />
      <div className="relative isolate" data-cta-location="template">
        <LifeBackground className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px] w-full opacity-[0.07] [mask-image:linear-gradient(to_bottom,black_0%,black_30%,transparent_85%)] dark:opacity-[0.12]" />
        <div className="mx-auto w-full max-w-[1440px] px-5 pt-12 pb-20 md:px-10 md:pt-20 md:pb-28 lg:px-30">
          <header className="flex max-w-[40rem] flex-col gap-4 pb-10 md:pb-12">
            <h1 className="font-heading text-[34px] leading-9.5 font-medium tracking-[-0.03em] md:text-5xl md:leading-13">
              Templates
            </h1>
            <p className="text-lg leading-7 text-pretty text-muted-foreground">
              These are files you copy into a project instead of writing them from scratch. Each one
              explains what every section does and opens in the Sniptide editor as a paste you own.
            </p>
          </header>
          {/* The filters read the URL, so the full grid renders until the page hydrates. */}
          <Suspense fallback={<TemplateGrid templates={cards} />}>
            <TemplateIndex templates={cards} />
          </Suspense>
        </div>
      </div>
    </BlogShell>
  )
}
