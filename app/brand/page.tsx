import type { Metadata } from "next"
import { LegalPage } from "@/components/legal-page"
import { operator } from "@/lib/legal"

export const metadata: Metadata = {
  alternates: { canonical: "/brand" },
  title: "Brand guidelines",
  description: "The Sniptide logo, colors and type, and how to use them.",
}

const logos = [
  {
    name: "Logo on light backgrounds",
    file: "/brand/sniptide-lockup.svg",
    surface: "bg-white border border-[#e8e8e8] dark:border-transparent",
  },
  {
    name: "Logo on dark backgrounds",
    file: "/brand/sniptide-lockup-inverse.svg",
    surface: "bg-[#0c0b0b] border border-transparent dark:border-[#262626]",
  },
  {
    name: "Wordmark",
    file: "/brand/sniptide-wordmark.svg",
    surface: "bg-white border border-[#e8e8e8] dark:border-transparent",
  },
]

// The brand colors from DESIGN.md in the app repo.
const colors = [
  { name: "Tide Blue", hex: "#2A26EC", use: "The logo mark, buttons and links" },
  { name: "Pink", hex: "#F6A9D3", use: "The second brand color, used sparingly" },
  { name: "Ink", hex: "#0A0A0A", use: "The wordmark and text" },
  { name: "Paper", hex: "#FFFFFF", use: "Backgrounds and the logo on dark surfaces" },
]

export default function Page() {
  return (
    <LegalPage title="Brand guidelines" updated={false}>
      <p>
        You can use the Sniptide logo to link to Sniptide, write about it or show that your tool
        works with it. Use it as it comes, and ask us before you use it for anything else.
      </p>

      <h2>Logo</h2>
      <ul className="!list-none !gap-4 !pl-0">
        {logos.map((logo) => (
          <li key={logo.file} className="flex flex-col gap-2">
            <div
              className={`flex h-32 items-center justify-center rounded-lg px-8 ${logo.surface}`}
            >
              {/* biome-ignore lint/performance/noImgElement: a plain SVG file shown as it downloads */}
              <img src={logo.file} alt={logo.name} className="h-10 w-auto max-w-full" />
            </div>
            <a href={logo.file} download>
              Download the {logo.name.toLowerCase()} (SVG)
            </a>
          </li>
        ))}
      </ul>
      <ul>
        <li>
          Keep clear space around the logo at least as wide as one stripe of the mark is tall.
        </li>
        <li>Use the blue mark on light backgrounds and the white mark on dark ones.</li>
        <li>Don't recolor, stretch, rotate or add effects to the logo.</li>
        <li>Write the name as Sniptide, with one capital letter.</li>
      </ul>

      <h2>Colors</h2>
      <ul className="!list-none !gap-3 !pl-0">
        {colors.map((color) => (
          <li key={color.hex} className="flex items-center gap-4">
            <span
              aria-hidden="true"
              className="size-10 shrink-0 rounded-md border border-[#e8e8e8] dark:border-[#262626]"
              style={{ background: color.hex }}
            />
            <span className="flex flex-col">
              <span className="font-medium">
                {color.name} <code className="text-[#6b6b6b] dark:text-[#9a9a9a]">{color.hex}</code>
              </span>
              <span className="text-[#6b6b6b] dark:text-[#9a9a9a]">{color.use}</span>
            </span>
          </li>
        ))}
      </ul>

      <h2>Type</h2>
      <p>
        Headings use Archivo, text uses Inter and code, commands and paste links use Paper Mono.
      </p>

      <h2>Questions</h2>
      <p>
        For press, partnerships or a use not covered here, write to{" "}
        <a href={`mailto:${operator.email}`}>{operator.email}</a>.
      </p>
    </LegalPage>
  )
}
