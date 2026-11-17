import {
  CheckIcon,
  ChevronDownIcon,
  FileCodeIcon,
  FolderIcon,
  GlobeIcon,
  LinkIcon,
  LockIcon,
  SearchIcon,
} from "lucide-react"

// Drawings of Sniptide inside each tool, built from the extensions' real labels and commands so
// they read like the tool without copying its look. They are decorative: the card around each one
// names the tool and says what the extension does, so every replica is hidden from assistive
// technology.

const window =
  "absolute overflow-hidden rounded-lg border border-[#e8e8e8] bg-white text-[#1b1919] shadow-[0_1px_2px_rgb(0_0_0/0.06),0_8px_24px_-6px_rgb(0_0_0/0.14)] dark:border-[#2f2c2c] dark:bg-[#121111] dark:text-[#f4f4f4] dark:shadow-[0_1px_2px_rgb(0_0_0/0.4),0_8px_24px_-6px_rgb(0_0_0/0.6)]"
const muted = "text-[#6b6b6b] dark:text-[#a3a3a3]"
const line = "border-[#e8e8e8] dark:border-[#2f2c2c]"
const blue = "text-[#2a26ec] dark:text-[#8f8cff]"
const keyword = "text-[#2a26ec] dark:text-[#8f8cff]"
const string = "text-[#047857] dark:text-[#5fd3a8]"
const fn = "text-[#6d28d9] dark:text-[#c4b5fd]"

function Dots() {
  return (
    <span className="flex gap-1.5">
      <span className="size-2.5 rounded-full bg-[#e8e8e8] dark:bg-[#2f2c2c]" />
      <span className="size-2.5 rounded-full bg-[#e8e8e8] dark:bg-[#2f2c2c]" />
      <span className="size-2.5 rounded-full bg-[#e8e8e8] dark:bg-[#2f2c2c]" />
    </span>
  )
}

