import { documentation } from "@/lib/agent-docs"
import { links } from "@/lib/links"

// The page's one primary action, "Create a paste", closes the page as it opens it in the hero.
export function Cta() {
  return (
    <section
      data-cta-location="cta"
      className="flex h-110 flex-col justify-center gap-4 overflow-clip section-frame bg-[#2a26ec] md:h-135 md:gap-4.5 dark:cta-dusk"
    >
      <h2 className="font-heading text-4xl leading-10 font-medium tracking-[-0.03em] text-white md:text-[44px] md:leading-12">
        Start the library your agents reuse.
      </h2>
      <p className="max-w-120 text-base leading-6.5 text-[#d9d8ff]">
        Save your first pattern in the app, then connect Claude Code or Cursor with one sign-in. Use
        sniptide.com, or run it on your own server.
      </p>
      <div className="flex flex-wrap items-center gap-2.5 pt-2.5">
        <a
          href={links.newPaste}
          className="raised-button flex h-11 items-center gap-2 bg-white [--button-depth:#b6b4ff] [--button-focus:white] px-4.5 text-[15px] leading-5 font-medium text-[#2a26ec] hover:bg-white/90"
        >
          <span className="size-2.25 bg-[#2a26ec]" />
          Create a paste
        </a>
        <a
          href={documentation.mcp.url}
          className="raised-button flex h-11 items-center border border-white/40 bg-transparent [--button-depth:transparent] [--button-focus:white] px-4.5 text-[15px] leading-5 font-medium text-white hover:bg-white/10"
        >
          Connect over MCP
        </a>
      </div>
    </section>
  )
}
