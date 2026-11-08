import { readFileSync } from "node:fs"
import { join } from "node:path"
import { applyMdxPreset } from "fumadocs-mdx/config"
import { defineCollections } from "fumadocs-mdx/macro"
import { codeTheme } from "@/lib/code-theme"
import {
  languageFor,
  nameFromPath,
  sortTemplates,
  type TemplateFile,
  type TemplateMeta,
  templateSchema,
} from "@/lib/templates"

export const templatesDir = "content/templates"

// The templates in content/templates, one folder each: template.mdx holds the frontmatter and the
// explanation, compiled by fumadocs-mdx like the blog posts, and files/ holds the template's files.
const collection = defineCollections({
  type: "doc",
  dir: "content/templates",
  files: ["*/template.mdx"],
  schema: templateSchema,
  postprocess: { includeProcessedMarkdown: true },
  mdxOptions: applyMdxPreset({
    rehypeCodeOptions: { themes: { light: codeTheme, dark: codeTheme } },
  }),
})

type Entry = (typeof collection.entries)[number]
export type Template = TemplateMeta & { entry: Entry }

const allTemplates: Template[] = sortTemplates(
  collection.entries.map((entry) => ({
    ...templateSchema.parse(entry),
    name: nameFromPath(entry.info.path),
    entry,
  })),
)

// Every template in directory order.
export function getTemplates(): Template[] {
  return allTemplates
}

export function getTemplate(name: string): Template | undefined {
  return allTemplates.find((template) => template.name === name)
}

// A template's files as the frontmatter lists them. The pages that read them are rendered when the
// site builds, so the files are read from the checkout then.
export function readTemplateFiles(template: Pick<TemplateMeta, "name" | "files">): TemplateFile[] {
  return template.files.map((path) => ({
    path,
    language: languageFor(path),
    content: readFileSync(join(process.cwd(), templatesDir, template.name, "files", path), "utf8"),
  }))
}

// The templates a page links at its end, in the order its frontmatter names them.
export function relatedTemplates(template: Pick<TemplateMeta, "related">): Template[] {
  return template.related.flatMap((name) => getTemplate(name) ?? [])
}
