import { toJsxRuntime } from "hast-util-to-jsx-runtime"
import { fromMarkdown } from "mdast-util-from-markdown"
import { gfmFromMarkdown } from "mdast-util-gfm"
import { toHast } from "mdast-util-to-hast"
import { gfm } from "micromark-extension-gfm"
import type { ComponentProps } from "react"
import { Fragment, jsx, jsxs } from "react/jsx-runtime"

const safeHref = /^(https?:|mailto:|#|\/)/i

// The release title is the entry's h2, so headings inside a release start one level lower.
const components = {
  h1: (props: ComponentProps<"h3">) => <h3 {...props} />,
  h2: (props: ComponentProps<"h3">) => <h3 {...props} />,
  h3: (props: ComponentProps<"h4">) => <h4 {...props} />,
  a: ({ href, ...props }: ComponentProps<"a">) => (
    <a {...props} href={href && safeHref.test(href) ? href : undefined} />
  ),
}

// Renders a release body on the server. Release notes are GitHub-flavoured Markdown written by the
// release-notes workflow or by hand on GitHub. Raw HTML in them is dropped rather than rendered,
// and links keep only web, mail and in-page targets.
export function ReleaseMarkdown({ markdown }: { markdown: string }) {
  const tree = toHast(
    fromMarkdown(markdown, { extensions: [gfm()], mdastExtensions: [gfmFromMarkdown()] }),
  )
  return (
    <div className="blog-prose max-w-[40rem]">
      {toJsxRuntime(tree, { Fragment, jsx, jsxs, components })}
    </div>
  )
}
