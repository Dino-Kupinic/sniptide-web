import { ChevronRightIcon, EyeIcon, LockIcon, XIcon } from "lucide-react"
import { links } from "@/lib/links"

function Feature({
  title,
  children,
  visual,
}: {
  title: string
  children: React.ReactNode
  visual: React.ReactNode
}) {
  return (
    <div className="flex min-w-0 flex-1 basis-0 flex-col gap-5">
      <div className="flex h-44 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#e8e8e8] bg-white md:h-75 dark:border-[#262626] dark:bg-[#141414]">
        {visual}
      </div>
      <div className="flex flex-col gap-1.5">
        <h3 className="text-base leading-5.5 font-semibold">{title}</h3>
        <p className="text-sm leading-5.5 text-[#6b6b6b] dark:text-[#9a9a9a]">{children}</p>
      </div>
    </div>
  )
}

function ExpiryVisual() {
  const marks = ["1h", "1d", "1w", "1m", "never"]
  return (
    <div className="flex w-full flex-col gap-5.5 px-6 font-mono text-xs leading-4 md:px-12">
      <div className="flex items-center justify-between gap-3">
        <span>sniptide.com/p3Hc7v</span>
        <span className="shrink-0 rounded-sm bg-[#2a26ec] px-2 py-0.5 text-[11px] text-white">
          expires in 14h
        </span>
      </div>
      <div className="relative h-7">
        <div className="absolute inset-x-0 top-3.25 h-0.5 bg-[#e8e8e8] dark:bg-[#2a2a2a]" />
        <div className="absolute top-3 left-0 h-1 w-[62%] bg-[#2a26ec]" />
        <div className="absolute top-1 left-[62%] size-5 rounded-sm border-2 border-[#2a26ec] bg-white dark:bg-[#0a0a0a]" />
      </div>
      <div className="flex justify-between text-[#8a8a8a]">
        {marks.map((mark) => (
          <span
            key={mark}
            className={mark === "1w" ? "text-[#1b1919] dark:text-[#f5f5f5]" : undefined}
          >
            {mark}
          </span>
        ))}
      </div>
    </div>
  )
}

function BurnVisual() {
  return (
    <div className="flex items-center font-mono text-[11px] leading-3.5 text-[#6b6b6b] dark:text-[#9a9a9a]">
      <div className="flex flex-col items-center gap-2.5">
        <div className="flex size-16 items-center justify-center rounded-md border border-[#1b1919] bg-white dark:border-[#e5e5e5] dark:bg-[#141414]">
          <div className="flex flex-col gap-1.25">
            <div className="h-0.75 w-7.5 bg-[#1b1919] dark:bg-[#e5e5e5]" />
            <div className="h-0.75 w-5.5 bg-[#1b1919] dark:bg-[#e5e5e5]" />
            <div className="h-0.75 w-6.5 bg-[#2a26ec]" />
          </div>
        </div>
        paste
      </div>
      <div className="relative -top-3 h-0.5 w-10 bg-[#1b1919] sm:w-18 dark:bg-[#e5e5e5]" />
      <div className="flex flex-col items-center gap-2.5">
        <div className="flex size-16 items-center justify-center rounded-md bg-[#2a26ec]">
          <EyeIcon className="size-6.5 text-white" strokeWidth={2} />
        </div>
        1st view
      </div>
      <div className="relative -top-3 w-10 border-t-2 border-dashed border-[#b4b4b4] sm:w-18" />
      <div className="flex flex-col items-center gap-2.5">
        <div className="flex size-16 items-center justify-center rounded-md border border-dashed border-[#b4b4b4]">
          <XIcon className="size-5.5 text-[#b4b4b4]" strokeWidth={2.2} />
        </div>
        gone
      </div>
    </div>
  )
}

