// The Game of Life around the logo on the Open Graph card. A seeded soup runs across the whole
// card, and every cell carries a glow: 1 while alive, fading by `decay` each generation after it
// dies, so the field shows live cells in Tide light with trails in Tide blue. The centre is cleared
// in an ellipse whose edge steps in runs of rows, so the field ends in uneven bars around the logo
// instead of a smooth curve. Everything is seeded, so the card is the same on every build.

export const lifeCell = 6
const columns = 200
const rows = 105
const generations = 40
const decay = 0.55
const density = 0.32
const soupSeed = 19
const edgeSeed = 7
// The cleared ellipse, in cells.
const clearX = 66
const clearY = 40

export const lifeColors = { live: "#8f8cff", trail: "#2a26ec" } as const

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function step(cells: Uint8Array) {
  const next = new Uint8Array(cells.length)
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      let neighbours = 0
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (!dx && !dy) continue
          const row = (y + dy + rows) % rows
          neighbours += cells[row * columns + ((x + dx + columns) % columns)] ?? 0
        }
      }
      const alive = cells[y * columns + x]
      next[y * columns + x] = neighbours === 3 || (alive && neighbours === 2) ? 1 : 0
    }
  }
  return next
}

function glow() {
  const rand = mulberry32(soupSeed)
  let cells = new Uint8Array(columns * rows).map(() => (rand() < density ? 1 : 0))
  let values = new Float32Array(cells.length)
  for (let i = 0; i < generations; i++) {
    cells = step(cells)
    const alive = cells
    values = values.map((previous, k) => (alive[k] ? 1 : previous * decay))
  }
  return values
}

// How far the cleared centre reaches from the middle column in each row, in cells. Runs of one to
// four rows share a width.
function clearing() {
  const rand = mulberry32(edgeSeed)
  const widths: number[] = []
  while (widths.length < rows) {
    const run = 1 + Math.floor(rand() * 4)
    const jitter = Math.floor(rand() * 9) - 4
    for (let r = 0; r < run && widths.length < rows; r++) {
      const dy = (widths.length + 0.5 - rows / 2) / clearY
      widths.push(Math.abs(dy) < 1 ? clearX * Math.sqrt(1 - dy * dy) + jitter : 0)
    }
  }
  return widths
}

export interface LifeCell {
  x: number
  y: number
  // Opacity of the trail colour and of the live colour drawn over it, 0 to 1.
  trail: number
  live: number
}

export function lifeCells(): LifeCell[] {
  const values = glow()
  const widths = clearing()
  const out: LifeCell[] = []
  for (let k = 0; k < values.length; k++) {
    const column = k % columns
    const row = Math.floor(k / columns)
    const fromCentre = Math.abs(column + 0.5 - columns / 2)
    const width = widths[row] as number
    if (fromCentre < width) continue
    const value = values[k] as number
    if (value < 0.03) continue
    out.push({
      x: column * lifeCell,
      y: row * lifeCell,
      trail: Math.min(value, 0.7) * 0.85,
      live: Math.max(0, (value - 0.6) / 0.4) * 0.7,
    })
  }
  return out
}

// One path per colour and opacity step keeps the SVG small. Trails come first, so live cells sit on
// top.
export function lifePaths() {
  const layers = new Map<string, { color: string; opacity: number; d: string }>()
  const add = (color: string, alpha: number, d: string) => {
    const opacity = Math.round(alpha * 20) / 20
    if (opacity <= 0) return
    const key = `${color} ${opacity}`
    const layer = layers.get(key) ?? { color, opacity, d: "" }
    layer.d += d
    layers.set(key, layer)
  }
  const size = lifeCell - 1
  for (const cell of lifeCells()) {
    const d = `M${cell.x} ${cell.y}h${size}v${size}h-${size}z`
    add(lifeColors.trail, cell.trail, d)
    add(lifeColors.live, cell.live, d)
  }
  return [...layers.values()].sort(
    (a, b) => Number(b.color === lifeColors.trail) - Number(a.color === lifeColors.trail),
  )
}
