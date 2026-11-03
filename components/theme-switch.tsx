"use client"

import { cn } from "@sniptide/ui/lib/utils"
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react"
import { useEffect, useState } from "react"

type Theme = "light" | "system" | "dark"

const options: { value: Theme; label: string; icon: typeof SunIcon }[] = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "system", label: "System", icon: MonitorIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
]

// Mirrors the theme script in app/layout.tsx, which applies the stored choice before first paint.
function apply(theme: Theme) {
  const dark =
    theme === "dark" || (theme === "system" && matchMedia("(prefers-color-scheme: dark)").matches)
  document.documentElement.classList.toggle("dark", dark)
}

// A three-stop slider for the color scheme. The thumb springs to the chosen stop, and under
// reduced motion it snaps.
export function ThemeSwitch({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("system")

  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme")
      if (stored === "light" || stored === "dark") setTheme(stored)
    } catch {}
  }, [])

  const choose = (next: Theme) => {
    setTheme(next)
    try {
      if (next === "system") localStorage.removeItem("theme")
      else localStorage.setItem("theme", next)
    } catch {}
    apply(next)
  }

  const index = options.findIndex((option) => option.value === theme)

  return (
    <fieldset
      className={cn(
        "relative m-0 grid h-8 w-27 min-w-0 grid-cols-3 rounded-md border-0 bg-[#f4f4f4] p-0.75 dark:bg-[#1a1a20]",
        className,
      )}
    >
      <legend className="sr-only">Color scheme</legend>
      <span
        aria-hidden="true"
        className="absolute inset-y-0.75 left-0.75 w-[calc((100%-6px)/3)] rounded-sm bg-white shadow-[0_1px_2px_rgb(0_0_0/0.08)] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none dark:bg-[#2a2a33]"
        style={{ transform: `translateX(${index * 100}%)` }}
      />
      {options.map((option) => {
        const checked = option.value === theme
        return (
          <label
            key={option.value}
            title={option.label}
            className={cn(
              "relative flex cursor-pointer items-center justify-center rounded-sm has-focus-visible:ring-2 has-focus-visible:ring-[#2a26ec]/40",
              checked
                ? "text-[#1b1919] dark:text-white"
                : "text-[#6b6b6b] hover:text-[#1b1919] dark:text-[#8a8a93] dark:hover:text-white",
            )}
          >
            <input
              type="radio"
              name="theme"
              value={option.value}
              checked={checked}
              onChange={() => choose(option.value)}
              className="sr-only"
            />
            <span className="sr-only">{option.label}</span>
            <option.icon aria-hidden="true" className="size-3.5" strokeWidth={2} />
          </label>
        )
      })}
    </fieldset>
  )
}
