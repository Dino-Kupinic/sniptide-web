import { LogoMarquee } from "@/components/dithercn/logo-marquee"

export const tools = [
  {
    src: "/logos/claude.svg",
    alt: "Claude Code",
    href: "https://claude.com/product/claude-code",
    ratio: 573 / 125,
  },
  { src: "/logos/cursor.svg", alt: "Cursor", href: "https://cursor.com", ratio: 2238.7 / 532.09 },
  { src: "/logos/openai.svg", alt: "OpenAI", href: "https://openai.com", ratio: 1127 / 305 },
  { src: "/logos/github.svg", alt: "GitHub", href: "https://github.com", ratio: 416 / 95 },
  { src: "/logos/docker.svg", alt: "Docker", href: "https://www.docker.com", ratio: 1250 / 268 },
  { src: "/logos/slack.svg", alt: "Slack", href: "https://slack.com", ratio: 498 / 127 },
  { src: "/logos/discord.svg", alt: "Discord", href: "https://discord.com", ratio: 635.303 / 96 },
  { src: "/logos/curl.svg", alt: "curl", href: "https://curl.se", ratio: 2851 / 854 },
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
        color="--foreground"
        effect="scan"
        floor={0.6}
        className="max-w-300"
      />
    </section>
  )
}
