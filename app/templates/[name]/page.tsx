import { ArrowRightIcon, ChevronRightIcon, FileTextIcon, SquarePenIcon } from "lucide-react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { BlogShell } from "@/components/blog/blog-shell"
import { primaryButton, secondaryButton } from "@/components/blog/buttons"
import { blogMdxComponents } from "@/components/blog/mdx"
import { TableOfContents, type TocItem } from "@/components/blog/table-of-contents"
import { FunnelTracking } from "@/components/funnel-tracking"
import { TemplateGrid } from "@/components/templates/template-card"
import { TemplateCode } from "@/components/templates/template-code"
import { templateCards } from "@/components/templates/template-preview"
import { mcpEndpoint } from "@/lib/agent-docs"
import { postPath } from "@/lib/blog"
import { getPost } from "@/lib/blog-source"
import { siteUrl } from "@/lib/site"
import { serializeJsonLd } from "@/lib/structured-data"
import {
  getTemplate,
  getTemplates,
  readTemplateFiles,
  relatedTemplates,
} from "@/lib/template-source"
import {
  formatTemplateDate,
  templateCategories,
  templateDepartments,
  templateEditorUrl,
  templateJsonPath,
  templateMarkdownPath,
  templatePath,
  templateRawPath,
  templateStructuredData,
  templatesPath,
} from "@/lib/templates"

type Props = { params: Promise<{ name: string }> }

