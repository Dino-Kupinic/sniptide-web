"use client"

import { Radio } from "@base-ui/react/radio"
import { RadioGroup } from "@base-ui/react/radio-group"
import { SearchIcon, XIcon } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { type TemplateCardData, TemplateGrid } from "@/components/templates/template-card"
import {
  matchesTemplateQuery,
  type TemplateDepartment,
  type TemplateMeta,
  templateDepartments,
} from "@/lib/templates"

export type IndexTemplate = TemplateCardData & Pick<TemplateMeta, "query">

function isDepartment(value: string | null): value is TemplateDepartment {
  return value !== null && value in templateDepartments
}

// The URL keeps the filters (?department=product&q=docker), so a filtered list can be shared and
// the back button restores it, as on the blog index.
function writeParams(department: TemplateDepartment | null, query: string) {
  const params = new URLSearchParams()
  if (department) params.set("department", department)
  if (query.trim()) params.set("q", query.trim())
  const search = params.toString()
  window.history.replaceState(null, "", search ? `?${search}` : window.location.pathname)
}

// The directory: a department filter and a search field that stay above a grid of template cards.
// Every department is offered, with how many templates it holds.
export function TemplateIndex({ templates }: { templates: IndexTemplate[] }) {
  const params = useSearchParams()
  const initial = params.get("department")
  const [department, setDepartment] = useState<TemplateDepartment | null>(
    isDepartment(initial) ? initial : null,
  )
  const [query, setQuery] = useState(params.get("q") ?? "")

  const visible = templates.filter(
    (template) =>
      (!department || template.department === department) && matchesTemplateQuery(template, query),
  )

  function pick(next: TemplateDepartment | null) {
    setDepartment(next)
    writeParams(next, query)
  }

  function search(next: string) {
    setQuery(next)
    writeParams(department, next)
  }

  function clear() {
    setDepartment(null)
    setQuery("")
    writeParams(null, "")
  }

  const departments = Object.keys(templateDepartments) as TemplateDepartment[]
  const count = (key: TemplateDepartment | "all") =>
    key === "all" ? templates.length : templates.filter((t) => t.department === key).length

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="scrollbar-subtle -mx-5 flex overflow-x-auto px-5 md:mx-0 md:px-0">
          <RadioGroup
            aria-label="Department"
            value={department ?? "all"}
            onValueChange={(value) =>
              pick(isDepartment(value as string) ? (value as TemplateDepartment) : null)
            }
            className="flex shrink-0 gap-0.5 rounded-lg bg-muted p-[3px]"
          >
            {(["all", ...departments] as const).map((key) => (
              <Radio.Root
                key={key}
                value={key}
                className="inline-flex h-[30px] shrink-0 items-center gap-1.5 rounded-md px-3 text-[13px] leading-[18px] whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-link data-checked:bg-background data-checked:font-medium data-checked:text-foreground data-checked:shadow-[0_1px_2px_rgb(0_0_0/0.08)]"
              >
                {key === "all" ? "All" : templateDepartments[key]}
                <span className="font-normal text-muted-foreground tabular-nums">{count(key)}</span>
              </Radio.Root>
            ))}
          </RadioGroup>
        </div>
        <div className="relative md:w-72">
          <SearchIcon
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => search(event.target.value)}
            placeholder="Search templates"
            aria-label="Search templates"
            className="h-10 w-full rounded-lg border border-input bg-background pr-9 pl-9 text-sm leading-5 outline-none placeholder:text-muted-foreground focus:border-2 focus:border-primary focus:pr-[35px] focus:pl-[35px] dark:focus:border-link [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => search("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-1.5 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-link"
            >
              <XIcon className="size-4" />
            </button>
          )}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {visible.length === 1 ? "1 template" : `${visible.length} templates`}
      </p>

      {visible.length > 0 ? (
        <TemplateGrid templates={visible} />
      ) : (
        <div className="flex flex-col items-start gap-3 border-y py-10">
          <p className="text-base leading-6.5 text-muted-foreground">
            {query.trim()
              ? `No templates match “${query.trim()}”${department ? ` in ${templateDepartments[department]}` : ""}.`
              : "No templates in this department yet."}
          </p>
          <button
            type="button"
            onClick={clear}
            className="text-sm leading-5 font-medium text-link underline-offset-4 hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}
