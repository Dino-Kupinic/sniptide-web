import Link from "next/link"
import { LogoMark, Wordmark } from "@/components/brand"
import type { AgentDocument } from "@/lib/agent-docs"

export function AgentDocPage({ document }: { document: AgentDocument }) {
  return (
    <div className="min-h-dvh text-[#1b1919] dark:text-[#f5f5f5]">
      <a href="#content" className="sr-only focus:not-sr-only focus:block focus:p-4">
        Skip to content
      </a>
      <header className="border-b border-[#e8e8e8] px-5 py-4 md:px-10 dark:border-[#222222]">
        <Link href="/home" aria-label="Sniptide home" className="inline-flex items-center gap-2">
          <LogoMark className="h-6 w-6 text-[#2a26ec] dark:text-white" />
          <Wordmark className="h-5 w-28" />
        </Link>
        <nav aria-label="Documentation" className="mt-5 flex flex-wrap gap-5 text-sm">
          {(
            [
              ["/docs", "Docs"],
              ["/docs/mcp", "MCP server"],
              ["/docs/auth", "Authentication"],
            ] as const
          ).map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={document.path === href ? "page" : undefined}
              className="underline-offset-4 hover:underline aria-[current=page]:underline"
            >
              {label}
            </Link>
          ))}
        </nav>
      </header>
      <main id="content" className="mx-auto max-w-4xl px-5 py-12 md:px-10 md:py-20">
        <h1 className="font-heading text-4xl font-medium tracking-tight md:text-5xl">
          {document.title}
        </h1>
        <p className="mt-5 text-lg leading-7 text-[#6b6b6b] dark:text-[#9a9a9a]">
          {document.description}
        </p>
        {document.sections.map((section) => (
          <section key={section.title} className="mt-10 space-y-4 text-base leading-7">
            <h2 className="font-heading text-2xl font-medium tracking-tight">{section.title}</h2>
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.items && (
              <ul className="list-disc space-y-3 pl-5">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
            {section.code && (
              <pre className="overflow-x-auto rounded-lg border border-[#e8e8e8] bg-[#f5f5f5] p-4 text-sm leading-6 dark:border-[#333] dark:bg-[#161616]">
                <code>{section.code}</code>
              </pre>
            )}
            {section.links && (
              <ul className="space-y-2">
                {section.links.map(({ label, href }) => (
                  <li key={href}>
                    <a
                      href={href}
                      className="text-[#2a26ec] underline underline-offset-4 dark:text-[#8f8cff]"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </main>
    </div>
  )
}
