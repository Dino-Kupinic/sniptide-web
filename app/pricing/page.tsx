import { BanIcon, ChartColumnIcon, CheckIcon, CookieIcon } from "lucide-react"
import type { ReactNode } from "react"
import type { Metadata } from "next"
import { BlogShell } from "@/components/blog/blog-shell"
import { primaryButton, secondaryButton } from "@/components/blog/buttons"
import { LogoMark } from "@/components/brand"
import { GitHubMark } from "@/components/github-mark"
import { LifeField } from "@/components/life-field"
import { analyticsInEu, cdn, emailProvider, hosting } from "@/lib/legal"
import { links } from "@/lib/links"

export const metadata: Metadata = {
  alternates: { canonical: "/pricing" },
  title: "Pricing",
  description: "Sniptide Cloud and self-hosted Sniptide are both free. There is no paid plan yet.",
}

const installCommand = "curl -fsSL https://sniptide.com/install.sh | sh"

// Sniptide has no paid plan, so the page states that plainly and names no prices or tiers.
// Sniptide Cloud is the hosted app at sniptide.com, which runs on one server, so the page claims
// nothing about regions or redundancy. The rows below follow the app's self-hosting docs:
// ACCOUNT_STORAGE_BYTES and ACCOUNT_PASTE_LIMIT accept "unlimited", and SNIPTIDE_EDITION=selfhost
// marks public links noindex while the cloud edition lets search engines list them.
type Cell = string | true

const rows: { label: string; cloud: Cell; selfHost: Cell }[] = [
  { label: "Price", cloud: "Free", selfHost: "Free, plus your server" },
  { label: "Who runs the server", cloud: "We do", selfHost: "You do" },
  {
    label: "Where it runs",
    cloud: `${hosting.provider}, ${hosting.country}`,
    selfHost: "Wherever you choose",
  },
  {
    label: "Pastes, collections, MCP server, CLI and extensions",
    cloud: true,
    selfHost: true,
  },
  { label: "End-to-end encrypted pastes and env sync", cloud: true, selfHost: true },
  {
    label: "Storage and paste limits",
    cloud: "Per account, shown in Settings",
    selfHost: "You set them, or none",
  },
  { label: "Upgrades", cloud: "Applied for you", selfHost: "You pull each release" },
  {
    label: "Public pastes in search results",
    cloud: true,
    selfHost: "Off, links are noindex",
  },
  { label: "No ads", cloud: true, selfHost: true },
  { label: "Open source under AGPL-3.0", cloud: true, selfHost: true },
]

const questions: { question: string; answer: ReactNode }[] = [
  {
    question: "Will Sniptide Cloud stay free?",
    answer:
      "Paid plans may come later for people who need more than a free account holds, such as more storage. No plan or price is decided yet. If one comes, this page will say what it includes and what stays free.",
  },
  {
    question: "Will self-hosting stay free?",
    answer:
      "Yes. Sniptide is open source under the AGPL-3.0 license and will stay open source, so running it on your own server costs only the server.",
  },
  {
    question: "Where does Sniptide Cloud keep my data?",
    answer: (
      <>
        On a server from {hosting.provider} in {hosting.country}. {cdn.provider} sits in front of it
        and {emailProvider} delivers its emails, and both are companies in the United States. The{" "}
        <a href="/privacy" className="text-link underline underline-offset-2">
          privacy policy
        </a>{" "}
        lists every service that handles your data and why.
      </>
    ),
  },
  {
    question: "Does Sniptide show ads?",
    answer:
      "No. Neither Sniptide Cloud nor a server you run shows ads, and nobody who opens one of your links sees any.",
  },
]

// Germany's flag, drawn rather than an emoji, which some systems show as the letters "DE".
function GermanFlag() {
  return (
    <svg aria-hidden="true" viewBox="0 0 5 3" className="h-3 w-5 shrink-0 rounded-[2px] border">
      <rect width="5" height="1" fill="#000000" />
      <rect y="1" width="5" height="1" fill="#DD0000" />
      <rect y="2" width="5" height="1" fill="#FFCE00" />
    </svg>
  )
}

// Facts a visitor weighs before signing up, each backed by the privacy policy or the repository.
// The analytics line shows only while the site's PostHog host is in the EU.
const trust: { icon: ReactNode; label: string; href?: string }[] = [
  { icon: <GermanFlag />, label: `Servers in ${hosting.country}` },
  ...(analyticsInEu
    ? [{ icon: <ChartColumnIcon className="size-4" />, label: "Analytics stored in the EU" }]
    : []),
  { icon: <CookieIcon className="size-4" />, label: "No analytics cookies unless you allow them" },
  { icon: <BanIcon className="size-4" />, label: "No ads" },
  { icon: <GitHubMark className="size-4" />, label: "Open source", href: links.github },
]

// The hosted app: the sign-in screen's Game of Life behind the logo and the address it lives at.
function CloudVisual() {
  return (
    <div className="relative h-44 overflow-hidden border-b bg-sidebar">
      <LifeField
        live="#2a26ec"
        trail="#8f8cff"
        density={0.14}
        className="opacity-50 dark:opacity-60"
      />
      <div className="absolute inset-0 flex items-center justify-center gap-3 px-5">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-lg border bg-background">
          <LogoMark className="h-5 w-[21px] text-[#2a26ec] dark:text-white" />
        </span>
        <span className="flex h-8 items-center rounded-md border bg-background px-2.5 font-mono text-xs">
          sniptide.com
        </span>
      </div>
    </div>
  )
}

