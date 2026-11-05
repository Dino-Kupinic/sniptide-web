import { LogoMarquee } from "@/components/dithercn/logo-marquee"
import { ditherSettings } from "@/lib/dither/settings"

export const tools = [
  {
    src: "/logos/claude-code.svg",
    alt: "Claude Code",
    href: "https://claude.com/product/claude-code",
    ratio: 1,
  },
  { src: "/logos/cursor.svg", alt: "Cursor", href: "https://cursor.com", ratio: 1 },
  { src: "/logos/codex.svg", alt: "Codex", href: "https://openai.com/codex/", ratio: 1 },
  { src: "/logos/github.svg", alt: "GitHub", href: "https://github.com", ratio: 1 },
  { src: "/logos/docker.svg", alt: "Docker", href: "https://www.docker.com", ratio: 1 },
  { src: "/logos/slack.svg", alt: "Slack", href: "https://slack.com", ratio: 1 },
  { src: "/logos/discord.svg", alt: "Discord", href: "https://discord.com", ratio: 1 },
  { src: "/logos/curl.svg", alt: "curl", href: "https://curl.se", ratio: 1 },
] as const

export function WorksWith() {
  return (
    <section className="flex flex-col items-center gap-5 pt-7 pb-12 md:gap-7 md:pt-6 md:pb-18">
      <p className="px-5 text-[13px] leading-4 text-[#6b6b6b] dark:text-[#a3a3a3]">
        Works with the tools you already use.
      </p>
      <LogoMarquee
        logos={tools}
        label="Compatible tools"
        logoHeight={24}
        gap={56}
        speed={24}
        fade="soft"
        fadeWidth={80}
        color="--foreground"
        effect="none"
        fill={ditherSettings.fill}
        cell={ditherSettings.cell}
        className="max-w-300"
      />
    </section>
  )
}
