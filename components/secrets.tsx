import { ArrowRightIcon } from "lucide-react"
import secretsDark from "@/assets/landing/secrets-dark.webp"
import { EnvTerminal } from "@/components/env-terminal"
import { LifeField } from "@/components/life-field"
import { Screenshot } from "@/components/screenshot"
import { SectionHeading } from "@/components/section-heading"
import { docsPages } from "@/lib/links"

// The encryption facts mirror lib/env/crypto.ts in the app repo.
const facts = [
  {
    title: "Encrypted per value",
    text: "AES-256-GCM with a fresh nonce for every value, verified each time it is read.",
  },
  {
    title: "Key kept off the database",
    text: "The key is derived from your server's secret, so a copy of the database alone stays unreadable.",
  },
  {
    title: "Never printed",
    text: "The CLI names variables and never shows values, so agent output stays clean.",
  },
]

// Dark in both themes, like a terminal.
export function Secrets() {
  return (
    <section
      id="secrets"
      data-cta-location="secrets"
      className="relative flex scroll-mt-4 flex-col gap-10 overflow-clip bg-[#0a0a0a] section-frame *:relative py-16 text-white [--button-focus:#8f8cff] md:gap-14 md:py-20 xl:py-30"
    >
      <LifeField live="#f6a9d3" trail="#2a26ec" density={0.06} className="!absolute opacity-25" />
      <SectionHeading
        claim="Your .env files stay in sync."
        reason="Agents use the keys and never print them."
        reasonClassName="text-[#8f8cff]"
      />

      {/* The real env group page, with the agent's terminal laid over its corner. */}
      <figure className="relative flex flex-col gap-3 lg:pb-16">
        <Screenshot
          light={secretsDark}
          alt="The checkout env group in Sniptide with four variables whose values stay hidden: DATABASE_URL, STRIPE_SECRET_KEY, RESEND_API_KEY and PORT."
          crop
          className="border-[#262626] lg:w-[66%]"
        />
        <div className="lg:absolute lg:right-0 lg:bottom-0 lg:w-[46%]">
          <EnvTerminal />
        </div>
      </figure>

      <ul className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {facts.map((fact) => (
          <li key={fact.title} className="flex flex-col gap-1.5 border-t border-[#262626] pt-4">
            <h3 className="text-base leading-5.5 font-semibold">{fact.title}</h3>
            <p className="text-base leading-6 text-[#a3a3a3]">{fact.text}</p>
          </li>
        ))}
      </ul>

      <a
        href={docsPages.envSync}
        className="raised-button flex h-10 items-center gap-2 self-start border border-[#3a3737] bg-[#0a0a0a] [--button-depth:#3a3737] px-4 text-sm leading-5 font-medium hover:bg-white/5"
      >
        Read the env sync guide
        <ArrowRightIcon aria-hidden="true" className="size-4" strokeWidth={2} />
      </a>
    </section>
  )
}
