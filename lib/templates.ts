import { z } from "zod"
import { formatPostDate, postPath } from "@/lib/blog"
import { links } from "@/lib/links"
import { siteName, siteUrl } from "@/lib/site"

// What kind of file a template is, shown on its card. Every template has exactly one.
export const templateCategories = {
  agents: "Agent files",
  deploy: "Docker and deploy",
  project: "Project setup",
  specs: "Specs",
  discovery: "Discovery",
  writing: "Writing",
} as const

// Who the template is for. The directory filters by it, in this order.
export const templateDepartments = {
  engineering: "Engineering",
  product: "Product",
  marketing: "Marketing",
} as const

export type TemplateDepartment = keyof typeof templateDepartments

const departmentKeys = Object.keys(templateDepartments) as [
  TemplateDepartment,
  ...TemplateDepartment[],
]

export type TemplateCategory = keyof typeof templateCategories

const categoryKeys = Object.keys(templateCategories) as [TemplateCategory, ...TemplateCategory[]]

// The tool whose logo a template's card shows, from the artwork in public/logos.
export const templateLogos = ["claude", "cursor", "openai", "github", "docker"] as const

export type TemplateLogo = (typeof templateLogos)[number]

const name = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)

// Frontmatter of content/templates/<name>/template.mdx. The folder name is the template's name and
// its URL, and the files it lists sit next to it under files/.
export const templateSchema = z.object({
  // The H1 and the browser title. It matches the search query the page answers.
  title: z.string().min(1).max(50),
  // The query the page targets, as people type it. Kept for upkeep, not shown.
  query: z.string().min(1),
  // One sentence for search results, link previews and the directory.
  description: z.string().min(50).max(160),
  // Two sentences under the H1 that answer the query before the files start.
  answer: z.string().min(80).max(360),
  category: z.enum(categoryKeys),
  department: z.enum(departmentKeys),
  // The logo on the card. Templates for a tool without artwork in public/logos leave it out, and
  // their card shows the main file's name instead.
  logo: z.enum(templateLogos).optional(),
  // The day the files or the explanation last changed. Review every template each quarter.
  updated: z.iso.date(),
  // Paths under files/, in the order the page shows them. A paste holds at most 10 files with
  // names up to 120 characters, so a template stays within the same limits.
  files: z.array(z.string().min(1).max(120)).min(1).max(10),
  // Other templates to link at the end of the page.
  related: z.array(name).default([]),
  // The slug of the blog post that goes deeper on the same topic.
  post: name.optional(),
})

export type TemplateFrontmatter = z.infer<typeof templateSchema>
export type TemplateMeta = TemplateFrontmatter & { name: string }
export type TemplateFile = { path: string; content: string; language: string }

export const templatesPath = "/templates"

export function templatePath(name: string) {
  return `${templatesPath}/${name}`
}

export function templateMarkdownPath(name: string) {
  return `${templatePath(name)}.md`
}

// The files as JSON, which the app reads to open its editor pre-filled.
export function templateJsonPath(name: string) {
  return `${templatePath(name)}.json`
}

export function templateRawPath(name: string, file: string) {
  return `${templatePath(name)}/raw/${file}`
}

// The app's new-paste editor, filled in with this template's files.
export function templateEditorUrl(name: string) {
  return `${links.newPaste}?template=${encodeURIComponent(name)}`
}