// Your own server: the one command that installs it, as the vision page and the docs give it.
function SelfHostVisual() {
  return (
    <div className="flex h-44 flex-col justify-center gap-1 border-b bg-[#0c0b0b] px-5 font-mono text-xs leading-5 text-[#f4f4f4]">
      <p className="break-all">
        <span className="text-[#8a8a8a]">$ </span>
        {installCommand}
      </p>
      <p className="text-[#a3a3a3]">
        <span
          aria-hidden="true"
          className="inline-block h-3.5 w-1.75 translate-y-0.5 bg-[#f4f4f4] motion-safe:animate-pulse"
        />
      </p>
    </div>
  )
}

const plans = [
  {
    name: "Sniptide Cloud",
    summary: "Sign up at sniptide.com and start saving snippets. We run the server for you.",
    visual: <CloudVisual />,
    action: { label: "Get started", href: links.signUp, className: primaryButton },
  },
  {
    name: "Your own server",
    summary: "Install Sniptide with one command and pay only for the server it runs on.",
    visual: <SelfHostVisual />,
    action: { label: "Self-hosting guide", href: links.selfHost, className: secondaryButton },
  },
]

function Value({ cell }: { cell: Cell }) {
  if (cell === true) {
    return (
      <>
        <CheckIcon aria-hidden="true" className="size-4 text-link" />
        <span className="sr-only">Included</span>
      </>
    )
  }
  return cell
}

export default function Page() {
  return (
    <BlogShell>
      <div
        data-cta-location="pricing"
        className="mx-auto w-full max-w-[1440px] px-5 pt-12 pb-12 md:px-10 md:pt-20 md:pb-16 lg:px-30"
      >
        <header className="flex max-w-[40rem] flex-col gap-4">
          <h1 className="font-heading text-[34px] leading-9.5 font-medium tracking-[-0.03em] md:text-5xl md:leading-13">
            Pricing
          </h1>
          <p className="text-lg leading-7 text-pretty text-muted-foreground">
            Sniptide is free on Sniptide Cloud and on your own server. There is no paid plan yet.
          </p>
        </header>

        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm leading-5">
          {trust.map((item) => (
            <li key={item.label} className="flex items-center gap-2">
              <span aria-hidden="true" className="flex text-muted-foreground">
                {item.icon}
              </span>
              {item.href ? (
                <a href={item.href} className="underline underline-offset-2 hover:no-underline">
                  {item.label}
                </a>
              ) : (
                item.label
              )}
            </li>
          ))}
        </ul>

        <ul className="mt-10 grid gap-4 md:mt-12 md:grid-cols-2">
          {plans.map((plan) => (
            <li
              key={plan.name}
              className="flex min-w-0 flex-col overflow-hidden rounded-lg border bg-card"
            >
              {plan.visual}
              <div className="flex flex-1 flex-col gap-6 p-5 md:p-6">
                <div className="flex flex-col gap-2">
                  <h2 className="text-xl leading-7 font-semibold">{plan.name}</h2>
                  <p className="font-heading text-5xl leading-13 font-medium tracking-[-0.03em]">
                    Free
                  </p>
                  <p className="max-w-120 text-base leading-6.5 text-pretty text-muted-foreground">
                    {plan.summary}
                  </p>
                </div>
                <a
                  href={plan.action.href}
                  className={`${plan.action.className} mt-auto self-start`}
                >
                  {plan.action.label}
                </a>
              </div>
            </li>
          ))}
        </ul>

        <section aria-labelledby="compare" className="mt-16 md:mt-20">
          <h2
            id="compare"
            className="font-heading text-2xl leading-8 font-medium tracking-[-0.02em]"
          >
            What each one includes
          </h2>
          <div className="mt-6">
            <table className="w-full table-fixed border-collapse text-left text-[0.9375rem] leading-6">
              <thead>
                <tr className="border-b">
                  <th scope="col" className="w-[40%] py-3 pr-4 font-medium max-sm:w-[36%]">
                    <span className="sr-only">Feature</span>
                  </th>
                  <th scope="col" className="py-3 pr-4 font-medium">
                    Sniptide Cloud
                  </th>
                  <th scope="col" className="py-3 font-medium">
                    Your own server
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-b">
                    <th scope="row" className="py-3 pr-4 font-normal text-muted-foreground">
                      {row.label}
                    </th>
                    <td className="py-3 pr-4">
                      <Value cell={row.cloud} />
                    </td>
                    <td className="py-3">
                      <Value cell={row.selfHost} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="questions" className="mt-16 max-w-[40rem] md:mt-20">
          <h2
            id="questions"
            className="font-heading text-2xl leading-8 font-medium tracking-[-0.02em]"
          >
            Questions
          </h2>
          <dl className="mt-6 flex flex-col gap-6">
            {questions.map((item) => (
              <div key={item.question} className="flex flex-col gap-1.5">
                <dt className="text-base leading-6.5 font-medium">{item.question}</dt>
                <dd className="text-base leading-6.5 text-pretty text-muted-foreground">
                  {item.answer}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </BlogShell>
  )
}
