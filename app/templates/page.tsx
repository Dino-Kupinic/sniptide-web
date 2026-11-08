import type { Metadata } from "next"
import { BlogShell } from "@/components/blog/blog-shell"
import { LifeBackground } from "@/components/blog/life-background"
import { serializeJsonLd } from "@/lib/structured-data"
import { getTemplates } from "@/lib/template-source"
import {
  directoryStructuredData,
  groupTemplates,
  templatePath,
  templatesDescription,
  templatesPath,
} from "@/lib/templates"

export const metadata: Metadata = {
  title: "Templates",
  description: templatesDescription,
  alternates: { canonical: templatesPath },
}

export const dynamic = "force-static"

// The public directory of templates, grouped by category. Each row links to the template's page.
export default function Page() {
  const templates = getTemplates()
  const groups = groupTemplates(templates)

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
          <header className="flex max-w-[40rem] flex-col gap-4 pb-12 md:pb-16">
            <h1 className="font-heading text-[34px] leading-9.5 font-medium tracking-[-0.03em] md:text-5xl md:leading-13">
              Templates
            </h1>
            <p className="text-lg leading-7 text-pretty text-muted-foreground">
              These are files you copy into a project instead of writing them from scratch. Each one
              explains what every section does and opens in the Sniptide editor as a paste you own.
            </p>
          </header>

          <div className="flex flex-col gap-14 md:gap-16">
            {groups.map((group) => (
              <section
                key={group.category}
                id={group.category}
                aria-labelledby={`${group.category}-heading`}
                className="scroll-mt-24"
              >
                <h2
                  id={`${group.category}-heading`}
                  className="font-heading text-2xl leading-8 font-medium tracking-[-0.02em]"
                >
                  {group.label}
                </h2>
                <ul className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {group.templates.map((template) => (
                    <li key={template.name} className="flex min-w-0">
                      <a
                        href={templatePath(template.name)}
                        className="flex w-full flex-col gap-2 rounded-lg border bg-background p-5 transition-colors hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link"
                      >
                        <span className="text-base leading-6 font-medium">{template.title}</span>
                        <span className="text-sm leading-5 text-pretty text-muted-foreground">
                          {template.description}
                        </span>
                        <span className="mt-auto truncate pt-2 font-mono text-xs leading-5 text-muted-foreground">
                          {template.files.join("  ")}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>
    </BlogShell>
  )
}
