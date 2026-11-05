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

  test("the complete artwork uses the dither fill, including its edges", () => {
    const section = WorksWith()
    const marquee = section.props.children[1]
    expect(marquee.props.fill).toBe("hatched")
    expect(marquee.props.outline).toBe(false)
    expect(marquee.props.strength).toBe(0.12)
    expect(marquee.props.effect).toBe("none")
    expect(tools.every((tool) => tool.ratio > 2)).toBe(true)
  })
})