function PasswordVisual() {
  return (
    <div className="flex w-75 origin-center scale-[0.78] flex-col gap-3 rounded-lg border border-[#1b1919] bg-white p-5.5 shadow-lg md:scale-100 dark:border-[#e5e5e5] dark:bg-[#141414]">
      <LockIcon className="size-4.5" strokeWidth={2} />
      <p className="text-lg leading-5.5 font-bold tracking-[-0.01em]">PASSWORD NEEDED</p>
      <div className="flex h-9 items-center rounded-md border-2 border-[#2a26ec] px-2.5 text-sm tracking-[0.2em]">
        ••••••••
      </div>
      <div className="flex h-9 items-center justify-center rounded-lg bg-[#2a26ec] text-[13px] shadow-[0_2px_0_0_#1a1792] leading-4.5 font-medium text-white">
        Unlock
      </div>
    </div>
  )
}

function SecretsVisual() {
  return (
    <div className="mx-4 flex w-105 max-w-full flex-col overflow-hidden rounded-lg border border-[#e8e8e8] text-xs dark:border-[#262626]">
      <div className="flex gap-4 overflow-hidden bg-[#fafafa] px-4 py-3.5 font-mono leading-5 whitespace-pre dark:bg-[#1a1a1a]">
        <div className="text-right text-[#b4b4b4]">{"1\n2\n3"}</div>
        <div>
          {
            "DATABASE_URL=postgres://localhost/app\nAWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE\nPORT=3000"
          }
        </div>
      </div>
      <div className="border-t border-[#2a26ec] bg-[#f3f3fe] px-4 py-2.25 leading-4.25 text-[#2a26ec] dark:bg-[#17163a] dark:text-[#8f8cff]">
        Line 2 of .env looks like an AWS access key. Remove it or keep the paste private.
      </div>
    </div>
  )
}

export function Features() {
  return (
    <section
      id="features"
      data-cta-location="features"
      className="flex scroll-mt-4 flex-col gap-7 border-t border-[#e8e8e8] bg-[#fafafa] px-5 py-16 text-[#1b1919] md:gap-10 md:p-10 lg:p-30 dark:border-[#1f1f1f] dark:bg-[#0f0f0f] dark:text-[#f5f5f5]"
    >
      <div className="flex flex-col items-start gap-5 md:flex-row md:items-end md:justify-between">
        <h2 className="max-w-155 font-heading text-[28px] leading-8.5 font-medium tracking-[-0.025em] md:text-[34px] md:leading-10">
          Sniptide is a pastebin with rules: who can open it, for how long, and how often.
        </h2>
        <a
          href={links.docs}
          className="raised-button flex h-9 shrink-0 items-center gap-1.5 [--button-depth:#d0d0d0] dark:[--button-depth:#383838] border border-[#e8e8e8] bg-white px-3.5 text-sm leading-5 hover:border-[#1b1919] dark:border-[#262626] dark:bg-[#141414] dark:hover:border-[#f5f5f5]"
        >
          All features
          <ChevronRightIcon className="size-3" strokeWidth={2.5} />
        </a>
      </div>

      <div className="flex flex-col gap-8 md:gap-5">
        <div className="flex flex-col gap-8 md:flex-row md:gap-5">
          <Feature title="Links that expire on time" visual={<ExpiryVisual />}>
            Pick one hour, a day, a week, a month or never. When time's up, the link stops working.
          </Feature>
          <Feature title="Burn after read" visual={<BurnVisual />}>
            The first person to open it is the last. Made for keys and stack traces you only want
            seen once.
          </Feature>
        </div>
        <div className="flex flex-col gap-8 md:flex-row md:gap-5">
          <Feature title="Password protection" visual={<PasswordVisual />}>
            Visitors need the password before they see a single line. Change it and old unlocks stop
            working.
          </Feature>
          <Feature title="Secret warnings" visual={<SecretsVisual />}>
            Pasted an API key by accident? The editor spots keys and tokens before anyone else sees
            them.
          </Feature>
        </div>
      </div>
    </section>
  )
}
