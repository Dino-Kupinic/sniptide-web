import { describe, expect, test } from "bun:test"
import { renderToStaticMarkup } from "react-dom/server"
import { LogoMarquee } from "@/components/dithercn/logo-marquee"
import { tools, WorksWith } from "@/components/works-with"

describe("compatible tool artwork", () => {
  test("links expose tool names without adding typeset brand labels", () => {
    const markup = renderToStaticMarkup(<LogoMarquee logos={tools} />)
    for (const tool of tools) {
      expect(markup).toContain(`aria-label="${tool.alt}"`)
      expect(markup).toContain(`href="${tool.href}"`)
      expect(markup).not.toContain(`>${tool.alt}</span>`)
    }
    expect(markup).not.toContain("<button")
    expect(markup).not.toContain("hover:opacity-100")
  })

  test("the first dithercn example supplies the defaults, with scan enabled", () => {
    const section = WorksWith()
    const marquee = section.props.children[1]
    expect(marquee.props.fill).toBeUndefined()
    expect(marquee.props.outline).toBeUndefined()
    expect(marquee.props.strength).toBeUndefined()
    expect(marquee.props.effect).toBe("scan")
    expect(tools.every((tool) => tool.ratio > 0)).toBe(true)
  })
})
