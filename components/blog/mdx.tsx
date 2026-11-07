import { Kbd } from "@sniptide/ui/components/kbd"
import type { MDXComponents } from "mdx/types"
import type { ComponentProps } from "react"
import { CodeBlock } from "@/components/blog/code-block"
import {
  Callout,
  Figure,
  File,
  Files,
  Folder,
  Param,
  Params,
  Step,
  Steps,
} from "@/components/blog/prose"
import { Tab, Tabs } from "@/components/blog/tabs"
import { ZoomImage } from "@/components/blog/zoom-image"

// What a post's MDX can use. Plain Markdown maps to the elements below and takes its look from
// .blog-prose in app/globals.css; the named components are the docs' prose components.
export const blogMdxComponents = {
  pre: (props: ComponentProps<"pre">) => <CodeBlock {...props} />,
  // Tables scroll inside their own frame when they are wider than the text, rather than the page.
  // Each cell sizes to its content between 8.5rem and 18rem (.blog-table in app/globals.css): table
  // cells ignore max-width, so the limit sits on a wrapper inside the cell.
  table: (props: ComponentProps<"table">) => (
    <div className="blog-table">
      <table {...props} />
    </div>
  ),
  th: ({ children, ...props }: ComponentProps<"th">) => (
    <th {...props}>
      <div className="blog-cell">{children}</div>
    </th>
  ),
  td: ({ children, ...props }: ComponentProps<"td">) => (
    <td {...props}>
      <div className="blog-cell">{children}</div>
    </td>
  ),
  // A Markdown picture (![alt](/blog/slug/picture.webp)) opens full screen with zoom, like a Figure.
  img: ({ src, alt = "", width, height }: ComponentProps<"img">) =>
    typeof src === "string" ? (
      <span className="block overflow-hidden rounded-lg border bg-card">
        <ZoomImage
          src={src}
          alt={alt}
          width={typeof width === "number" ? width : undefined}
          height={typeof height === "number" ? height : undefined}
        />
      </span>
    ) : null,
  Callout,
  Figure,
  File,
  Files,
  Folder,
  Kbd,
  Param,
  Params,
  Step,
  Steps,
  Tab,
  Tabs,
} satisfies MDXComponents
