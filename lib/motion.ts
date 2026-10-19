// Pixel motion for the landing page, ported from the motion studies in the Paper project
// (landing-v4/motion/sniptide-motion.html for day, night.html for night). Everything is drawn at
// low resolution into an ImageData, ordered-dithered into a few brand colours, then scaled up.

type Rgb = readonly [number, number, number]

const TAU = Math.PI * 2

function bayer(n: number): number[] {
  // Standard Bayer matrix, built recursively from the 2x2 case, normalised to (0, 1).
  function build(size: number): number[][] {
    if (size === 1) return [[0]]
    const half = size / 2
    const small = build(half)
    const out: number[][] = []
    for (let r = 0; r < size; r++) {
      const row: number[] = []
      for (let c = 0; c < size; c++) {
        const q = (small[r % half]?.[c % half] ?? 0) * 4
        const add = r < half ? (c < half ? 0 : 2) : c < half ? 3 : 1
        row.push(q + add)
      }
      out.push(row)
    }
    return out
  }
  return build(n)
    .flat()
    .map((v) => (v + 0.5) / (n * n))
}

const B4 = bayer(4)
const B8 = bayer(8)

function hash(a: number, b: number, c: number) {
  let h = Math.imul(a | 0, 374761393) ^ Math.imul(b | 0, 668265263) ^ Math.imul(c | 0, 2246822519)
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296
}

export type HorizonMode = "day" | "night"

// White, pale lavender, lavender, brand blue, ink. Night swaps the pale step for pink.
const ramps: Record<HorizonMode, Rgb[]> = {
  day: [
    [255, 255, 255],
    [201, 199, 255],
    [143, 140, 255],
    [42, 38, 236],
    [10, 10, 10],
  ],
  night: [
    [255, 255, 255],
    [251, 211, 234],
    [143, 140, 255],
    [42, 38, 236],
    [10, 10, 10],
  ],
}

// Study 11, pixel horizon: sky, a striped setting sun and sea bands drifting at different speeds.
// Fills `image` (W×H cells) for time `t` in seconds.
export function drawHorizon(image: ImageData, t: number, mode: HorizonMode, mobile: boolean) {
  const { data, width: W, height: H } = image
  const night = mode === "night"
  const ramp = ramps[mode]
  const H0 = Math.round(H * (mobile ? 0.74 : 0.6))
  const sunX = W * (mobile ? 0.66 : 0.7)
  const R = H * (mobile ? 0.13 : 0.22)
  const sunY = H0 - R * 0.35

  for (let y = 0; y < H; y++) {
    const vy = y / H
    const rowPh = hash(y, 0, 111) * TAU
    let base: number
    let dd = 0
    let spd = 0
    let per = 1
    if (y < H0) {
      base = night ? 0.85 + 3.4 * (1 - y / H0) ** 0.75 : 1.75 * (1 - y / H0) ** 1.2
    } else {
      dd = (y - H0) / (H - H0)
      const band = dd < 0.12 ? 0 : dd < 0.3 ? 1 : dd < 0.58 ? 2 : 3
      base = (night ? [2.2, 2.7, 3.1, 3.45] : [1.9, 2.4, 2.9, 3.35])[band] ?? 0
      base += dd * 0.4
      spd = [1.5, 4, 9, 16][band] ?? 0
      per = [18, 30, 52, 90][band] ?? 1
    }

    for (let x = 0; x < W; x++) {
      let v = base
      if (y < H0) {
        const cloud =
          Math.max(0, Math.sin(TAU * (x / (W * 0.45) - t * 0.006))) *
            Math.exp(-(((vy - 0.2) / 0.03) ** 2)) +
          Math.max(0, Math.sin(TAU * (x / (W * 0.3) + t * 0.004) + 2)) *
            Math.exp(-(((vy - 0.34) / 0.02) ** 2))
        v -= cloud * 1.1
        const ds = Math.hypot(x - sunX, y - sunY)
        if (ds < R) {
          v = night
            ? 0.15 + ((y - (sunY - R)) / (2 * R)) * 1.25
            : 2.15 + ((y - (sunY - R)) / (2 * R)) * 1.1
          const low = y - (sunY - R * 0.15)
          if (low > 0 && (low + t * 1.2) % 7 < 1 + (low / R) * 3.2) v = base
        } else if (ds < R * 1.18) {
          v = night
            ? Math.min(v, 1.1 + ((ds - R) / (R * 0.18)) * 1.2)
            : Math.max(v, 1.2 - ((ds - R) / (R * 0.18)) * 0.6)
        }
      } else if (y === H0) {
        v = 3.2
      } else {
        const wave = Math.sin((TAU * (x + t * spd)) / per + rowPh + y * 0.35)
        if (wave > 0.8) v -= 1.0
        else if (wave < -0.9) v += 0.5
        const rx = Math.abs(x - sunX)
        const rw = R * (0.55 + 0.9 * dd)
        if (rx < rw) {
          const glint = Math.sin((TAU * (x + t * spd * 0.8)) / (6 + 14 * dd) + y * 1.7)
          if (glint > 0.1 - (1 - rx / rw) * 0.9) v -= 1.7 * (1 - (rx / rw) * 0.6)
        }
      }
      const i0 = Math.floor(v)
      let idx = v - i0 > (B8[(x & 7) + ((y & 7) << 3)] ?? 0) ? i0 + 1 : i0
      idx = idx < 0 ? 0 : idx > 4 ? 4 : idx
      const col = ramp[idx] ?? ramp[0]
      const o = (y * W + x) * 4
      data[o] = col?.[0] ?? 0
      data[o + 1] = col?.[1] ?? 0
      data[o + 2] = col?.[2] ?? 0
      data[o + 3] = 255
    }
  }
}

function noise(x: number, y: number, z: number) {
  // Smooth value noise on an integer lattice, enough for a slow paper grain.
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const zi = Math.floor(z)
  const fx = x - xi
  const fy = y - yi
  const fz = z - zi
  const sx = fx * fx * (3 - 2 * fx)
  const sy = fy * fy * (3 - 2 * fy)
  const sz = fz * fz * (3 - 2 * fz)
  const lerp = (a: number, b: number, k: number) => a + (b - a) * k
  const corner = (dx: number, dy: number, dz: number) => hash(xi + dx, yi + dy, zi + dz)
  return lerp(
    lerp(
      lerp(corner(0, 0, 0), corner(1, 0, 0), sx),
      lerp(corner(0, 1, 0), corner(1, 1, 0), sx),
      sy,
    ),
    lerp(
      lerp(corner(0, 0, 1), corner(1, 0, 1), sx),
      lerp(corner(0, 1, 1), corner(1, 1, 1), sx),
      sy,
    ),
    sz,
  )
}

const grainInk: Rgb = [246, 169, 211]

// The pink section's paper grain: slow noise, ordered-dithered into pink dots on a clear ground.
export function drawGrain(image: ImageData, t: number) {
  const { data, width: W, height: H } = image
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const n = noise(x / 46, y / 46, t * 0.05) * 0.65 + noise(x / 15 + 40, y / 15, t * 0.09) * 0.35
      const v = 0.2 + n * 0.75
      const on = v > (B4[(x & 3) + ((y & 3) << 2)] ?? 0)
      const o = (y * W + x) * 4
      data[o] = grainInk[0]
      data[o + 1] = grainInk[1]
      data[o + 2] = grainInk[2]
      data[o + 3] = on ? 255 : 0
    }
  }
}
