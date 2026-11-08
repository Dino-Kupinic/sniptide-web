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

// What a template's share card shows on its white panel: the tool's logo, or an icon with a name.
export type TemplateOgVisual =
  | { kind: "logo"; src: string; ratio: number }
  | { kind: "icon"; src: string; mark: string }

async function dataUrl(publicPath: string) {
  const svg = await readFile(join(process.cwd(), "public", publicPath))
  return `data:image/svg+xml;base64,${svg.toString("base64")}`
}

// The card for a template: the post card's black field, logo and Archivo title, with the template's
// visual on a white panel to the right, like the cover of its card in the directory. The artwork
// keeps its own colors on the panel. Rendered once per template at build time.
export async function renderTemplateOgImage({
  title,
  visual,
}: {
  title: string
  visual: TemplateOgVisual
}) {
  const [heading, image] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/Archivo-500.woff")),
    dataUrl(visual.src),
  ])
  const logoHeight = 60
  const logoWidth = visual.kind === "logo" ? Math.min(logoHeight * visual.ratio, 300) : 0

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
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
          // One size for every template: titles up to 50 characters take three lines at most.
          fontSize: 68,
          lineHeight: 1.05,
          letterSpacing: -2.2,
          maxWidth: 600,
        }}
      >
        {title}
      </div>
      <div
        style={{
          position: "absolute",
          right: 72,
          top: 175,
          width: 400,
          height: 280,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          borderRadius: 20,
          background: white,
          color: "#1b1919",
        }}
      >
        {visual.kind === "logo" ? (
          // biome-ignore lint/performance/noImgElement: next/og renders plain img elements only.
          <img src={image} alt="" width={logoWidth} height={logoHeight} />
        ) : (
          <>
            {/* biome-ignore lint/performance/noImgElement: next/og renders plain img elements only. */}
            <img src={image} alt="" width={72} height={72} />
            <div
              style={{
                display: "flex",
                fontFamily: "Archivo",
                fontSize: 48,
                letterSpacing: -1.4,
                maxWidth: 240,
              }}
            >
              {visual.mark}
            </div>
          </>
        )}
      </div>
    </div>,
    { ...ogSize, fonts: [{ name: "Archivo", data: heading, style: "normal", weight: 500 }] },
  )
}
