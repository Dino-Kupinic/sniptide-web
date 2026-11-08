import { SquarePenIcon } from "lucide-react"
import type { ReactNode } from "react"
import { primaryButton } from "@/components/blog/buttons"
import {
  type TemplateMeta,
  templateCategories,
  templateEditorUrl,
  templatePath,
} from "@/lib/templates"

export type TemplateCardData = Pick<
  TemplateMeta,
  "name" | "title" | "description" | "category" | "department" | "files"
> & {
  // The first lines of the first file, highlighted on the server (templatePreview).
  preview: ReactNode
}

// A template in the directory and in a page's related list, drawn like a paste card in the app:
// the title large, one sentence, and a panel with the first lines of the main file that runs off
// the bottom edge. The whole card opens the template's page, and Use template opens the editor
// directly.
export function TemplateCard({ template }: { template: TemplateCardData }) {
  const [first, ...rest] = template.files
  return (
    <li className="group relative flex h-[22rem] min-w-0 flex-col overflow-hidden rounded-lg border bg-sidebar px-5 pt-4 transition-colors hover:border-foreground/30">
      <div className="flex h-[30px] min-w-0 items-center justify-between gap-3">
        <span className="truncate text-[13px] leading-[18px] text-muted-foreground">
          {templateCategories[template.category]}
        </span>
        <a
          href={templateEditorUrl(template.name)}
          className={`${primaryButton} relative z-10 shrink-0`}
          aria-label={`Use the ${template.title}`}
        >
          <SquarePenIcon aria-hidden="true" className="size-4" />
          Use template
        </a>
      </div>
      <a
        href={templatePath(template.name)}
        className="mt-3 line-clamp-2 shrink-0 font-heading text-2xl/[30px] font-bold tracking-[-0.02em] text-balance [overflow-wrap:anywhere] outline-none after:absolute after:inset-0 after:rounded-lg focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-link"
      >
        {template.title}
      </a>
      <p className="mt-2 line-clamp-2 shrink-0 text-sm leading-5 text-pretty text-muted-foreground">
        {template.description}
      </p>
      <div className="mt-4 -mb-2 flex min-h-0 flex-1 flex-col rounded-t-lg border border-b-0 bg-background transition-transform duration-200 group-hover:-translate-y-1 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
        <div className="flex items-center justify-between gap-3 border-b px-3.5 py-2 text-xs leading-4 text-muted-foreground">
          <span className="truncate font-mono">{first}</span>
          {rest.length > 0 && (
            <span className="shrink-0 tabular-nums">
              {rest.length === 1 ? "+1 file" : `+${rest.length} files`}
            </span>
          )}
        </div>
        {template.preview}
      </div>
    </li>
  )
}

// The cards in the grid the directory and the related list share: one column on phones, two from
// md and three from xl, unless a list asks for fewer.
export function TemplateGrid({
  templates,
  columns = 3,
}: {
  templates: TemplateCardData[]
  columns?: 2 | 3
}) {
  return (
    <ul className={`grid gap-4 md:grid-cols-2 ${columns === 3 ? "xl:grid-cols-3" : ""}`}>
      {templates.map((template) => (
        <TemplateCard key={template.name} template={template} />
      ))}
    </ul>
  )
}
