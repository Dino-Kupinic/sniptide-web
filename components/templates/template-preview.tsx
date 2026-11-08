import { highlight } from "fumadocs-core/highlight"
import type { ComponentProps, ReactNode } from "react"
import type { TemplateCardData } from "@/components/templates/template-card"
import { codeTheme } from "@/lib/code-theme"
import { readTemplateFiles, type Template } from "@/lib/template-source"
import type { TemplateFile } from "@/lib/templates"

// Lines a template card's cover holds before it runs off the bottom edge.
const previewLines = 10

// The first lines of a template's first file, highlighted, for its card. The cover blurs them
// behind the tool's logo, so they read as a glimpse of the file rather than a code block.
export async function templatePreview(file: TemplateFile): Promise<ReactNode> {
  const code = file.content.split("\n").slice(0, previewLines).join("\n")
  return highlight(code, {
    lang: file.language,
    themes: { light: codeTheme, dark: codeTheme },
    fallbackLanguage: "text",
    components: {
      pre: ({ children, style }: ComponentProps<"pre">) => (
        <pre
          aria-hidden="true"
          style={style}
          className="overflow-hidden px-3.5 pt-2.5 font-mono text-xs/5 [counter-reset:line] [&_.line]:whitespace-pre [&_.line]:[counter-increment:line] [&_.line]:before:inline-block [&_.line]:before:w-6.5 [&_.line]:before:text-muted-foreground/60 [&_.line]:before:content-[counter(line)]"
        >
          {children}
        </pre>
      ),
    },
  })
}

// What a card needs to draw a template, with the preview of its first file.
export async function templateCards(
  templates: Template[],
): Promise<(TemplateCardData & Pick<Template, "query">)[]> {
  return Promise.all(
    templates.map(async (template) => {
      const [first] = readTemplateFiles(template)
      return {
        name: template.name,
        title: template.title,
        description: template.description,
        query: template.query,
        category: template.category,
        department: template.department,
        files: template.files,
        logo: template.logo,
        preview: first ? await templatePreview(first) : null,
      }
    }),
  )
}
