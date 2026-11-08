import { highlight } from "fumadocs-core/highlight"
import type { ComponentProps, ReactNode } from "react"
import { CodeBlock } from "@/components/blog/code-block"
import { codeTheme } from "@/lib/code-theme"

// A code block highlighted on the server with the app's code theme, in the same panel as a fenced
// block in a post: the file name in the title row, optional links beside it, and a copy button.
export async function TemplateCode({
  code,
  language,
  title,
  actions,
  wrap = false,
}: {
  code: string
  language: string
  title: string
  actions?: ReactNode
  // Wraps long lines instead of scrolling, for prose such as a prompt.
  wrap?: boolean
}) {
  return highlight(code.replace(/\n$/, ""), {
    lang: language,
    themes: { light: codeTheme, dark: codeTheme },
    fallbackLanguage: "text",
    components: {
      pre: (props: ComponentProps<"pre">) => (
        <CodeBlock
          {...props}
          title={title}
          actions={actions}
          className={
            wrap ? `${props.className ?? ""} whitespace-pre-wrap break-words` : props.className
          }
        />
      ),
    },
  })
}
