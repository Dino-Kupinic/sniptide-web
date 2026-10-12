import { Button } from "@sniptide/ui/components/button"
import { links } from "@/lib/links"

const session = `$ curl -s sniptide.com/9fLm3a/raw | head -4
server {
  listen 443 ssl http2;
  server_name app.example.com;

$ curl -s sniptide.com/k7Qe2x/raw?file=use-debounce.ts \\
    -o src/hooks/use-debounce.ts

$ curl -sI sniptide.com/Xw81bP/raw
HTTP/2 404
$ _`

export function RawLinks() {
  return (
    <section
      id="raw-links"
      data-cta-location="raw-links"
      className="flex scroll-mt-4 flex-col gap-12 bg-[#121111] px-4 py-20 sm:px-8 lg:flex-row lg:items-center lg:gap-20 lg:p-30"
    >
      <div className="flex shrink-0 flex-col gap-5 lg:w-110">
        <p className="text-sm font-medium text-[#8f8cff]">For the terminal</p>
        <h2 className="font-heading text-4xl font-medium tracking-[-0.03em] text-white md:text-5xl md:leading-13">
          Every paste is one curl away.
        </h2>
        <p className="text-base leading-6.5 text-[#a3a3a3]">
          Each file has a raw URL that serves plain text, so you can pipe a paste straight into a
          shell, a config, or a teammate's terminal.
        </p>
        <div className="flex items-center gap-2.5 pt-2">
          <Button
            className="h-10 gap-2 px-4 text-sm"
            render={<a href={links.newPaste} />}
            nativeButton={false}
          >
            <span className="size-2 bg-primary-foreground" />
            Create a paste
          </Button>
          <Button
            variant="outline"
            className="h-10 border-[#3a3737] bg-transparent px-4 text-sm text-white hover:bg-white/5 hover:text-white"
            render={<a href="#raw-links" />}
            nativeButton={false}
          >
            Raw links explained
          </Button>
        </div>
      </div>

      <div className="min-w-0 grow border border-[#2c2a2a] bg-[#1b1919]">
        <div className="flex h-10 items-center justify-between border-b border-[#2c2a2a] px-4">
          <div className="flex gap-1.5">
            <span className="size-2.25 border border-[#4a4747]" />
            <span className="size-2.25 border border-[#4a4747]" />
            <span className="size-2.25 border border-[#4a4747]" />
          </div>
          <span className="font-mono text-[11px] text-muted-foreground">zsh</span>
        </div>
        <pre className="overflow-x-auto px-5.5 pt-5.5 pb-6.5 font-mono text-[13px] leading-5.5 text-[#d4d4d4]">
          {session}
        </pre>
      </div>
    </section>
  )
}
