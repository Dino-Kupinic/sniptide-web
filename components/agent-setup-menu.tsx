"use client"

import { Menu } from "@base-ui/react/menu"
import { ArrowRightIcon, CheckIcon, ChevronDownIcon, CopyIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { type AgentId, AgentMark } from "@/components/agent-mark"
import { agentSetupPrompt } from "@/lib/agent-setup-prompt"
import { links } from "@/lib/links"
import { track } from "@/lib/tracking"

// Every agent starts at sign-up: the account is what the agent connects to.
const agents: { id: AgentId; label: string }[] = [
  { id: "claude", label: "Claude Code" },
  { id: "openai", label: "Codex" },
  { id: "cursor", label: "Cursor" },
]

// The hero's second call to action: the agent marks stacked like avatars, and a menu with one row
// per agent at the size of the hero buttons. The trigger skips the press so the menu below it does
// not jump. Below a hairline, the last row copies a prompt that has the reader's own agent connect
// itself (lib/agent-setup-prompt.ts). It stays open after a copy so the row can confirm it.
export function AgentSetupMenu() {
  const [copied, setCopied] = useState<"done" | "failed" | null>(null)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(null), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  async function copyPrompt() {
    track("cta_clicked", { location: "hero", target: "copy_setup_prompt" })
    try {
      await navigator.clipboard.writeText(agentSetupPrompt)
      setCopied("done")
    } catch {
      setCopied("failed")
    }
  }

  return (
    <Menu.Root modal={false}>
      <Menu.Trigger className="raised-button group active:transform-none active:shadow-[0_2px_0_0_var(--button-depth)] flex h-12 items-center justify-center gap-3 bg-[#f2f2f2] [--button-depth:#d0d0d0] dark:[--button-depth:#383838] pr-4.5 pl-4 text-base leading-5 font-semibold text-[#0a0a0a] hover:bg-[#e8e8e8] data-popup-open:bg-[#e8e8e8] dark:bg-[#1c1c1c] dark:text-white dark:hover:bg-[#262626] dark:data-popup-open:bg-[#262626]">
        <span className="flex items-center">
          {agents.map((agent, index) => (
            <AgentMark
              key={agent.id}
              agent={agent.id}
              className={`size-6 ring-2 ring-[#f2f2f2] transition-[box-shadow] group-hover:ring-[#e8e8e8] group-data-popup-open:ring-[#e8e8e8] dark:ring-[#1c1c1c] dark:group-hover:ring-[#262626] dark:group-data-popup-open:ring-[#262626] ${index > 0 ? "-ml-1" : ""}`}
            />
          ))}
        </span>
        Set up your agent
        <ChevronDownIcon
          aria-hidden="true"
          className="size-4 text-[#6b6b6b] transition-transform duration-200 ease-out group-data-popup-open:rotate-180 motion-reduce:transition-none dark:text-[#a3a3a3]"
          strokeWidth={2.25}
        />
      </Menu.Trigger>
      <Menu.Portal>
        {/* The popup renders outside the hero, so it carries the hero's tracking location. */}
        <Menu.Positioner
          data-cta-location="hero"
          sideOffset={8}
          align="start"
          collisionPadding={16}
          className="z-40 outline-none"
        >
          <Menu.Popup className="w-[max(var(--anchor-width),16rem)] origin-(--transform-origin) rounded-lg border border-[#e8e8e8] bg-white p-1.5 text-[#0a0a0a] shadow-(--float-shadow) transition-[opacity,scale] duration-100 data-ending-style:scale-98 data-ending-style:opacity-0 data-starting-style:scale-98 data-starting-style:opacity-0 motion-reduce:transition-none dark:border-[#2f2c2c] dark:bg-[#1a1919] dark:text-white">
            {agents.map((agent) => (
              <Menu.LinkItem
                key={agent.id}
                href={links.signUp}
                className="group/row flex h-12 cursor-pointer items-center gap-3 rounded-md px-3 text-base leading-5 font-medium outline-none select-none data-highlighted:bg-[#f4f4f4] dark:data-highlighted:bg-[#242222]"
              >
                <AgentMark agent={agent.id} className="size-7" />
                <span className="min-w-0 flex-1 truncate">{agent.label}</span>
                <ArrowRightIcon
                  aria-hidden="true"
                  className="size-4 text-[#6b6b6b] transition-transform duration-150 ease-out group-data-highlighted/row:translate-x-0.5 motion-reduce:transition-none dark:text-[#a3a3a3]"
                  strokeWidth={2}
                />
              </Menu.LinkItem>
            ))}
            <Menu.Separator className="mx-1.5 my-1.5 h-px bg-[#e8e8e8] dark:bg-[#2f2c2c]" />
            <Menu.Item
              closeOnClick={false}
              onClick={copyPrompt}
              className="flex h-12 cursor-pointer items-center gap-3 rounded-md px-3 text-base leading-5 font-medium outline-none select-none data-highlighted:bg-[#f4f4f4] dark:data-highlighted:bg-[#242222]"
            >
              <span className="flex size-7 shrink-0 items-center justify-center">
                {copied === "done" ? (
                  <CheckIcon
                    aria-hidden="true"
                    className="size-4 text-[#2a26ec] dark:text-[#8f8cff]"
                    strokeWidth={2.25}
                  />
                ) : (
                  <CopyIcon
                    aria-hidden="true"
                    className="size-4 text-[#6b6b6b] dark:text-[#a3a3a3]"
                    strokeWidth={2}
                  />
                )}
              </span>
              <span className="min-w-0 flex-1 truncate" aria-live="polite">
                {copied === "done"
                  ? "Prompt copied"
                  : copied === "failed"
                    ? "Couldn't copy the prompt"
                    : "Copy setup prompt"}
              </span>
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}
