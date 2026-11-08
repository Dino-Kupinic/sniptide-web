import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"
import { bars, wordmark } from "@/components/brand"
import { siteName } from "@/lib/site"

export const ogSize = { width: 1200, height: 630 }
export const ogContentType = "image/png"

// The logo card from the Paper file (Brand, "OG v3 · Main"): the white logo, large, in the middle of
// a black field. The page title and description travel in the preview text, so the card carries
// only the logo.
const background = "#000000"
const white = "#ffffff"

// The 1200 by 630 card for links shared on X, Slack, Discord and the like. It is rendered once at
// build time.
export function renderOgImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
        <svg width={112} height={109} viewBox="2 2 20 19.27" role="img" aria-label={siteName}>
          <g fill={white}>
            {bars.map((points) => (
              <polygon key={points} points={points} />
            ))}
          </g>
        </svg>
        <svg width={503} height={79} viewBox="1341 238 4340 683" role="img" aria-label={siteName}>
          <g transform="translate(0,1080) scale(0.1,-0.1)" fill={white}>
            <path d={wordmark} />
          </g>
        </svg>
      </div>
    </div>,
    ogSize,
  )
}

// The card for a blog post: the logo card's black field and white logo, smaller in the top left,
// with the post title in Archivo below it, so a shared post says what it is about. Rendered once
// per post at build time.
export async function renderPostOgImage({ title }: { title: string }) {
  const heading = await readFile(join(process.cwd(), "assets/fonts/Archivo-500.woff"))

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background,
        color: white,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <svg width={41} height={40} viewBox="2 2 20 19.27" role="img" aria-label={siteName}>
          <g fill={white}>
            {bars.map((points) => (
              <polygon key={points} points={points} />
            ))}
          </g>
        </svg>
        <svg width={184} height={29} viewBox="1341 238 4340 683" role="img" aria-label={siteName}>
          <g transform="translate(0,1080) scale(0.1,-0.1)" fill={white}>
            <path d={wordmark} />
          </g>
        </svg>
      </div>
      <div
        style={{
          display: "flex",
          fontFamily: "Archivo",
          // One size for every post: titles up to 70 characters take three lines at most.
          fontSize: 76,
          lineHeight: 1.04,
          letterSpacing: -2.5,
          maxWidth: 1000,
        }}
      >
        {title}
      </div>
    </div>,
    { ...ogSize, fonts: [{ name: "Archivo", data: heading, style: "normal", weight: 500 }] },
  )
}

// What a template's share card shows over its code: the tool's logo, or an icon with a name.
export type TemplateOgVisual =
  | { kind: "logo"; src: string; ratio: number }
  | { kind: "icon"; src: string; mark: string }

async function dataUrl(publicPath: string) {
  const svg = await readFile(join(process.cwd(), "public", publicPath))
  return `data:image/svg+xml;base64,${svg.toString("base64")}`
}

// The dark syntax colors from DESIGN.md, applied by a small line-based guess: share images can't
// run the highlighter, and a glimpse only needs headings, keys and values to read as code.
const syntax = {
  foreground: "#f4f4f4",
  keyword: "#8f8cff",
  property: "#fb9fb1",
  string: "#5fd3a8",
  comment: "#8a8a8a",
}

