import secretsDark from "@/assets/landing/secrets-dark.webp"
import { Screenshot } from "@/components/screenshot"
import { SectionHeading } from "@/components/section-heading"
import { docsPages } from "@/lib/links"

const variables = ["DATABASE_URL", "STRIPE_SECRET_KEY", "RESEND_API_KEY", "PORT"]

// The encryption facts mirror lib/env/crypto.ts in the app repo.
const facts = [
  {
    title: "AES-256-GCM for every value",
    text: "Each value is encrypted with its own random nonce before it is written to the database, and its auth tag rejects any value that was changed.",
  },
  {
    title: "A key the database never holds",
    text: "The key is derived with HKDF-SHA256 from a secret in your server's environment, so a copy of the database alone cannot be decrypted.",
  },
  {
    title: "Bound to its group and name",
    text: "A value is tied to its group and variable name, so one copied into another row fails to decrypt instead of moving.",
  },
  {
    title: "Never printed",
    text: "The CLI and its JSON output name variables and never show values, so agent transcripts stay clean.",
  },
  {
    title: "Shown only on request",
    text: "The app masks every value until you choose to reveal or copy that one.",
  },
  {
    title: "Lighter than a vault",
    text: "There is no key rotation or audit trail. Teams that need those should keep a full secrets manager.",
  },
]

function Terminal() {
  return (
    <div className="min-w-0 overflow-hidden rounded-lg border border-[#2c2a2a] bg-[#1b1919] font-mono text-xs leading-5 text-[#d4d4d4] lg:shadow-[0_24px_48px_-12px_rgb(0_0_0/0.7)]">
      <div className="flex h-9 items-center justify-between border-b border-[#2c2a2a] px-3.5 text-[11px] text-[#a3a3a3]">
        <span>claude</span>
        <span>~/acme/checkout</span>
      </div>
      <div className="overflow-x-auto px-3.5 py-3.5 whitespace-pre">
        <span className="text-[#8f8cff]">● </span>
        <span className="text-white">sniptide env run checkout -- bun dev</span>
        {"\n  ⎿ Ready on http://localhost:3000\n"}
        <span className="text-[#8f8cff]">● </span>
        <span className="text-white">sniptide env pull checkout --json</span>
        {"\n  ⎿ wrote .env · "}
        <span className="text-[#a3a3a3]">{variables.slice(0, 2).join(", ")}, …</span>
      </div>
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

      {/* The real env group page, with the agent's terminal laid over its corner. */}
      <figure className="relative flex flex-col gap-3 lg:pb-16">
        <Screenshot
          light={secretsDark}
          alt="The checkout env group in Sniptide with four variables whose values stay hidden: DATABASE_URL, STRIPE_SECRET_KEY, RESEND_API_KEY and PORT."
          crop
          className="border-[#262626] lg:w-[78%]"
        />
        <div className="lg:absolute lg:right-0 lg:bottom-0 lg:w-[44%]">
          <Terminal />
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
        className="raised-button flex h-10 items-center self-start border border-[#3a3737] bg-[#0a0a0a] [--button-depth:#3a3737] px-4 text-sm leading-5 font-medium hover:bg-white/5"
      >
        Read the env sync guide
      </a>
    </section>
  )
}
