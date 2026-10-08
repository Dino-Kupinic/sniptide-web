import { Button } from "@sniptide/ui/components/button"
import { Logo } from "@sniptide/ui/components/logo"
import { ChevronRightIcon } from "lucide-react"
import { links } from "@/lib/links"

const nav = [
  { label: "Features", href: "#features" },
  { label: "Analytics", href: "#analytics" },
  { label: "Raw links", href: "#raw-links" },
]

export function SiteHeader() {
  return (
    <header>
      <div className="flex h-9 items-center justify-center gap-2.5 border-b border-border px-4 text-[13px] leading-[18px]">
        <span className="text-[#3f3f3f]">Import any public GitHub gist in one click.</span>
        <a
          href={links.importGist}
          className="flex items-center gap-1 font-medium text-primary hover:underline"
        >
          Try it
          <ChevronRightIcon className="size-3" strokeWidth={2.5} />
        </a>
      </div>

      <div className="flex h-17 items-center justify-between px-4 sm:px-8 lg:px-30">
        <a href="/" className="shrink-0 md:w-50">
          <Logo className="[&>span:last-child]:text-[22px]" />
        </a>
        <nav className="hidden items-center gap-9 text-sm md:flex">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="hover:text-primary">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex shrink-0 items-center justify-end gap-2 md:w-50">
          <Button
            variant="ghost"
            className="hidden h-9 px-3.5 text-sm font-normal sm:inline-flex"
            render={<a href={links.signIn} />}
            nativeButton={false}
          >
            Sign in
          </Button>
          <Button
            className="h-9 px-3.5 text-sm"
            render={<a href={links.signUp} />}
            nativeButton={false}
          >
            Get started
            <ChevronRightIcon className="size-3" strokeWidth={2.5} />
          </Button>
        </div>
      </div>
    </header>
  )
}
