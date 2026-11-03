import { PixelCanvas } from "@/components/pixel-canvas"
import { SectionHeading } from "@/components/section-heading"
import { docsPages, links } from "@/lib/links"

// The pink section looks the same in both themes. Every line of text uses the ink #2b0a1f, at
// full strength for names and at 80% for descriptions (about 8:1 on the pink), and only the large
// second line of the heading uses #a04577. The grain stays faint so it never sits under text at
// a strength that matters.

type Feature = { title: string; token: string; text: string; href?: string }

const groups: { title: string; features: Feature[] }[] = [
  {
    title: "Share",
    features: [
      {
        title: "Expiry",
        token: "1h · 1d · 1w · 1m",
        text: "Pick how long a link lives, or keep it forever.",
        href: docsPages.sharing,
      },
      {
        title: "Burn after read",
        token: "410 Gone",
        text: "The first person to open the link is the last.",
        href: docsPages.sharing,
      },
      {
        title: "Password",
        token: "unlock",
        text: "Visitors enter it before they see a single line.",
        href: docsPages.sharing,
      },
      {
        title: "Invites",
        token: "view · edit",
        text: "Share a private paste with teammates by email or username.",
        href: docsPages.sharing,
      },
      {
        title: "Raw links",
        token: "/raw",
        text: "Every file is one curl away as plain text, unless you switch it off.",
        href: docsPages.sharing,
      },
    ],
  },
  {
    title: "Keep track",
    features: [
      {
        title: "Revisions",
        token: "rev 3 of 3",
        text: "Every save is a revision you can compare side by side and roll back.",
        href: docsPages.revisions,
      },
      {
        title: "View counts",
        token: "349 views",
        text: "Total and unique opens per day, without crawlers or link previews.",
        href: docsPages.analytics,
      },
      {
        title: "Analytics without cookies",
        token: "no cookies",
        text: "Visitors, copies and referrers, counted in your own database.",
        href: docsPages.analytics,
      },
      {
        title: "Key warnings",
        token: "sk_live_…",
        text: "The editor flags anything that looks like a key before you share it.",
      },
    ],
  },
  {
    title: "Bring in and out",
    features: [
      {
        title: "API and SDKs",
        token: "TS · Python",
        text: "A REST API described in OpenAPI, with SDKs that retry safely.",
        href: docsPages.sdks,
      },
      {
        title: "Gist import",
        token: "gist.github.com",
        text: "Bring a gist over with all of its files and their names.",
        href: docsPages.importGist,
      },
      {
        title: "Link previews",
        token: "Slack · Discord · X",
        text: "Shared links unfurl a card with the first lines of code.",
        href: `${docsPages.sharing}#link-previews-and-channels`,
      },
      {
        title: "Embed and print",
        token: "<iframe>",
        text: "Put a paste in your docs, or print it with its highlighting.",
      },
    ],
  },
]

function FeatureRow({ feature }: { feature: Feature }) {
  const body = (
    <>
      <span className="flex items-baseline justify-between gap-4">
        <span className="text-base leading-6 font-semibold">{feature.title}</span>
        <code className="shrink-0 font-mono text-[13px] leading-5">{feature.token}</code>
      </span>
      <span className="text-base leading-6 text-[#2b0a1f]/80">{feature.text}</span>
    </>
  )
  return (
    <li className="border-t border-[#2b0a1f]/20">
      {feature.href ? (
        <a
          href={feature.href}
          className="flex flex-col gap-1 py-4 decoration-[#2b0a1f]/50 underline-offset-4 hover:[&>span:first-child>span]:underline"
        >
          {body}
        </a>
      ) : (
        <div className="flex flex-col gap-1 py-4">{body}</div>
      )}
    </li>
  )
}

export function Sharing() {
  return (
    <section
      id="sharing"
      data-cta-location="sharing"
      className="relative flex scroll-mt-4 flex-col gap-10 overflow-clip bg-[#fbd3ea] section-frame py-16 text-[#2b0a1f] [--button-focus:#2b0a1f] md:gap-14 md:py-20 xl:py-30"
    >
      <PixelCanvas kind="grain" className="absolute inset-0 size-full opacity-20" />

      <SectionHeading
        className="relative"
        claim="When a person needs it, send a link."
        reason="Everything around the link is already built in."
        reasonClassName="text-[#a04577]"
      />

      <div className="relative grid gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
        {groups.map((group) => (
          <div key={group.title} className="flex min-w-0 flex-col gap-3">
            <h3 className="font-heading text-2xl leading-8 font-medium tracking-[-0.02em]">
              {group.title}
            </h3>
            <ul className="flex flex-col border-b border-[#2b0a1f]/20">
              {group.features.map((feature) => (
                <FeatureRow key={feature.title} feature={feature} />
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="relative flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <a
          href={links.newPaste}
          className="raised-button flex h-11 shrink-0 items-center gap-2 bg-[#2b0a1f] [--button-depth:#160510] px-4 text-sm leading-5 font-medium text-[#fbd3ea] hover:bg-[#3d1230]"
        >
          <span className="size-2 bg-[#fbd3ea]" />
          Create a paste
        </a>
        <a
          href={docsPages.sharing}
          className="text-base leading-6 font-medium underline decoration-[#2b0a1f]/40 underline-offset-4 hover:decoration-[#2b0a1f]"
        >
          Read how sharing works
        </a>
      </div>
    </section>
  )
}
