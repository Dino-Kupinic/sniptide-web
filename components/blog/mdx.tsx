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

// What a post's MDX can use. Plain Markdown maps to the elements below and takes its look from
// .blog-prose in app/globals.css; the named components are the docs' prose components.
export const blogMdxComponents = {
  pre: (props: ComponentProps<"pre">) => <CodeBlock {...props} />,
  // Tables scroll inside their own frame on narrow screens rather than the page.
  table: (props: ComponentProps<"table">) => (
    <div className="blog-table">
      <table {...props} />
    </div>
  ),
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
