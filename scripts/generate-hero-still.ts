// Renders the first frame of the hero horizon to small PNGs in `public/landing`. The hero shows
// them behind its canvas, so the scene is there on the first paint and the animation takes over
// when the page hydrates. Run it again after changing `drawHorizon` in `lib/motion.ts`:
//
//   bun scripts/generate-hero-still.ts
import sharp from "sharp"
import { drawHorizon } from "../lib/motion"

// One pixel per canvas cell. The canvas uses 4px cells, so these are the hero's size divided by
// four: 1440 by 880 on desktops, and the fixed 1178 by 720 crop on phones.
const sizes = { desktop: [360, 220], phone: [295, 180] } as const
// `PixelCanvas` starts its clock six seconds in, so this is the frame it draws first.
const firstFrame = 6

for (const [name, [width, height]] of Object.entries(sizes)) {
  for (const mode of ["day", "night"] as const) {
    const image = { width, height, data: new Uint8ClampedArray(width * height * 4) } as ImageData
    drawHorizon(image, firstFrame, mode, false)
    const file = `public/landing/hero-${mode}-${name}.png`
    await sharp(Buffer.from(image.data.buffer), { raw: { width, height, channels: 4 } })
      .png({ palette: true, compressionLevel: 9 })
      .toFile(file)
    console.log(file)
  }
}
