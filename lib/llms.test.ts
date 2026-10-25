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

  test("names the nine MCP tools in both files", () => {
    for (const tool of [
      "search_snippets",
      "read_snippet",
      "fetch_collection",
      "create_snippet",
      "update_snippet",
      "list_collections",
      "create_collection",
      "update_snippet_settings",
      "trash_snippet",
    ]) {
      expect(llmsTxt).toContain(tool)
      expect(llmsFullTxt).toContain(tool)
    }
  })
})
