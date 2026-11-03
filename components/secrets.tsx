import { SectionHeading } from "@/components/section-heading"
import { docsPages } from "@/lib/links"

const variables = ["DATABASE_URL", "STRIPE_SECRET_KEY", "RESEND_API_KEY", "PORT"]

const facts = [
  {
    title: "Encrypted at rest",
    text: "Values are encrypted with AES-256-GCM before they reach your Postgres.",
  },
  {
    title: "Never printed",
    text: "The CLI and its JSON output name variables and never show values, so agent transcripts stay clean.",
  },
  {
    title: "Warned before sharing",
    text: "The paste editor flags anything that looks like a key before a link leaves your hands.",
  },
  {
    title: "Lighter than a vault",
    text: "There is no key rotation or audit trail. Teams that need those should keep a full secrets manager.",
  },
]

function Panel({
  title,
  meta,
  children,
  accent,
}: {
  title: string
  meta: string
  children: React.ReactNode
  accent?: boolean
}) {
  return (
    <div
      className={
        accent
          ? "min-w-0 overflow-hidden rounded-lg border border-[#8f8cff] bg-[#141228]"
          : "min-w-0 overflow-hidden rounded-lg border border-[#2c2a2a] bg-[#1b1919]"
      }
    >
      <div
        className={
          accent
            ? "flex h-9 items-center justify-between border-b border-[#8f8cff]/40 px-3.5 text-[11px] text-[#8f8cff]"
            : "flex h-9 items-center justify-between border-b border-[#2c2a2a] px-3.5 text-[11px] text-[#a3a3a3]"
        }
      >
        <span>{title}</span>
        <span>{meta}</span>
      </div>
      <div className="overflow-x-auto px-3.5 py-3.5 whitespace-pre">{children}</div>
    </div>
  )
}

function Arrow() {
  return (
    <div
      aria-hidden="true"
      className="flex items-center justify-center text-[#8f8cff] max-lg:h-8 max-lg:rotate-90"
    >
      <span className="h-px w-6 border-t border-dashed border-[#8f8cff]" />
      <span className="size-1.5 bg-[#8f8cff]" />
    </div>
  )
}

// Dark in both themes, like a terminal.
export function Secrets() {
  return (
    <section
      id="secrets"
      data-cta-location="secrets"
      className="flex scroll-mt-4 flex-col gap-10 bg-[#0a0a0a] section-frame py-16 text-white [--button-focus:#8f8cff] md:gap-14 md:py-20 xl:py-30"
    >
      <SectionHeading
        claim="Your .env stays in sync and out of agent output."
        reason="Agents run your app with the keys set and never print them."
        reasonClassName="text-[#8f8cff]"
      />

      <figure
        aria-label="Illustration: a local .env file is pushed to an encrypted env group, and an agent runs the app with it while printing variable names only."
        className="grid items-stretch gap-2 font-mono text-xs leading-5 text-[#d4d4d4] lg:grid-cols-[minmax(0,1fr)_40px_minmax(0,0.8fr)_40px_minmax(0,1.2fr)] lg:gap-0"
      >
        <Panel title=".env" meta="~/acme/checkout">
          {
            "DATABASE_URL=postgres://db.acme…\nSTRIPE_SECRET_KEY=sk_live_51H…\nRESEND_API_KEY=re_8f2k…\nPORT=3000\n\n"
          }
          <span className="text-white">$ sniptide env push checkout</span>
        </Panel>
        <Arrow />
        <Panel title="Env group checkout" meta="encrypted" accent>
          {variables.map((name) => (
            <span key={name} className="flex justify-between gap-4">
              <span>{name}</span>
              <span className="text-[#8f8cff]">••••••••••</span>
            </span>
          ))}
        </Panel>
        <Arrow />
        <Panel title="claude" meta="~/acme/checkout">
          <span className="text-[#8f8cff]">● </span>
          <span className="text-white">sniptide env run checkout -- bun dev</span>
          {"\n  ⎿ Ready on http://localhost:3000\n"}
          <span className="text-[#8f8cff]">● </span>
          <span className="text-white">sniptide env pull checkout --json</span>
          {"\n  ⎿ wrote .env · "}
          <span className="text-[#a3a3a3]">{variables.slice(0, 2).join(", ")}, …</span>
        </Panel>
      </figure>

      <ul className="grid gap-x-5 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
        {facts.map((fact) => (
          <li key={fact.title} className="flex flex-col gap-1.5 border-t border-[#262626] pt-4">
            <h3 className="text-base leading-5.5 font-semibold">{fact.title}</h3>
            <p className="text-base leading-6 text-[#a3a3a3]">{fact.text}</p>
          </li>
        ))}
      </ul>

      <a
        href={docsPages.envSync}
        className="raised-button flex h-10 items-center self-start border border-[#3a3737] bg-[#0a0a0a] [--button-depth:#3a3737] px-4 text-sm leading-5 font-medium hover:bg-white/5"
      >
        Read the env sync guide
      </a>
    </section>
  )
}