// Rendered once when the site builds, which is when the template files are read from the checkout.
export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return getTemplates().map((template) => ({ name: template.name }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const template = getTemplate((await params).name)
  if (!template) return {}
  const path = templatePath(template.name)
  return {
    title: template.title,
    description: template.description,
    keywords: template.query.split(",").map((query) => query.trim()),
    alternates: {
      canonical: path,
      types: {
        "text/markdown": templateMarkdownPath(template.name),
        "application/json": templateJsonPath(template.name),
      },
    },
    openGraph: {
      type: "article",
      title: template.title,
      description: template.description,
      url: path,
      modifiedTime: template.updated,
    },
    twitter: { title: template.title, description: template.description },
  }
}

const agentHeadingId = "save-with-your-agent"
const filesHeadingId = "files"

export default async function Page({ params }: Props) {
  const template = getTemplate((await params).name)
  if (!template) notFound()

  const files = readTemplateFiles(template)
  const related = await templateCards(relatedTemplates(template).slice(0, 3))
  const post = template.post ? getPost(template.post) : undefined
  const Body = template.entry.body
  const jsonUrl = `${siteUrl}${templateJsonPath(template.name)}`
  const toc: TocItem[] = [
    { title: "Files", url: `#${filesHeadingId}`, depth: 2 },
    { title: "Save with your agent", url: `#${agentHeadingId}`, depth: 2 },
    ...template.entry.toc.filter((item) => item.depth === 2),
  ]

  return (
    <BlogShell cta>
      <FunnelTracking />
      <script
        type="application/ld+json"
        // Built from the template's frontmatter and escaped by serializeJsonLd.
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be raw script text.
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(templateStructuredData(template, files)),
        }}
      />
      {/* The page keeps a 44rem column for the files and the explanation, with the contents list in
          a rail on wide screens, like a blog post. */}
      <article
        data-cta-location="template"
        className="mx-auto grid w-full max-w-[1440px] px-5 pt-8 pb-12 md:px-10 md:pt-14 md:pb-16 lg:px-30 xl:grid-cols-[minmax(0,1fr)_44rem_minmax(0,1fr)] xl:gap-x-16"
      >
        <div className="mx-auto w-full max-w-[44rem] min-w-0 xl:col-start-2">
          <header>
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-1.5 text-sm leading-5 text-muted-foreground">
                <li>
                  <a href={templatesPath} className="hover:text-foreground">
                    Templates
                  </a>
                </li>
                <li aria-hidden="true">
                  <ChevronRightIcon className="size-3.5" />
                </li>
                <li>
                  <a
                    href={`${templatesPath}?department=${template.department}`}
                    className="hover:text-foreground"
                  >
                    {templateDepartments[template.department]}
                  </a>
                </li>
                <li aria-hidden="true">
                  <ChevronRightIcon className="size-3.5" />
                </li>
                <li>
                  <a
                    href={`${templatesPath}?department=${template.department}&q=${encodeURIComponent(templateCategories[template.category])}`}
                    className="hover:text-foreground"
                  >
                    {templateCategories[template.category]}
                  </a>
                </li>
              </ol>
            </nav>
            <h1 className="mt-5 font-heading text-[34px] leading-10 font-medium tracking-[-0.03em] text-balance md:text-5xl md:leading-[3.5rem]">
              {template.title}
            </h1>
            <p className="mt-5 max-w-[40rem] text-lg leading-7 text-pretty text-muted-foreground">
              {template.answer}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-4">
              <div className="flex flex-wrap gap-3">
                <a href={templateEditorUrl(template.name)} className={primaryButton}>
                  <SquarePenIcon aria-hidden="true" className="size-4" />
                  Use template
                </a>
                <a href={templateMarkdownPath(template.name)} className={secondaryButton}>
                  <FileTextIcon aria-hidden="true" className="size-4" />
                  View as Markdown
                </a>
              </div>
              <p className="text-sm leading-5 text-muted-foreground tabular-nums">
                Updated{" "}
                <time dateTime={template.updated}>{formatTemplateDate(template.updated)}</time>
              </p>
            </div>
          </header>

          <section aria-labelledby={filesHeadingId} className="mt-12">
            <h2 id={filesHeadingId} className="sr-only">
              Files
            </h2>
            <div className="flex flex-col gap-6">
              {files.map((file) => (
                <TemplateCode
                  key={file.path}
                  code={file.content}
                  language={file.language}
                  title={file.path}
                  actions={
                    <a
                      href={templateRawPath(template.name, file.path)}
                      className="inline-flex h-7 items-center rounded-md px-2 font-sans text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link"
                    >
                      Raw
                    </a>
                  }
                />
              ))}
            </div>
          </section>

          <section aria-labelledby={agentHeadingId} className="blog-prose mt-12">
            <h2 id={agentHeadingId}>Save with your agent</h2>
            <p>
              Connect the Sniptide MCP server once, then ask your agent to keep this template in
              your library. It reads the files from the JSON version of this page and saves them as
              a private snippet you can edit and file into a collection.
            </p>
            <TemplateCode
              code={`claude mcp add --transport http sniptide ${mcpEndpoint}`}
              language="bash"
              title="Terminal"
            />
            <TemplateCode
              code={`Read ${jsonUrl} and save its files as a private Sniptide snippet titled "${template.title}".`}
              language="text"
              title="Prompt"
              wrap
            />
          </section>

          <div className="blog-prose mt-12">
            <Body components={blogMdxComponents} />
          </div>

          {post && (
            <a
              href={postPath(post.slug)}
              className="group mt-16 flex flex-col gap-1 rounded-lg border bg-sidebar p-5 transition-colors hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link"
            >
              <span className="text-sm leading-5 text-muted-foreground">From the blog</span>
              <span className="inline-flex items-center gap-1.5 text-base leading-6 font-medium">
                {post.title}
                <ArrowRightIcon
                  aria-hidden="true"
                  className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5"
                />
              </span>
            </a>
          )}
        </div>

        <aside className="hidden xl:col-start-3 xl:row-start-1 xl:block xl:max-w-60">
          <div className="sticky top-24">
            <TableOfContents items={toc} />
          </div>
        </aside>
      </article>

      {related.length > 0 && (
        <section
          aria-labelledby="related-templates"
          data-cta-location="template"
          className="mx-auto w-full max-w-[1440px] border-t px-5 pt-12 pb-4 md:px-10 md:pt-16 lg:px-30"
        >
          <div className="flex items-end justify-between gap-4 pb-6">
            <h2
              id="related-templates"
              className="font-heading text-2xl leading-8 font-medium tracking-[-0.02em]"
            >
              Related templates
            </h2>
            <a
              href={templatesPath}
              className="text-sm leading-5 font-medium text-link underline-offset-4 hover:underline"
            >
              All templates
            </a>
          </div>
          <TemplateGrid templates={related} />
        </section>
      )}
    </BlogShell>
  )
}