// A template's name from its path in the collection ("claude-md/template.mdx" is "claude-md").
export function nameFromPath(path: string) {
  return path.replace(/\/template\.mdx?$/, "").replace(/^.*\//, "")
}

// The Shiki language for a file, from its name. Files without a grammar render as plain text.
export function languageFor(path: string) {
  const file = path.replace(/^.*\//, "")
  if (file === "Dockerfile" || file.endsWith(".Dockerfile")) return "dockerfile"
  if (file === ".env" || file.startsWith(".env.")) return "dotenv"
  const extension = file.includes(".") ? file.replace(/^.*\./, "").toLowerCase() : ""
  const byExtension: Record<string, string> = {
    md: "markdown",
    mdc: "markdown",
    json: "json",
    yml: "yaml",
    yaml: "yaml",
    sh: "bash",
    ts: "ts",
    js: "js",
  }
  return byExtension[extension] ?? "text"
}

// Directory order: by department, then category, as their tables list them, then by title,
// ignoring a leading dot so .mcp.json sorts with the m's.
export function sortTemplates<T extends TemplateMeta>(templates: T[]): T[] {
  const departments = Object.keys(templateDepartments)
  const categories = Object.keys(templateCategories)
  return [...templates].sort(
    (a, b) =>
      departments.indexOf(a.department) - departments.indexOf(b.department) ||
      categories.indexOf(a.category) - categories.indexOf(b.category) ||
      a.title.replace(/^\./, "").localeCompare(b.title.replace(/^\./, "")),
  )
}

// Whether a template matches every word of a search, in its title, description, query, category
// or file names.
export function matchesTemplateQuery(
  template: Pick<
    TemplateMeta,
    "title" | "description" | "query" | "category" | "department" | "files"
  >,
  query: string,
) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (words.length === 0) return true
  const haystack = [
    template.title,
    template.description,
    template.query,
    templateCategories[template.category],
    templateDepartments[template.department],
    ...template.files,
  ]
    .join(" ")
    .toLowerCase()
  return words.every((word) => haystack.includes(word))
}

// Template dates read like post dates.
export const formatTemplateDate = formatPostDate

// A Markdown fence one backtick longer than any run inside the content, so a file that holds its
// own fenced blocks (a CLAUDE.md, a SKILL.md) can't close the fence early.
export function fence(content: string, language: string) {
  const longest = Math.max(2, ...[...content.matchAll(/`+/g)].map(([run]) => run.length))
  const ticks = "`".repeat(longest + 1)
  return `${ticks}${language === "text" ? "" : language}\n${content.replace(/\n$/, "")}\n${ticks}`
}

// The Markdown twin at /templates/<name>.md: the answer, the files and the explanation.
export function renderTemplateMarkdown(
  template: TemplateMeta,
  files: TemplateFile[],
  explanation: string,
) {
  const canonical = `${siteUrl}${templatePath(template.name)}`
  const fileSections = files
    .map((file) => `### ${file.path}\n\n${fence(file.content, file.language)}`)
    .join("\n\n")
  return `# ${template.title}

> ${template.answer}

Updated ${formatTemplateDate(template.updated)}. Canonical: ${canonical}
Open it in the Sniptide editor: ${templateEditorUrl(template.name)}
Files as JSON: ${siteUrl}${templateJsonPath(template.name)}

## Files

${fileSections}

${explanation.trim()}
`
}

// The body of /templates/<name>.json. The app's editor reads `title`, `description` and `files`.
export function templateJson(template: TemplateMeta, files: TemplateFile[]) {
  return {
    name: template.name,
    title: template.title,
    description: template.description,
    category: template.category,
    updated: template.updated,
    url: `${siteUrl}${templatePath(template.name)}`,
    files: files.map((file) => ({
      name: file.path,
      language: file.language,
      content: file.content,
    })),
  }
}

function breadcrumb(items: { name: string; url: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

const directoryUrl = `${siteUrl}${templatesPath}`

export function templateStructuredData(template: TemplateMeta, files: TemplateFile[]) {
  const url = `${siteUrl}${templatePath(template.name)}`
  const languages = [...new Set(files.map((file) => file.language).filter((l) => l !== "text"))]
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareSourceCode",
        "@id": `${url}#code`,
        name: template.title,
        description: template.description,
        url,
        mainEntityOfPage: url,
        codeSampleType: "template",
        ...(languages.length > 0 ? { programmingLanguage: languages } : {}),
        dateModified: template.updated,
        image: `${url}/opengraph-image`,
        inLanguage: "en",
        isAccessibleForFree: true,
        publisher: { "@id": `${siteUrl}/#organization` },
        encoding: files.map((file) => ({
          "@type": "MediaObject",
          name: file.path,
          contentUrl: `${siteUrl}${templateRawPath(template.name, file.path)}`,
          encodingFormat: "text/plain",
        })),
      },
      breadcrumb([
        { name: siteName, url: siteUrl },
        { name: "Templates", url: directoryUrl },
        { name: template.title, url },
      ]),
    ],
  }
}

export function directoryStructuredData(templates: TemplateMeta[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${directoryUrl}#page`,
        name: "Templates",
        url: directoryUrl,
        description: templatesDescription,
        inLanguage: "en",
        isPartOf: { "@id": `${siteUrl}/#website` },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: sortTemplates(templates).map((template, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: template.title,
            url: `${siteUrl}${templatePath(template.name)}`,
          })),
        },
      },
      breadcrumb([
        { name: siteName, url: siteUrl },
        { name: "Templates", url: directoryUrl },
      ]),
    ],
  }
}

export const templatesDescription =
  "Copy-ready templates for agent files and everyday config, from CLAUDE.md and AGENTS.md to Docker Compose and CI."

// The blog post a template links to, when it names one.
export function templatePostPath(template: Pick<TemplateMeta, "post">) {
  return template.post ? postPath(template.post) : undefined
}
