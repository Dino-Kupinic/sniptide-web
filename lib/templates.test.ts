import { describe, expect, test } from "bun:test"
import { readdirSync, statSync } from "node:fs"
import { join, relative } from "node:path"
import sitemap from "@/app/sitemap"
import { GET as getJson } from "@/app/templates/json/[name]/route"
import { GET as getMarkdown } from "@/app/templates/md/[name]/route"
import { getPosts } from "@/lib/blog-source"
import { siteUrl } from "@/lib/site"
import { getTemplates, readTemplateFiles, templatesDir } from "@/lib/template-source"
import {
  fence,
  languageFor,
  matchesTemplateQuery,
  nameFromPath,
  templateEditorUrl,
  templateStructuredData,
} from "@/lib/templates"

const templates = getTemplates()

function filesIn(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry)
    return statSync(path).isDirectory() ? filesIn(path) : [path]
  })
}

const params = (name: string) => ({ params: Promise.resolve({ name }) })

describe("template content", () => {
  test("every template is published", () => {
    expect(templates.map((template) => template.name).sort()).toEqual([
      "agents-md",
      "brand-voice-guide",
      "caddyfile-reverse-proxy",
      "claude-code-skill",
      "claude-md",
      "cursor-rules",
      "docker-compose-postgres",
      "env-example",
      "github-actions-node-ci",
      "github-issue-templates",
      "launch-announcement",
      "llms-txt",
      "mcp-json",
      "nextjs-dockerfile",
      "prd-for-agents",
      "release-notes",
      "robots-txt-ai-crawlers",
      "user-stories",
    ])
  })

  test("every folder is a template", () => {
    const folders = readdirSync(templatesDir).filter((entry) =>
      statSync(join(templatesDir, entry)).isDirectory(),
    )
    expect(folders.sort()).toEqual(templates.map((template) => template.name).sort())
  })

  test("files/ holds exactly the files the frontmatter lists", () => {
    for (const template of templates) {
      const dir = join(templatesDir, template.name, "files")
      const onDisk = filesIn(dir).map((path) => relative(dir, path))
      expect(onDisk.sort()).toEqual([...template.files].sort())
      for (const file of readTemplateFiles(template)) expect(file.content.trim()).not.toBe("")
    }
  })

  test("related templates and posts exist", () => {
    const names = new Set(templates.map((template) => template.name))
    const posts = new Set(getPosts().map((post) => post.slug))
    for (const template of templates) {
      for (const name of template.related) {
        expect(names.has(name)).toBe(true)
        expect(name).not.toBe(template.name)
      }
      if (template.post) expect(posts.has(template.post)).toBe(true)
    }
  })

  test("titles are unique, since each page answers its own query", () => {
    const titles = templates.map((template) => template.title)
    expect(new Set(titles).size).toBe(titles.length)
  })

  test("every department has a template", () => {
    const departments = new Set(templates.map((template) => template.department))
    expect([...departments].sort()).toEqual(["engineering", "marketing", "product"])
  })

  test("the sitemap lists the directory and every template", () => {
    const urls = sitemap().map((entry) => entry.url)
    expect(urls).toContain(`${siteUrl}/templates`)
    for (const template of templates)
      expect(urls).toContain(`${siteUrl}/templates/${template.name}`)
  })
})

describe("template helpers", () => {
  test("search matches every word across title, category and file names", () => {
    const template = templates.find((item) => item.name === "docker-compose-postgres")
    if (!template) throw new Error("Missing template")
    expect(matchesTemplateQuery(template, "compose.yaml")).toBe(true)
    expect(matchesTemplateQuery(template, "docker deploy")).toBe(true)
    expect(matchesTemplateQuery(template, "docker cursor")).toBe(false)
    expect(matchesTemplateQuery(template, "  ")).toBe(true)
  })

  test("names come from the folder", () => {
    expect(nameFromPath("claude-md/template.mdx")).toBe("claude-md")
  })

  test("languages come from the file name", () => {
    expect(languageFor("Dockerfile")).toBe("dockerfile")
    expect(languageFor(".env.example")).toBe("dotenv")
    expect(languageFor(".cursor/rules/project.mdc")).toBe("markdown")
    expect(languageFor(".github/workflows/ci.yml")).toBe("yaml")
    expect(languageFor("Caddyfile")).toBe("text")
  })

  test("a fence outlasts the backticks inside the file", () => {
    const content = "Run:\n\n```bash\nnpm test\n```\n"
    const block = fence(content, "markdown")
    expect(block.startsWith("````markdown\n")).toBe(true)
    expect(block.endsWith("\n````")).toBe(true)
  })

  test("Use template opens the app's editor with the template's name", () => {
    expect(templateEditorUrl("claude-md")).toEndWith("/new?template=claude-md")
  })

  test("structured data describes the code and the breadcrumb", () => {
    const template = templates[0]
    if (!template) throw new Error("No templates")
    const graph = templateStructuredData(template, readTemplateFiles(template))["@graph"]
    expect(graph.map((node) => node["@type"])).toEqual(["SoftwareSourceCode", "BreadcrumbList"])
  })
})

describe("template twins", () => {
  test("the Markdown twin holds the answer, every file and the explanation", async () => {
    const response = await getMarkdown(
      new Request(`${siteUrl}/templates/claude-md.md`),
      params("claude-md"),
    )
    expect(response.headers.get("content-type")).toBe("text/markdown; charset=utf-8")
    expect(response.headers.get("link")).toBe(`<${siteUrl}/templates/claude-md>; rel="canonical"`)
    const body = await response.text()
    expect(body.startsWith("# CLAUDE.md template\n")).toBe(true)
    expect(body).toContain("### CLAUDE.md")
    expect(body).toContain("## What each section does")
  })

  test("the JSON twin carries the files the editor opens", async () => {
    const response = await getJson(
      new Request(`${siteUrl}/templates/cursor-rules.json`),
      params("cursor-rules"),
    )
    expect(response.headers.get("access-control-allow-origin")).toBe("*")
    const body = await response.json()
    expect(body.title).toBe("Cursor rules examples")
    expect(body.files.map((file: { name: string }) => file.name)).toEqual([
      ".cursor/rules/project.mdc",
      ".cursor/rules/react-components.mdc",
    ])
    expect(body.files[0].content).toContain("alwaysApply: true")
  })
})
