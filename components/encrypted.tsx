import { ArrowRightIcon } from "lucide-react"
import { EncryptionDemo } from "@/components/encryption-demo"
import { SectionHeading } from "@/components/section-heading"
import { docsPages } from "@/lib/links"

// The facts mirror the encrypted pastes page in the app's docs, including what the feature gives
// up, so the section never promises more than an encrypted paste does.
const facts = [
  {
    title: "Encrypted before it is saved",
    text: "Your browser encrypts the files, their names and the description with a key made for that paste.",
  },
  {
    title: "The key lives in the link",
    text: "Neither Sniptide nor anyone with a copy of its database or backups can read the files.",
  },
  {
    title: "Fixed once created",
    text: "An encrypted paste can't be edited, made public or read through the API, and its title stays readable.",
  },
]

export function Encrypted() {
  return (
    <section
      id="encrypted"
      data-cta-location="encrypted"
      className="flex scroll-mt-4 flex-col gap-10 border-t border-[#e8e8e8] bg-white section-frame py-16 text-[#1b1919] md:gap-14 md:py-20 xl:py-30 dark:border-[#1f1f1f] dark:bg-[#0a0a0a] dark:text-[#f5f5f5]"
    >
      <SectionHeading
        claim="Encrypt a paste before it leaves your browser."
        reason="The server never sees the key."
      />

      <EncryptionDemo />

      <ul className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {facts.map((fact) => (
          <li
            key={fact.title}
            className="flex flex-col gap-1.5 border-t border-[#e8e8e8] pt-4 dark:border-[#262626]"
          >
            <h3 className="text-base leading-5.5 font-semibold">{fact.title}</h3>
            <p className="text-base leading-6 text-[#6b6b6b] dark:text-[#a3a3a3]">{fact.text}</p>
          </li>
        ))}
      </ul>

      <a
        href={docsPages.encryptedPastes}
        className="raised-button flex h-10 items-center gap-2 self-start border border-[#e8e8e8] bg-white [--button-depth:#d0d0d0] px-4 text-sm leading-5 font-medium hover:border-[#1b1919] dark:border-[#262626] dark:bg-[#121216] dark:[--button-depth:#2a2a33] dark:hover:border-[#f5f5f5]"
      >
        See how the encryption works
        <ArrowRightIcon aria-hidden="true" className="size-4" strokeWidth={2} />
      </a>
    </section>
  )
}
