import { FileIcon, FolderIcon } from "lucide-react"

// The Components collection next to the project it was pulled into. The steps are the same six
// files the CLI session reports writing, and each lands at the path it was saved from, so the
// figure shows the two halves of the section's claim: the order and the paths.
const steps = [
  { title: "Confirm dialog", path: "src/components/confirm-dialog.tsx" },
  { title: "Toaster", path: "src/components/toaster.tsx" },
  { title: "Button", path: "src/components/ui/button.tsx" },
  { title: "Combobox", path: "src/components/ui/combobox.tsx" },
  { title: "Data table", path: "src/components/data-table.tsx" },
  { title: "Design tokens", path: "src/styles/tokens.css" },
]

// The project after the pull. `added` marks the files the collection wrote, and the rest were
// already there, which shows the pull leaves them alone.
const tree: { name: string; depth: number; folder?: boolean; added?: boolean }[] = [
  { name: "src", depth: 0, folder: true },
  { name: "components", depth: 1, folder: true },
  { name: "ui", depth: 2, folder: true },
  { name: "button.tsx", depth: 3, added: true },
  { name: "combobox.tsx", depth: 3, added: true },
  { name: "confirm-dialog.tsx", depth: 2, added: true },
  { name: "data-table.tsx", depth: 2, added: true },
  { name: "header.tsx", depth: 2 },
  { name: "toaster.tsx", depth: 2, added: true },
  { name: "styles", depth: 1, folder: true },
  { name: "globals.css", depth: 2 },
  { name: "tokens.css", depth: 2, added: true },
  { name: "package.json", depth: 0 },
]

const pane =
  "flex min-w-0 flex-col overflow-hidden rounded-lg border border-[#e8e8e8] bg-white dark:border-[#2f2c2c] dark:bg-[#121111]"
const paneHeader =
  "flex h-10 items-center justify-between gap-3 border-b border-[#e8e8e8] px-4 text-sm leading-5 dark:border-[#2f2c2c]"
const muted = "text-[#6b6b6b] dark:text-[#a3a3a3]"
const added = "text-[#2a26ec] dark:text-[#8f8cff]"

export function RecipeTree() {
  return (
    <figure className="grid gap-3 sm:grid-cols-2">
      <figcaption className="sr-only">
        The Components collection lists six steps in order, and after the pull each file sits at its
        saved path in the project, next to the files that were already there.
      </figcaption>

      <div className={pane}>
        <div className={paneHeader}>
          <span className="font-medium">Components</span>
          <span className={muted}>6 steps</span>
        </div>
        <ol className="flex flex-col py-2">
          {steps.map((step, i) => (
            <li
              key={step.path}
              className="grid grid-cols-[20px_minmax(0,1fr)] gap-x-3 px-4 py-2.5 text-sm leading-5"
            >
              <span className={`font-mono text-[13px] tabular-nums ${added}`}>{i + 1}</span>
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="font-medium">{step.title}</span>
                <span className={`truncate font-mono text-[13px] ${muted}`}>{step.path}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className={pane}>
        <div className={paneHeader}>
          <span className="font-mono text-[13px]">~/acme/shop</span>
          <span className={muted}>6 files written</span>
        </div>
        <ul className="flex flex-col py-3 font-mono text-[13px] leading-6.5">
          {tree.map((entry) => {
            const Icon = entry.folder ? FolderIcon : FileIcon
            return (
              <li
                key={`${entry.depth}-${entry.name}`}
                style={{ paddingLeft: `${16 + entry.depth * 16}px` }}
                className={`flex items-center gap-2 pr-4 ${entry.added ? added : entry.folder ? "" : muted}`}
              >
                <Icon aria-hidden="true" className="size-3.5 shrink-0" strokeWidth={1.75} />
                <span className="truncate">{entry.name}</span>
                {entry.added && <span className="sr-only">(written by the pull)</span>}
              </li>
            )
          })}
        </ul>
      </div>
    </figure>
  )
}
