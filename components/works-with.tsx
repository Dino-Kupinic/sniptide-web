import { cn } from "@sniptide/ui/lib/utils"

// Wordmarks set in type, faded towards the edges of the row.
const tools = [
  { name: "Neovim", className: "font-notch text-[22px] font-bold tracking-[-0.02em] opacity-25" },
  { name: "GitHub", className: "font-notch text-[22px] font-bold tracking-[-0.02em] opacity-60" },
  { name: "VS Code", className: "text-[21px] font-semibold tracking-[-0.01em] opacity-75" },
  { name: "docker", className: "font-notch text-[23px] font-bold tracking-[-0.02em] opacity-80" },
  { name: "curl://", className: "font-mono text-[22px] font-bold opacity-80" },
  { name: "Raycast", className: "text-[21px] font-bold tracking-[-0.02em] opacity-75" },
  { name: "slack", className: "font-notch text-[22px] font-bold tracking-[-0.02em] opacity-60" },
  { name: "Linear", className: "text-[21px] font-semibold tracking-[-0.01em] opacity-25" },
]

export function WorksWith() {
  return (
    <section className="flex flex-col items-center gap-5 px-5 pt-7 pb-12 md:gap-7 md:pt-6 md:pb-18">
      <p className="text-[13px] leading-4 text-[#8a8a8a]">Works with the tools you already use.</p>
      <ul className="flex max-w-87.5 flex-wrap items-center justify-center gap-x-7 gap-y-4 text-[#0a0a0a] md:max-w-none md:gap-x-16 dark:text-white">
        {tools.map((tool) => (
          <li key={tool.name} className={cn("leading-7", tool.className)}>
            {tool.name}
          </li>
        ))}
      </ul>
    </section>
  )
}
