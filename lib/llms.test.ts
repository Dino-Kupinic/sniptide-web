import { describe, expect, test } from "bun:test"
import { llmsFullTxt, llmsTxt } from "./llms"

const linkPattern = /\]\((\S+?)\)/g

describe("llms.txt", () => {
  test("follows the llmstxt.org shape", () => {
    const lines = llmsTxt.split("\n")
    expect(lines[0]).toBe("# Sniptide")
    expect(lines[2]?.startsWith("> ")).toBe(true)
    expect(llmsTxt.endsWith("\n")).toBe(true)
  })

  test("only links to absolute https URLs", () => {
    const urls = [...llmsTxt.matchAll(linkPattern)].map((match) => match[1] ?? "")
    expect(urls.length).toBeGreaterThan(5)
    for (const url of urls) expect(url.startsWith("https://")).toBe(true)
  })

  test("points to the full version, which starts the same way", () => {
    expect(llmsTxt).toContain("https://sniptide.com/llms-full.txt")
    expect(llmsFullTxt.split("\n")[0]).toBe("# Sniptide")
    expect(llmsFullTxt.endsWith("\n")).toBe(true)
  })

  test("routes readers to canonical guides without a duplicated tool catalog", () => {
    for (const document of [llmsTxt, llmsFullTxt]) {
      expect(document).toContain("## When to use Sniptide")
      expect(document).toContain("Capture files or folders and restore their relative paths")
      expect(document).toContain("Share code as a paste")
      expect(document).toContain("use a full secrets manager")
      expect(document).toContain("https://docs.sniptide.com/mcp")
      expect(document).toContain("https://docs.sniptide.com/oauth")
      expect(document).toContain("https://docs.sniptide.com/api-tokens")
      expect(document).not.toContain("Agent OAuth is not supported")
      expect(document).not.toContain("search_snippets")
    }
  })
})
