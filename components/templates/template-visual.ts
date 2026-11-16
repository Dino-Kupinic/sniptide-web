import { tools } from "@/components/works-with"
import type { TemplateOgVisual } from "@/lib/og"
import { type TemplateLogo, type TemplateMeta, templateIconPath } from "@/lib/templates"

type Artwork = { src: string; ratio: number }

// Most logos reuse the artwork of the "Works with" row, so each mark has one source in
// public/logos. A tool that isn't in that row names its file and aspect ratio here instead.
const logoArtwork: Record<TemplateLogo, (typeof tools)[number]["alt"] | Artwork> = {
  claude: "Claude Code",
  cursor: "Cursor",
  openai: "OpenAI",
  github: "GitHub",
  docker: "Docker",
  "grok-bot": { src: "/logos/grok-bot.svg", ratio: 132.119 / 24 },
}

export function templateLogoArtwork(logo: TemplateLogo): Artwork | undefined {
  const artwork = logoArtwork[logo]
  if (typeof artwork !== "string") return artwork
  return tools.find((tool) => tool.alt === artwork)
}

// The visual a template's share card shows. lib/templates.test.ts checks that every template has
// a logo or an icon with a mark.
export function templateOgVisual(
  template: Pick<TemplateMeta, "logo" | "icon" | "mark" | "title">,
): TemplateOgVisual | null {
  const artwork = template.logo && templateLogoArtwork(template.logo)
  if (artwork) return { kind: "logo", src: artwork.src, ratio: artwork.ratio }
  if (template.icon)
    return {
      kind: "icon",
      src: templateIconPath(template.icon),
      mark: template.mark ?? template.title,
    }
  return null
}
