import { ChevronRightIcon, EyeIcon, LockIcon, XIcon } from "lucide-react"

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
      <div className="flex h-75 shrink-0 items-center justify-center overflow-hidden border border-border bg-background px-6">
        {visual}
      </div>
      <div className="flex flex-col gap-1.5">
        <h3 className="text-base leading-5.5 font-semibold">{title}</h3>
        <p className="text-sm leading-5.5 text-muted-foreground">{children}</p>
      </div>
    </div>
  )
}

function ExpiryVisual() {
  const marks = ["1h", "1d", "1w", "1m", "never"]
  return (
    <div className="flex w-full flex-col gap-5.5 px-6 font-mono text-xs leading-4">
      <div className="flex items-center justify-between">
        <span>sniptide.com/p3Hc7v</span>
        <span className="bg-primary px-2 py-0.5 text-[11px] text-primary-foreground">
          expires in 14h
        </span>
      </div>
      <div className="relative h-7">
        <div className="absolute inset-x-0 top-3.25 h-0.5 bg-border" />
        <div className="absolute top-3 left-0 h-1 w-[62%] bg-primary" />
        <div className="absolute top-1 left-[62%] size-5 -translate-x-1/2 border-2 border-primary bg-background" />
      </div>
      <div className="flex justify-between text-[#8a8a8a]">
        {marks.map((mark) => (
          <span key={mark} className={mark === "1w" ? "text-foreground" : undefined}>
            {mark}
          </span>
        ))}
      </div>
    </div>
  )
}

function BurnVisual() {
  return (
    <div className="flex items-center font-mono text-[11px] leading-3.5 text-muted-foreground">
      <div className="flex flex-col items-center gap-2.5">
        <div className="flex size-16 items-center justify-center border border-foreground bg-background">
          <div className="flex flex-col gap-1.25">
            <div className="h-0.75 w-7.5 bg-foreground" />
            <div className="h-0.75 w-5.5 bg-foreground" />
            <div className="h-0.75 w-6.5 bg-primary" />
          </div>
        </div>
        paste
      </div>
      <div className="relative -top-3 h-0.5 w-10 bg-foreground sm:w-18" />
      <div className="flex flex-col items-center gap-2.5">
        <div className="flex size-16 items-center justify-center bg-primary">
          <EyeIcon className="size-6.5 text-primary-foreground" strokeWidth={2} />
        </div>
        1st view
      </div>
      <div className="relative -top-3 w-10 border-t-2 border-dashed border-[#b4b4b4] sm:w-18" />
      <div className="flex flex-col items-center gap-2.5">
        <div className="flex size-16 items-center justify-center border border-dashed border-[#b4b4b4]">
          <XIcon className="size-5.5 text-[#b4b4b4]" strokeWidth={2.2} />
        </div>
        gone
      </div>
    </div>
  )
}

function PasswordVisual() {
  return (
    <div className="flex w-75 flex-col gap-3 border border-foreground bg-background p-5.5 shadow-[6px_6px_0_var(--foreground)]">
      <LockIcon className="size-4.5" strokeWidth={2} />
      <p className="font-heading text-lg leading-5.5 font-bold tracking-[-0.01em]">
        PASSWORD NEEDED
      </p>
      <div className="flex h-9 items-center border-2 border-primary px-2.5 text-sm tracking-[0.2em]">
        ••••••••
      </div>
      <div className="flex h-9 items-center justify-center bg-primary text-[13px] font-medium text-primary-foreground">
        Unlock
      </div>
    </div>
  )
}

function SecretsVisual() {
  return (
    <div className="flex w-105 max-w-full flex-col border border-border text-xs">
      <div className="flex gap-4 overflow-hidden bg-sidebar px-4 py-3.5 font-mono leading-5 whitespace-pre">
        <div className="text-right text-[#b4b4b4]">{"1\n2\n3"}</div>
        <div>
          {
            "DATABASE_URL=postgres://localhost/app\nAWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE\nPORT=3000"
          }
        </div>
      </div>
      <div className="border-t border-primary bg-[#f3f3fe] px-4 py-2.25 leading-4.25 text-primary">
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
      className="flex scroll-mt-4 flex-col gap-10 border-t border-border bg-sidebar px-4 py-20 sm:px-8 lg:p-30"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <h2 className="max-w-155 font-heading text-3xl font-medium tracking-[-0.025em] md:text-[34px] md:leading-10">
          Sniptide is a pastebin with rules: who can open it, for how long, and how often.
        </h2>
        <a
          href="#features"
          className="flex h-9 shrink-0 items-center gap-1.5 self-start border border-border bg-background px-3.5 text-sm md:self-auto"
        >
          All features
          <ChevronRightIcon className="size-3" strokeWidth={2.5} />
        </a>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-5 md:flex-row">
          <Feature title="Links that expire on time" visual={<ExpiryVisual />}>
            Pick one hour, a day, a week, a month or never. When time's up, the link stops working.
          </Feature>
          <Feature title="Burn after read" visual={<BurnVisual />}>
            The first person to open it is the last. Made for keys and stack traces you only want
            seen once.
          </Feature>
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
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
