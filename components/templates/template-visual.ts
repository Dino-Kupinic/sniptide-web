import { tools } from "@/components/works-with"
import type { TemplateOgVisual } from "@/lib/og"
import { type TemplateLogo, type TemplateMeta, templateIconPath } from "@/lib/templates"

// The artwork the "Works with" row already uses, so each mark has one source in public/logos.
const logoArtwork: Record<TemplateLogo, (typeof tools)[number]["alt"]> = {
  claude: "Claude Code",
  cursor: "Cursor",
  openai: "OpenAI",
  github: "GitHub",
  docker: "Docker",
}

export function templateLogoArtwork(logo: TemplateLogo) {
  return tools.find((tool) => tool.alt === logoArtwork[logo])
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