function codeLine(line: string) {
  const text = line.length > 46 ? `${line.slice(0, 45)}…` : line
  if (/^\s*(#|\/\/|<!--|---$)/.test(text)) {
    const heading = /^#{1,6} /.test(text)
    return [{ text, color: heading ? syntax.keyword : syntax.comment }]
  }
  const pair = /^(\s*-?\s*)([\w."@/-]+)(:\s?)(.*)$/.exec(text)
  if (pair) {
    const [, indent = "", key = "", colon = "", value = ""] = pair
    return [
      { text: indent, color: syntax.foreground },
      { text: key, color: syntax.property },
      { text: colon, color: syntax.foreground },
      { text: value, color: /^["'\d]/.test(value) ? syntax.string : syntax.foreground },
    ]
  }
  return [{ text, color: syntax.foreground }]
}

const deep = "#0c0b0b"
const raised = "#1a1919"
const hairline = "#2f2c2c"
const ash = "#a3a3a3"

// The card for a template, drawn like its card in the directory: the main file's first lines on a
// raised panel that runs off the right edge, the tool's logo or icon on a white chip over it, and
// the title on the left. Rendered once per template at build time.
export async function renderTemplateOgImage({
  title,
  file,
  code,
  visual,
}: {
  title: string
  file: string
  code: string
  visual: TemplateOgVisual
}) {
  const [heading, mono, image] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/Archivo-500.woff")),
    readFile(join(process.cwd(), "assets/fonts/PaperMono-400.ttf")),
    dataUrl(visual.src),
  ])
  const lines = code.split("\n").slice(0, 14)
  const logoHeight = 58
  const logoWidth = visual.kind === "logo" ? Math.min(logoHeight * visual.ratio, 280) : 0

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: deep,
        color: white,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 620,
          top: 72,
          width: 640,
          height: 640,
          display: "flex",
          flexDirection: "column",
          borderRadius: 20,
          border: `2px solid ${hairline}`,
          background: raised,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            padding: "18px 28px",
            borderBottom: `2px solid ${hairline}`,
            fontFamily: "Paper Mono",
            fontSize: 20,
            color: ash,
          }}
        >
          {file}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "18px 28px",
            fontFamily: "Paper Mono",
            fontSize: 21,
            lineHeight: 1.6,
            opacity: 0.55,
          }}
        >
          {lines.map((line, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: lines repeat, and the list never reorders.
            <div key={index} style={{ display: "flex", whiteSpace: "pre", height: 34 }}>
              <span style={{ width: 44, color: "#5c5959" }}>{index + 1}</span>
              {codeLine(line).map((part, partIndex) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: parts of one line never reorder.
                <span key={partIndex} style={{ color: part.color }}>
                  {part.text}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 620,
          top: 72,
          width: 640,
          height: 640,
          display: "flex",
          background: `linear-gradient(to bottom, rgba(12,11,11,0) 45%, ${deep} 100%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          // Centered on the part of the panel inside the card.
          left: 620,
          top: 351,
          width: 580,
          height: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            height: 120,
            padding: "0 44px",
            borderRadius: 18,
            background: white,
            color: "#1b1919",
            boxShadow: "0 24px 48px -12px rgba(0,0,0,0.7)",
          }}
        >
          {visual.kind === "logo" ? (
            // biome-ignore lint/performance/noImgElement: next/og renders plain img elements only.
            <img src={image} alt="" width={logoWidth} height={logoHeight} />
          ) : (
            <>
              {/* biome-ignore lint/performance/noImgElement: next/og renders plain img elements only. */}
              <img src={image} alt="" width={56} height={56} />
              <div
                style={{
                  display: "flex",
                  fontFamily: "Archivo",
                  fontSize: 44,
                  letterSpacing: -1.2,
                }}
              >
                {visual.mark}
              </div>
            </>
          )}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 72,
          top: 72,
          bottom: 72,
          width: 480,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <svg width={41} height={40} viewBox="2 2 20 19.27" role="img" aria-label={siteName}>
            <g fill={white}>
              {bars.map((points) => (
                <polygon key={points} points={points} />
              ))}
            </g>
          </svg>
          <svg width={184} height={29} viewBox="1341 238 4340 683" role="img" aria-label={siteName}>
            <g transform="translate(0,1080) scale(0.1,-0.1)" fill={white}>
              <path d={wordmark} />
            </g>
          </svg>
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "Archivo",
            // One size for every template: titles up to 50 characters take four lines at most.
            fontSize: 64,
            lineHeight: 1.06,
            letterSpacing: -2,
          }}
        >
          {title}
        </div>
      </div>
    </div>,
    {
      ...ogSize,
      fonts: [
        { name: "Archivo", data: heading, style: "normal", weight: 500 },
        { name: "Paper Mono", data: mono, style: "normal", weight: 400 },
      ],
    },
  )
}
