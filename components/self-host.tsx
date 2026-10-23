import { links } from "@/lib/links"
import { imageUrl } from "@/lib/site"

const boot = `$ docker run -d -p 3000:3000 ${imageUrl}

  ▚▚ SNIPTIDE  self-hosted
  ----------------------------------------------
  [boot] database ............................ ok
  [boot] storage (local disk) ................ ok
  [boot] secret scanner ...................... ok
  [boot] expiry worker ....................... ok

  ready on http://pastes.acme.internal:3000
$ _`

export function SelfHost() {
  return (
    <section
      id="self-host"
      data-cta-location="self-host"
      className="[--button-focus:#8f8cff] flex scroll-mt-4 flex-col gap-12 bg-[#0a0a0a] px-5 pb-16 text-white md:px-10 xl:gap-24 xl:px-30 xl:pb-24"
    >
      <div className="h-px bg-[#262626]" />

      <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between xl:gap-12 xl:pt-4">
        <div className="flex shrink-0 flex-col gap-5 xl:w-125">
          <h2 className="font-heading text-[34px] leading-9.5 font-medium tracking-[-0.035em] md:text-5xl md:leading-13">
            Your server. Your pastes. One command.
          </h2>
          <p className="text-[17px] leading-6.5 text-[#a3a3a3]">
            Run the same Sniptide we host, on your own hardware. Bring Postgres, keep every byte
            inside your network, and upgrade with a single pull.
          </p>
          <div className="flex flex-wrap gap-2.5 pt-2">
            <a
              href={links.selfHost}
              className="raised-button flex h-11 items-center bg-[#2a26ec] px-5 text-[15px] leading-4.5 font-semibold hover:bg-[#3a36ff]"
            >
              Read the guide
            </a>
            <a
              href={links.github}
              className="raised-button flex h-11 items-center gap-2 bg-[#0a0a0a] [--button-depth:#3a3a3a] border border-[#3a3a3a] px-5 text-[15px] leading-4.5 font-semibold hover:bg-white/5"
            >
              <span className="size-2.25 bg-white" />
              Star on GitHub
            </a>
          </div>
        </div>

        <div className="min-w-0 overflow-hidden rounded-lg border border-[#262626] bg-[#111111] xl:max-w-150 xl:flex-1">
          <div className="flex h-10 items-center justify-between border-b border-[#262626] px-4">
            <div className="flex gap-1.5">
              <span className="size-2.25 border border-[#444444]" />
              <span className="size-2.25 border border-[#444444]" />
              <span className="size-2.25 border border-[#444444]" />
            </div>
            <span className="font-mono text-xs text-[#6b6b6b]">~/infra</span>
          </div>
          <pre className="overflow-x-auto px-5.5 pt-5.5 pb-6.5 font-mono text-[13px] leading-6 text-[#d4d4d4]">
            {boot}
          </pre>
        </div>
      </div>

      <div className="flex flex-col items-start gap-3.5 rounded-lg border border-[#262626] p-5 md:flex-row md:items-center md:gap-4 md:px-6 md:py-5.5">
        <span className="flex h-6 shrink-0 items-center rounded-sm border border-[#8f8cff] px-2 font-mono text-[11px] leading-3.5 tracking-[0.08em] text-[#8f8cff]">
          COMING SOON
        </span>
        <p className="text-[17px] leading-5.5 font-medium">
          Sniptide Registry: snippets your agents can install, version and trust.
        </p>
      </div>
    </section>
  )
}
