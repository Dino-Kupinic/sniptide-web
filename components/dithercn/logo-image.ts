"use client"
import type { RefObject } from "react"
import { useEffect, useState } from "react"
import { readDitherCell } from "@/lib/dither/color"
import { useInView } from "@/lib/dither/motion"
export interface DitherGrid {
  readonly columns: number
  readonly rows: number
  readonly scale: number
  readonly width: number
  readonly height: number
}
type ImageFit = "cover" | "contain"
const imageCache = new Map<string, Promise<HTMLImageElement>>()

/**
 * Load and decode an image once per URL. Cross-origin images need CORS
 * headers, as the pixels are read back from a canvas.
 */
const decode = async (src: string) => {
  const image = new Image()
  image.crossOrigin = "anonymous"
  image.decoding = "async"
  image.src = src
  try {
    await image.decode()
    return image
  } catch (error) {
    // Let a later call try again.
    imageCache.delete(src)
    throw error
  }
}

export const loadImage = (src: string): Promise<HTMLImageElement> => {
  const cached = imageCache.get(src)
  if (cached) {
    return cached
  }
  const promise = decode(src)
  imageCache.set(src, promise)
  return promise
}

export type ImageStatus = "idle" | "loading" | "ready" | "error"

/**
 * Load an image when `enabled` turns true (usually when its box nears the
 * viewport). `status` is `"idle"` until then.
 */
export const useLoadedImage = (src: string, enabled: boolean) => {
  const [result, setResult] = useState<{
    src: string
    image: HTMLImageElement | null
  } | null>(null)

  useEffect(() => {
    if (!enabled) {
      return
    }
    let cancelled = false
    const load = async () => {
      let image: HTMLImageElement | null = null
      try {
        image = await loadImage(src)
      } catch {
        image = null
      }
      if (!cancelled) {
        setResult({ image, src })
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [src, enabled])

  if (!enabled || result?.src !== src) {
    return { image: null, status: enabled ? "loading" : "idle" } as const
  }
  return result.image
    ? ({ image: result.image, status: "ready" } as const)
    : ({ image: null, status: "error" } as const)
}

/** `true` once the element has come within `rootMargin` of the viewport. */
export const useSeen = (ref: RefObject<Element | null>, rootMargin = "320px") => {
  const inView = useInView(ref, { rootMargin })
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    if (inView) {
      setSeen(true)
    }
  }, [inView])
  return seen || inView
}

const gridFor = (width: number, height: number, cell: number): DitherGrid => {
  const ratio = window.devicePixelRatio || 1
  const scale = Math.max(1, Math.round(cell * ratio))
  const columns = Math.max(1, Math.ceil((width * ratio) / scale))
  const rows = Math.max(1, Math.ceil((height * ratio) / scale))
  return {
    columns,
    height: (rows * scale) / ratio,
    rows,
    scale,
    width: (columns * scale) / ratio,
  }
}

const sameGrid = (a: DitherGrid | null, b: DitherGrid) =>
  a !== null && a.columns === b.columns && a.rows === b.rows && a.scale === b.scale

/**
 * The same box on a grid `factor` times coarser, for the blocky first
 * frames of a resolve. Cells stay whole device pixels.
 */
export const coarsen = (grid: DitherGrid, factor: number): DitherGrid => {
  const step = Math.max(1, Math.round(factor))
  if (step === 1) {
    return grid
  }
  const ratio = (grid.columns * grid.scale) / grid.width
  const scale = grid.scale * step
  const columns = Math.max(1, Math.ceil(grid.columns / step))
  const rows = Math.max(1, Math.ceil(grid.rows / step))
  return {
    columns,
    height: (rows * scale) / ratio,
    rows,
    scale,
    width: (columns * scale) / ratio,
  }
}

/**
 * The cell grid for the element's current size, updated on resize and
 * zoom. `cell` is in CSS pixels; omit it to read `--dither-cell`.
 */
export const useDitherGrid = (
  ref: RefObject<HTMLElement | null>,
  cell?: number,
  minColumns = 0,
): DitherGrid | null => {
  const [grid, setGrid] = useState<DitherGrid | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) {
      return
    }
    const measure = () => {
      const { width, height } = el.getBoundingClientRect()
      if (width < 1 || height < 1) {
        return
      }
      const base = cell ?? readDitherCell(el)
      const size = minColumns > 0 ? Math.min(base, Math.max(1, width / minColumns)) : base
      const next = gridFor(width, height, size)
      setGrid((current) => (sameGrid(current, next) ? current : next))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, cell, minColumns])

  return grid
}

const makeCanvas = (width: number, height: number) => {
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  return canvas
}

/** Where the image lands in a `columns` x `rows` box, as object-fit does. */
const fitRect = (image: HTMLImageElement, columns: number, rows: number, fit: ImageFit) => {
  const scaleX = columns / image.naturalWidth
  const scaleY = rows / image.naturalHeight
  const scale = fit === "cover" ? Math.max(scaleX, scaleY) : Math.min(scaleX, scaleY)
  const width = image.naturalWidth * scale
  const height = image.naturalHeight * scale
  return {
    height,
    width,
    x: (columns - width) / 2,
    y: (rows - height) / 2,
  }
}

/**
 * Draw `image` into a `columns` x `rows` buffer, one pixel per cell.
 * Large downscales halve in steps first, which keeps fine detail from
 * aliasing into noise.
 */
export const rasterize = (
  image: HTMLImageElement,
  columns: number,
  rows: number,
  fit: ImageFit,
): ImageData | null => {
  const rect = fitRect(image, columns, rows, fit)
  let source: CanvasImageSource = image
  let sourceWidth = image.naturalWidth
  let sourceHeight = image.naturalHeight
  while (sourceWidth / 2 > rect.width && sourceHeight / 2 > rect.height) {
    const half = makeCanvas(Math.ceil(sourceWidth / 2), Math.ceil(sourceHeight / 2))
    const context = half.getContext("2d")
    if (!context) {
      break
    }
    context.imageSmoothingQuality = "high"
    context.drawImage(source, 0, 0, half.width, half.height)
    source = half
    sourceWidth = half.width
    sourceHeight = half.height
  }

  const canvas = makeCanvas(columns, rows)
  const context = canvas.getContext("2d", { willReadFrequently: true })
  if (!context) {
    return null
  }
  context.imageSmoothingQuality = "high"
  context.drawImage(source, rect.x, rect.y, rect.width, rect.height)
  return context.getImageData(0, 0, columns, rows)
}

export const sizeCanvas = (canvas: HTMLCanvasElement, grid: DitherGrid) => {
  if (canvas.width !== grid.columns || canvas.height !== grid.rows) {
    canvas.width = grid.columns
    canvas.height = grid.rows
  }
  canvas.style.width = `${grid.width}px`
  canvas.style.height = `${grid.height}px`
}

export const CANVAS_CLASS =
  "pointer-events-none absolute top-0 left-0 max-w-none [image-rendering:pixelated]"

/** Fades a canvas in once its first frame is drawn. */
export const FADE_CLASS =
  "transition-opacity duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
