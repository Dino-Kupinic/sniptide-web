"use client"

import { Menu } from "@base-ui/react/menu"
import { ArrowRightIcon, ChevronDownIcon } from "lucide-react"
import { type AgentId, AgentMark } from "@/components/agent-mark"
import { links } from "@/lib/links"

// Every agent starts at sign-up: the account is what the agent connects to.
const agents: { id: AgentId; label: string }[] = [
  { id: "claude", label: "Claude Code" },
  { id: "openai", label: "Codex" },
  { id: "cursor", label: "Cursor" },
]

// The hero's second call to action: the agent marks stacked like avatars, and a menu with one row
// per agent at the size of the hero buttons. The trigger skips the press so the menu below it does
// not jump.
export function AgentSetupMenu() {
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
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}
