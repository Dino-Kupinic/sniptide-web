import { SquarePenIcon } from "lucide-react"
import type { CSSProperties, ReactNode } from "react"
import { primaryButton } from "@/components/blog/buttons"
import { tools } from "@/components/works-with"
import {
  type TemplateLogo,
  type TemplateMeta,
  templateCategories,
  templateEditorUrl,
  templatePath,
} from "@/lib/templates"

export type TemplateCardData = Pick<
  TemplateMeta,
  "name" | "title" | "description" | "category" | "department" | "files" | "logo"
> & {
  // The first lines of the first file, highlighted on the server (templatePreview).
  preview: ReactNode
}

// The artwork the "Works with" row already uses, so each mark has one source in public/logos.
const logoArtwork: Record<TemplateLogo, (typeof tools)[number]["alt"]> = {
  claude: "Claude Code",
  cursor: "Cursor",
  openai: "OpenAI",
  github: "GitHub",
  docker: "Docker",
}

// Logos share one height, so wordmarks of different widths read as peers.
const logoHeight = 26

function Logo({ logo }: { logo: TemplateLogo }) {
  const artwork = tools.find((tool) => tool.alt === logoArtwork[logo])
  if (!artwork) return null
  // The artwork is a mask filled with the foreground color, so it follows light and dark mode.
  const style: CSSProperties = {
    width: logoHeight * artwork.ratio,
    height: logoHeight,
    maskImage: `url(${artwork.src})`,
    maskSize: "contain",
    maskRepeat: "no-repeat",
    maskPosition: "center",
  }
  return <span aria-hidden="true" className="block max-w-full bg-foreground" style={style} />
}

// A template in the directory and in a page's related list. The cover holds the tool's logo over a
// blurred glimpse of the main file, so the card hints at what is inside and the page reveals it.
// The whole card opens the template's page, and Use template opens the editor directly.
export function TemplateCard({ template }: { template: TemplateCardData }) {
  const [first, ...rest] = template.files
  return (
    <li className="relative flex min-w-0 flex-col overflow-hidden rounded-lg border bg-background">
      <div className="relative flex h-44 items-center justify-center overflow-hidden border-b bg-sidebar">
        <div className="absolute inset-0 opacity-50 blur-[3px] select-none">{template.preview}</div>
        <div className="relative flex h-14 max-w-[80%] items-center rounded-lg border bg-background px-5">
          {template.logo ? (
            <Logo logo={template.logo} />
          ) : (
            <span className="truncate font-mono text-sm leading-5">{first?.split("/").pop()}</span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col px-5 pt-4 pb-5">
        <span className="text-[13px] leading-[18px] text-muted-foreground">
          {templateCategories[template.category]}
        </span>
        <a
          href={templatePath(template.name)}
          className="mt-1.5 line-clamp-2 font-heading text-xl/7 font-bold tracking-[-0.02em] text-balance [overflow-wrap:anywhere] outline-none after:absolute after:inset-0 after:rounded-lg focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-link"
        >
          {template.title}
        </a>
        <p className="mt-2 line-clamp-2 text-sm leading-5 text-pretty text-muted-foreground">
          {template.description}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <span className="min-w-0 truncate text-[13px] leading-[18px] text-muted-foreground tabular-nums">
            {rest.length === 0 ? "1 file" : `${rest.length + 1} files`}
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
