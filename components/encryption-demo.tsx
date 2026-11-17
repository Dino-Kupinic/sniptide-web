"use client"

import { ArrowRightIcon, LockKeyholeIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { exampleKey } from "@/lib/encryption-example"

// The same paste on both sides of the encryption: what the author reads in the browser and what
// the server stores. While the figure is on screen the stored side scrambles into fresh ciphertext
// every few seconds, the way a new nonce changes every save. Under reduced motion it stays still.
const plain = [
  "# Staging access",
  "",
  "ssh deploy@10.0.4.12",
  "DB password is in 1Password,",
  "rotate it after the demo.",
]

// The first frame, fixed so the server render and the first client render agree.
const initialCipher = [
  "q9F2kLx0Vb7mYt4Rw1Pz",
  "Hc8sNd3Ue6Ga5Jo2Xi0K",
  "Lr7Bv1Tq4Mn9Sy6Dw3Fe",
  "Zp0Ck8Wu2Ah5Ox7Ig1Ej",
  "Ys4Rb6Nl9Vd3Qm0Tf8==",
]

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"

function randomLine(length: number) {
  let line = ""
  for (let i = 0; i < length; i++) line += alphabet[Math.floor(Math.random() * alphabet.length)]
  return line
}

function useCipher() {
  const ref = useRef<HTMLDivElement>(null)
  const [lines, setLines] = useState(initialCipher)

  useEffect(() => {
    const element = ref.current
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let visible = false
    let frames: ReturnType<typeof setInterval> | undefined
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false
    })
    observer.observe(element)

    // Every 3.5 seconds, eight quick frames of noise settle on a new ciphertext.
    const cycle = setInterval(() => {
      if (!visible) return
      let frame = 0
      clearInterval(frames)
      frames = setInterval(() => {
        frame++
        // The last row keeps the base64 padding, like the end of a real ciphertext.
        setLines(
          initialCipher.map((line, i) =>
            i === 4 ? `${randomLine(18)}==` : randomLine(line.length),
          ),
        )
        if (frame === 8) clearInterval(frames)
      }, 45)
    }, 3500)

    return () => {
      observer.disconnect()
      clearInterval(cycle)
      clearInterval(frames)
    }
  }, [])

  return { ref, lines }
}

const pane =
  "flex min-w-0 flex-col overflow-hidden rounded-lg border border-[#e8e8e8] bg-white dark:border-[#2f2c2c] dark:bg-[#121111]"
const paneHeader =
  "flex h-10 items-center justify-between gap-3 border-b border-[#e8e8e8] px-4 text-sm leading-5 dark:border-[#2f2c2c]"
const paneBody = "flex flex-col px-4 py-4 font-mono text-[13px] leading-6"

export function EncryptionDemo() {
  const { ref, lines } = useCipher()

  return (
    <figure
      aria-label="A paste readable in the browser and stored as ciphertext on the server, with the key in its link"
      className="flex flex-col gap-4"
    >
      <div
        ref={ref}
        className="grid items-center gap-3 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-4"
      >
        <div className={pane}>
          <div className={paneHeader}>
            <span className="font-medium">In your browser</span>
            <span className="truncate font-mono text-[13px] text-[#6b6b6b] dark:text-[#a3a3a3]">
              staging.md
            </span>
          </div>
          <div className={paneBody}>
            {plain.map((line, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: the lines are fixed and the empty one repeats no key otherwise.
              <span key={i} className="min-h-6 truncate">
                {line}
              </span>
            ))}
          </div>
        </div>

        <div
          aria-hidden="true"
          className="flex items-center justify-center gap-2 font-mono text-[13px] leading-5 text-[#6b6b6b] lg:flex-col dark:text-[#a3a3a3]"
        >
          <LockKeyholeIcon className="size-4 text-[#2a26ec] dark:text-[#8f8cff]" strokeWidth={2} />
          <span>AES-256-GCM</span>
          <ArrowRightIcon className="size-4 rotate-90 lg:rotate-0" strokeWidth={2} />
        </div>

        <div className={pane}>
          <div className={paneHeader}>
            <span className="font-medium">On the server</span>
            <span className="truncate font-mono text-[13px] text-[#6b6b6b] dark:text-[#a3a3a3]">
              ciphertext
            </span>
          </div>
          {/* The noise means nothing, so assistive technology hears the figure's label instead. */}
          <div aria-hidden="true" className={paneBody}>
            {lines.map((line, i) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: each row keeps its place while its text changes.
                key={i}
                className="min-h-6 truncate text-[#6b6b6b] tabular-nums dark:text-[#a3a3a3]"
              >
                {line}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex h-11 min-w-0 items-center rounded-lg border border-[#e8e8e8] bg-white px-4 font-mono text-[13px] dark:border-[#2f2c2c] dark:bg-[#121111]">
        <span className="shrink-0">sniptide.com/k7Qe2x</span>
        <span className="truncate text-[#2a26ec] dark:text-[#8f8cff]">#key={exampleKey}</span>
      </div>
    </figure>
  )
}
