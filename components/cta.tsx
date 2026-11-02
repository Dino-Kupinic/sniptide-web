import { links } from "@/lib/links"

export function Cta() {
  return (
    <section
      data-cta-location="cta"
      className="flex h-110 flex-col justify-center gap-4 overflow-clip bg-[#2a26ec] px-5 md:h-135 md:gap-4.5 md:px-10 lg:px-30 dark:cta-dusk"
    >
      <h2 className="font-heading text-4xl leading-10 font-medium tracking-[-0.03em] text-white md:text-[44px] md:leading-12">
        Start sharing on Sniptide.
      </h2>
      <p className="max-w-110 text-base leading-6.5 text-[#d9d8ff]">
        Share code on the open web, or on your own servers. Free, fast and always yours.
      </p>
      <div className="flex flex-wrap items-center gap-2.5 pt-2.5">
        <a
          href={links.signUp}
          className="raised-button flex h-11 items-center gap-2 bg-white [--button-depth:#b6b4ff] [--button-focus:white] px-4.5 text-[15px] leading-5 font-medium text-[#2a26ec] hover:bg-white/90"
        >
          <span className="size-2.25 bg-[#2a26ec]" />
          Create a free account
        </a>
        <a
          href={links.signIn}
          className="raised-button flex h-11 items-center bg-[#4744f0] [--button-focus:white] px-4.5 text-[15px] leading-5 font-medium text-white hover:bg-[#5552f2] dark:bg-[#2a26ec] dark:hover:bg-[#3a36ff]"
        >
          Sign in
        </a>
      </div>
    </section>
  )
}
