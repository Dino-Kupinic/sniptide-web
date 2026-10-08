import { Button } from "@sniptide/ui/components/button"
import { links } from "@/lib/links"

// White barcode stripes on the right of the CTA band: [x, y, width, height, opacity].
const stripes: [number, number, number, number, number][] = [
  [12, 0, 1, 360, 0.16],
  [35, 0, 6, 360, 0.17],
  [44, 0, 1, 124, 0.21],
  [49, 0, 2, 360, 0.22],
  [62, 0, 4, 175, 0.15],
  [82, 0, 4, 360, 0.2],
  [100, 0, 10, 360, 0.3],
  [132, 0, 1, 359, 0.35],
  [136, 0, 2, 360, 0.34],
  [158, 0, 1, 360, 0.29],
  [162, 0, 1, 360, 0.37],
  [177, 0, 3, 81, 0.42],
  [193, 64, 4, 296, 0.29],
  [211, 0, 10, 360, 0.42],
  [232, 0, 6, 360, 0.39],
  [241, 133, 2, 216, 0.46],
  [249, 0, 10, 360, 0.49],
  [288, 0, 10, 360, 0.54],
  [314, 0, 3, 175, 0.57],
  [339, 0, 1, 360, 0.47],
  [356, 0, 4, 360, 0.62],
  [366, 176, 2, 125, 0.57],
  [389, 171, 1, 189, 0.68],
  [399, 0, 6, 54, 0.52],
  [414, 0, 2, 360, 0.48],
  [426, 0, 2, 287, 0.54],
  [430, 0, 4, 360, 0.56],
  [438, 71, 6, 216, 0.77],
  [460, 0, 1, 190, 0.84],
  [464, 0, 4, 360, 0.65],
  [478, 0, 4, 360, 0.64],
  [491, 161, 4, 199, 0.89],
  [501, 0, 6, 360, 0.65],
  [511, 0, 6, 197, 0.74],
  [521, 31, 1, 329, 0.58],
  [525, 0, 1, 360, 0.75],
  [528, 0, 3, 360, 0.81],
  [537, 0, 1, 360, 0.79],
  [542, 0, 1, 360, 0.88],
  [552, 64, 1, 296, 0.64],
  [567, 109, 1, 251, 0.88],
  [582, 121, 6, 239, 0.89],
  [592, 0, 1, 360, 0.77],
  [597, 0, 10, 360, 0.88],
]

export function Cta() {
  return (
    <section className="relative flex flex-col justify-center gap-4.5 overflow-clip bg-primary px-4 py-20 sm:px-8 md:h-90 md:py-0 lg:px-30">
      <svg
        viewBox="0 0 620 360"
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 hidden h-90 w-155 md:block"
      >
        {stripes.map(([x, y, width, height, opacity]) => (
          <rect key={x} x={x} y={y} width={width} height={height} fill="#fff" opacity={opacity} />
        ))}
      </svg>

      <h2 className="relative font-heading text-4xl font-medium tracking-[-0.03em] text-primary-foreground md:text-[44px] md:leading-12">
        Share your next snippet.
      </h2>
      <p className="relative max-w-110 text-base leading-6.5 text-[#d9d8ff]">
        Free for up to 100 MB of pastes. No card, no setup, one link.
      </p>
      <div className="relative flex items-center gap-2.5 pt-2.5">
        <Button
          className="h-11 gap-2 bg-white px-4.5 text-[15px] text-primary hover:bg-white/90"
          render={<a href={links.signUp} />}
          nativeButton={false}
        >
          <span className="size-2.25 bg-primary" />
          Create a free account
        </Button>
        <Button
          className="h-11 bg-[#4744f0] px-4.5 text-[15px] hover:bg-[#5552f2]"
          render={<a href={links.signIn} />}
          nativeButton={false}
        >
          Sign in
        </Button>
      </div>
    </section>
  )
}