// The editor with the Snippets view open and Insert Snippet in the command palette.
export function VSCodeReplica() {
  const recent: [string, typeof GlobeIcon][] = [
    ["Confirm dialog", LinkIcon],
    ["useLocalStorage hook", LockIcon],
    ["Retry with backoff", GlobeIcon],
    ["Keyset pagination", GlobeIcon],
  ]
  return (
    <div aria-hidden="true" className={`${window} inset-x-6 top-8 bottom-0 flex rounded-b-none`}>
      <div
        className={`hidden w-44 shrink-0 flex-col border-r ${line} bg-[#fafafa] sm:flex dark:bg-[#0c0b0b]`}
      >
        <span className={`px-3 pt-3 pb-2 text-[11px] font-medium ${muted}`}>Snippets</span>
        <span className="px-3 pb-1 text-xs font-medium">Recent</span>
        {recent.map(([title, Icon]) => (
          <span key={title} className="flex items-center gap-1.5 px-3 py-1 text-xs">
            <Icon className={`size-3 shrink-0 ${muted}`} strokeWidth={2} />
            <span className="truncate">{title}</span>
          </span>
        ))}
        <span className="px-3 pt-3 pb-1 text-xs font-medium">Collections</span>
        <span className="flex items-center gap-1.5 px-3 py-1 text-xs">
          <FolderIcon className={`size-3 ${muted}`} strokeWidth={2} />
          Components
        </span>
      </div>
      <div className="relative flex min-w-0 grow flex-col">
        <span className={`flex h-8 items-center border-b ${line} px-3 font-mono text-[11px]`}>
          delete-button.tsx
        </span>
        <div className="flex flex-col gap-0.5 px-4 py-3 font-mono text-[11px] leading-5 whitespace-nowrap">
          <span>
            <span className={keyword}>export function</span>{" "}
            <span className={fn}>DeleteButton</span>
            () {"{"}
          </span>
          <span className="pl-4">
            <span className={keyword}>return</span> (
          </span>
          <span className="pl-8">{"<ConfirmDialog"}</span>
          <span className="pl-12">
            title=<span className={string}>"Delete this paste?"</span>
          </span>
          <span className="pl-8">{"/>"}</span>
        </div>
        <div className={`${window} top-10 right-4 left-4 text-xs`}>
          <span className={`flex h-8 items-center gap-2 border-b ${line} px-3`}>
            <span className={muted}>&gt;</span> Sniptide: Insert Snippet
          </span>
          <span className="flex h-7 items-center justify-between bg-[#2a26ec]/10 px-3 dark:bg-[#8f8cff]/15">
            <span>Confirm dialog</span>
            <span className={muted}>Components</span>
          </span>
          <span className="flex h-7 items-center justify-between px-3">
            <span>Toaster</span>
            <span className={muted}>Components</span>
          </span>
        </div>
      </div>
    </div>
  )
}

// A docs page with a code block selected, and the toast the extension shows after saving it.
export function ChromeReplica() {
  return (
    <div
      aria-hidden="true"
      className={`${window} inset-x-6 top-8 bottom-0 flex flex-col rounded-b-none`}
    >
      <span className={`flex h-9 items-center gap-3 border-b ${line} px-3`}>
        <Dots />
        <span
          className={`flex h-5.5 grow items-center rounded-md bg-[#f4f4f4] px-2.5 text-[11px] dark:bg-[#242222] ${muted}`}
        >
          docs.example.dev/guides/retries
        </span>
      </span>
      <div className="flex flex-col gap-2 px-6 py-5">
        <span className="font-heading text-base font-bold">Retry failed requests</span>
        <span className={`h-2 w-4/5 rounded-sm bg-[#f4f4f4] dark:bg-[#242222]`} />
        <span className={`h-2 w-3/5 rounded-sm bg-[#f4f4f4] dark:bg-[#242222]`} />
        <div className="mt-2 overflow-hidden rounded-md bg-[#f4f4f4] p-3 font-mono text-[11px] leading-5 whitespace-nowrap dark:bg-[#1a1919]">
          <span className="bg-[#2a26ec]/20 dark:bg-[#8f8cff]/30">
            <span className={keyword}>for</span> (<span className={keyword}>let</span> i = 0; i &lt;
            5; i++) {"{"}
          </span>
          <br />
          <span className="bg-[#2a26ec]/20 pl-4 dark:bg-[#8f8cff]/30">
            <span className={keyword}>await</span> <span className={fn}>sleep</span>(2 ** i * 100)
          </span>
          <br />
          <span className="bg-[#2a26ec]/20 dark:bg-[#8f8cff]/30">{"}"}</span>
        </div>
        <div
          className={`${window} right-4 bottom-4 flex w-56 items-center gap-2.5 py-2.5 pr-2.5 pl-3.5 text-[13px]`}
        >
          <CheckIcon
            className="size-4 shrink-0 text-[#e353ac] dark:text-[#f6a9d3]"
            strokeWidth={2.5}
          />
          <span className="grow">Link copied</span>
          <span className={`text-xs font-medium ${blue}`}>Open</span>
          <span className={`text-xs font-medium ${blue}`}>Undo</span>
        </div>
      </div>
    </div>
  )
}

// The launcher running Search Pastes, with the code of the highlighted paste beside the list.
export function RaycastReplica() {
  const rows = ["Confirm dialog", "Toaster", "Retry with backoff", "Keyset pagination"]
  return (
    <div aria-hidden="true" className={`${window} inset-x-6 top-8 bottom-8 flex flex-col`}>
      <span className={`flex h-11 shrink-0 items-center gap-2.5 border-b ${line} px-4 text-sm`}>
        <SearchIcon className={`size-4 ${muted}`} strokeWidth={2} />
        <span className="grow">confirm</span>
        <span
          className={`flex h-6 items-center gap-1 rounded-md border ${line} px-2 text-[11px] ${muted}`}
        >
          All collections
          <ChevronDownIcon className="size-3" strokeWidth={2} />
        </span>
      </span>
      <div className="flex min-h-0 grow">
        <div className={`flex w-[45%] shrink-0 flex-col gap-0.5 border-r ${line} p-1.5`}>
          {rows.map((row, i) => (
            <span
              key={row}
              className={`flex h-7 items-center gap-2 rounded-md px-2 text-xs ${i === 0 ? "bg-[#f4f4f4] dark:bg-[#242222]" : ""}`}
            >
              <FileCodeIcon className={`size-3.5 shrink-0 ${muted}`} strokeWidth={2} />
              <span className="truncate">{row}</span>
            </span>
          ))}
        </div>
        <div className="flex min-w-0 flex-col gap-0.5 p-3 font-mono text-[11px] leading-5 whitespace-nowrap">
          <span>
            <span className={keyword}>export function</span>
          </span>
          <span className={fn}>ConfirmDialog</span>
          <span>{"({ title, action })"}</span>
          <span className={muted}>{"  // …"}</span>
        </div>
      </div>
      <span
        className={`flex h-8 shrink-0 items-center justify-end gap-2 border-t ${line} px-3 text-[11px] ${muted}`}
      >
        <span className="text-[#1b1919] dark:text-[#f4f4f4]">Paste Code</span>
        <span className={`rounded-sm border ${line} px-1`}>↵</span>
        <span className="pl-2">Copy Code</span>
      </span>
    </div>
  )
}

// The plugin install in a terminal, with the five skills it adds.
export function PluginReplica() {
  const skills = [
    "setup-sniptide",
    "reuse-snippets",
    "save-snippets",
    "apply-collection",
    "integrate-sniptide-sdk",
  ]
  return (
    <div
      aria-hidden="true"
      className="absolute inset-x-6 top-8 bottom-0 overflow-hidden rounded-t-lg border border-b-0 border-[#262626] bg-[#0c0b0b] font-mono text-[11px] leading-5.5 whitespace-nowrap text-[#f4f4f4]"
    >
      <span className="flex h-8 items-center justify-between border-b border-[#262626] px-3 text-[#8a8a8a]">
        <span>claude</span>
        <span>~/acme/web</span>
      </span>
      <div className="flex flex-col px-4 py-3">
        <span>
          <span className="text-[#8a8a8a]">$ </span>claude plugin marketplace add
          Dino-Kupinic/sniptide
        </span>
        <span>
          <span className="text-[#8a8a8a]">$ </span>claude plugin install sniptide@sniptide
        </span>
        <span className="mt-2 text-[#5fd3a8]">
          Installed sniptide with 1 MCP server and 5 skills.
        </span>
        {skills.map((skill) => (
          <span key={skill} className="text-[#a3a3a3]">
            <span className="text-[#8f8cff]">· </span>
            {skill}
          </span>
        ))}
      </div>
    </div>
  )
}
