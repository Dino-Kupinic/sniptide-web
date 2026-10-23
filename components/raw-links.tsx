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

// Dark in both themes: this and the self-host section read as one terminal band.
export function RawLinks() {
  return (
    <section
      id="raw-links"
      data-cta-location="raw-links"
      className="[--button-focus:#8f8cff] flex scroll-mt-4 flex-col gap-8 bg-[#0a0a0a] px-5 py-16 md:p-10 xl:flex-row xl:items-center xl:gap-20 xl:p-30"
    >
      <div className="flex shrink-0 flex-col gap-5 xl:w-110">
        <h2 className="font-heading text-[34px] leading-9.5 font-medium tracking-[-0.03em] text-white md:text-5xl md:leading-13">
          Every paste is one curl away.
        </h2>
        <p className="text-base leading-6.5 text-[#a3a3a3]">
          Each file has a raw URL that serves plain text, so you can pipe a paste straight into a
          shell, a config, or a teammate's terminal.
        </p>
        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          <a
            href={links.newPaste}
            className="raised-button flex h-10 items-center gap-2 bg-[#2a26ec] px-4 text-sm leading-5 font-medium text-white hover:bg-[#3a36ff]"
          >
            <span className="size-2 bg-white" />
            Create a paste
          </a>
          <a
            href={links.apiDocs}
            className="raised-button flex h-10 items-center border border-[#3a3737] bg-[#0a0a0a] [--button-depth:#3a3737] px-4 text-sm leading-5 font-medium text-white hover:bg-white/5"
          >
            Raw links explained
          </a>
        </div>
      </div>

      <div className="min-w-0 grow overflow-hidden rounded-lg border border-[#2c2a2a] bg-[#1b1919]">
        <div className="flex h-10 items-center justify-between border-b border-[#2c2a2a] px-4">
          <div className="flex gap-1.5">
            <span className="size-2.25 border border-[#4a4747]" />
            <span className="size-2.25 border border-[#4a4747]" />
            <span className="size-2.25 border border-[#4a4747]" />
          </div>
          <span className="font-mono text-[11px] text-[#6b6b6b]">zsh</span>
        </div>
        <pre className="overflow-x-auto px-5.5 pt-5.5 pb-6.5 font-mono text-[13px] leading-5.5 text-[#d4d4d4]">
          {session}
        </pre>
      </div>
    </section>
  )
}
