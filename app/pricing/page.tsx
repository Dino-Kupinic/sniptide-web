import { CheckIcon } from "lucide-react"
import type { Metadata } from "next"
import { BlogShell } from "@/components/blog/blog-shell"
import { primaryButton, secondaryButton } from "@/components/blog/buttons"
import { links } from "@/lib/links"

export const metadata: Metadata = {
  alternates: { canonical: "/pricing" },
  title: "Pricing",
  description:
    "Sniptide is free on sniptide.com and on your own server. There is no paid plan yet.",
}

// Sniptide has no paid plan, so the page states that plainly and names no prices or tiers. The
// self-hosted limits are the ACCOUNT_STORAGE_BYTES and ACCOUNT_PASTE_LIMIT settings in the app's
// self-hosting configuration, which accept "unlimited".
const plans = [
  {
    name: "sniptide.com",
    summary: "Sign up and start saving snippets. We run the server.",
    points: [
      "Every feature, from the MCP server and the CLI to end-to-end encrypted pastes",
      "A storage and paste limit per account, shown in Settings under Usage",
      "No ads on any paste",
    ],
    action: { label: "Get started", href: links.signUp, className: primaryButton },
  },
  {
    name: "Your own server",
    summary: "Install Sniptide with one command and pay only for the server it runs on.",
    points: [
      "The same code that runs sniptide.com",
      "Storage and paste limits you set yourself, or none at all",
      "Open source under the AGPL-3.0 license",
    ],
    action: { label: "Self-hosting guide", href: links.selfHost, className: secondaryButton },
  },
]

const questions = [
  {
    question: "Will sniptide.com stay free?",
    answer:
      "Paid plans may come later for people who need more than a free account holds, such as more storage. No plan or price is decided yet. If one comes, this page will say what it includes and what stays free.",
  },
  {
    question: "Will self-hosting stay free?",
    answer:
      "Yes. Sniptide is open source under the AGPL-3.0 license and will stay open source, so running it on your own server costs only the server.",
  },
  {
    question: "Does Sniptide show ads?",
    answer:
      "No. Neither sniptide.com nor a server you run shows ads, and nobody who opens one of your links sees any.",
  },
]

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
            Sniptide is free on sniptide.com and on your own server. There is no paid plan yet.
          </p>
        </header>

        <ul className="mt-10 grid border-t md:mt-12 md:grid-cols-2">
          {plans.map((plan, index) => (
            <li
              key={plan.name}
              className={
                index === 0
                  ? "flex min-w-0 flex-col gap-6 py-8 md:border-r md:py-10 md:pr-12"
                  : "flex min-w-0 flex-col gap-6 border-t py-8 md:border-t-0 md:py-10 md:pl-12"
              }
            >
              <div className="flex flex-col gap-2">
                <h2 className="text-xl leading-7 font-semibold">{plan.name}</h2>
                <p className="font-heading text-5xl leading-13 font-medium tracking-[-0.03em]">
                  Free
                </p>
                <p className="max-w-120 text-base leading-6.5 text-pretty text-muted-foreground">
                  {plan.summary}
                </p>
              </div>
              <ul className="flex flex-col gap-3 text-[0.9375rem] leading-6">
                {plan.points.map((point) => (
                  <li key={point} className="flex gap-2.5">
                    <CheckIcon aria-hidden="true" className="mt-1 size-4 shrink-0 text-link" />
                    {point}
                  </li>
                ))}
              </ul>
              <a href={plan.action.href} className={`${plan.action.className} self-start`}>
                {plan.action.label}
              </a>
            </li>
          ))}
        </ul>

        <section aria-labelledby="questions" className="max-w-[40rem] pt-4 md:pt-6">
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
