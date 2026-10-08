import { links } from "@/lib/links"

const columns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Analytics", href: "#analytics" },
      { label: "Raw links", href: "#raw-links" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", href: links.signIn },
      { label: "Create account", href: links.signUp },
      { label: "Import a gist", href: links.importGist },
    ],
  },
  {
    title: "Legal",
    // TODO: no Terms or Privacy pages exist yet.
    links: [
      { label: "Terms", href: "#" },
      { label: "Privacy", href: "#" },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="flex flex-col gap-14 px-4 pt-18 pb-10 sm:px-8 lg:px-30">
      <div className="flex flex-col gap-12 md:flex-row md:justify-between">
        <div className="flex w-80 flex-col gap-3.5">
          <p className="flex items-center gap-2 text-[13px] leading-4.5 font-medium text-primary">
            <span className="size-1.75 bg-primary" />
            All systems operational
          </p>
          <p className="text-[13px] leading-5 text-muted-foreground">Short links for your code.</p>
        </div>
        <div className="flex gap-12 sm:gap-20">
          {columns.map((column) => (
            <div key={column.title} className="flex flex-col gap-3 text-[13px] leading-4.5">
              <p className="font-semibold">{column.title}</p>
              {column.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-border pt-6">
        <p className="text-xs text-[#8a8a8a]">© 2026 Sniptide</p>
        <p className="font-heading text-[13px] font-bold tracking-[-0.01em]">SNIPTIDE</p>
      </div>
    </footer>
  )
}
