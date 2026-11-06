"use client"

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cn } from "@sniptide/ui/lib/utils"
import { Children, isValidElement, type ReactElement, type ReactNode } from "react"

type TabProps = { value: string; children?: ReactNode }

// One panel of <Tabs>. The parent reads its value for the tab label.
export function Tab({ children }: TabProps) {
  return <>{children}</>
}

// Alternatives a reader picks one of, such as the same command for each package manager. The tab
// row sits on the fill with a hairline below, and the active tab rises onto the page colour with a
// hairline, as in packages/ui tabs. A code block inside a panel runs edge to edge.
export function Tabs({ children, className }: { children?: ReactNode; className?: string }) {
  const tabs = Children.toArray(children).filter((child): child is ReactElement<TabProps> =>
    isValidElement<TabProps>(child),
  )
  const first = tabs[0]?.props.value
  return (
    <TabsPrimitive.Root
      defaultValue={first}
      className={cn("not-prose overflow-hidden rounded-lg border bg-card", className)}
    >
      <TabsPrimitive.List className="flex gap-1 overflow-x-auto border-b bg-muted/50 p-1.5">
        {tabs.map((tab) => (
          <TabsPrimitive.Tab
            key={tab.props.value}
            value={tab.props.value}
            className="inline-flex h-7 shrink-0 items-center rounded-md border border-transparent px-3 text-sm font-medium text-muted-foreground outline-none select-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40 data-active:border-border data-active:bg-background data-active:text-foreground"
          >
            {tab.props.value}
          </TabsPrimitive.Tab>
        ))}
      </TabsPrimitive.List>
      {tabs.map((tab) => (
        <TabsPrimitive.Panel
          key={tab.props.value}
          value={tab.props.value}
          className="p-4 text-[0.9375rem] leading-6 outline-none focus-visible:ring-2 focus-visible:ring-ring/40 [&>[data-code-block]]:-m-4 [&>[data-code-block]]:rounded-none [&>[data-code-block]]:border-0 [&>*+*]:mt-3"
        >
          {tab.props.children}
        </TabsPrimitive.Panel>
      ))}
    </TabsPrimitive.Root>
  )
}
