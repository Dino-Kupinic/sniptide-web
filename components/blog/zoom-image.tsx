"use client"

import { Dialog } from "@base-ui/react/dialog"
import { cn } from "@sniptide/ui/lib/utils"
import { MinusIcon, PlusIcon, RotateCcwIcon, XIcon } from "lucide-react"
import { type KeyboardEvent, type PointerEvent, useRef, useState, type WheelEvent } from "react"

export type ZoomImageProps = {
  src: string
  // The same picture for dark mode, when the post has one.
  darkSrc?: string
  alt: string
  width?: number
  height?: number
  className?: string
}

const minScale = 1
const maxScale = 4

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

// A picture in a post that opens full screen when clicked. In the viewer, a click or a tap zooms to
// 2x at that point and back, the wheel and a pinch zoom between 1x and 4x, dragging pans, and the
// toolbar and the + - 0 keys do the same. Escape or the close button returns to the post.
export function ZoomImage({ src, darkSrc, alt, width, height, className }: ZoomImageProps) {
  const [open, setOpen] = useState(false)
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  // Pans and pinches follow the finger directly; only clicks and buttons animate.
  const [dragging, setDragging] = useState(false)
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const gesture = useRef({ moved: false, pinch: 0, startScale: 1 })

  function reset() {
    setScale(1)
    setOffset({ x: 0, y: 0 })
  }

  function zoomTo(next: number) {
    const value = clamp(next, minScale, maxScale)
    setScale(value)
    if (value === 1) setOffset({ x: 0, y: 0 })
  }

  // Zooms so that the point under the cursor stays where it is.
  function zoomAt(next: number, clientX: number, clientY: number, target: HTMLElement) {
    const value = clamp(next, minScale, maxScale)
    const rect = target.getBoundingClientRect()
    const cx = clientX - (rect.left + rect.width / 2)
    const cy = clientY - (rect.top + rect.height / 2)
    const ratio = value / scale
    setOffset((current) =>
      value === 1
        ? { x: 0, y: 0 }
        : { x: cx - (cx - current.x) * ratio, y: cy - (cy - current.y) * ratio },
    )
    setScale(value)
  }

  function onWheel(event: WheelEvent<HTMLDivElement>) {
    zoomAt(
      scale * (event.deltaY < 0 ? 1.15 : 1 / 1.15),
      event.clientX,
      event.clientY,
      event.currentTarget,
    )
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId)
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    gesture.current.moved = false
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()]
      if (a && b) gesture.current.pinch = Math.hypot(a.x - b.x, a.y - b.y)
      gesture.current.startScale = scale
    }
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const previous = pointers.current.get(event.pointerId)
    if (!previous) return
    const point = { x: event.clientX, y: event.clientY }
    pointers.current.set(event.pointerId, point)
    if (Math.hypot(point.x - previous.x, point.y - previous.y) > 2) {
      gesture.current.moved = true
      setDragging(true)
    }

    if (pointers.current.size === 2 && gesture.current.pinch > 0) {
      const [a, b] = [...pointers.current.values()]
      if (a && b)
        zoomTo(
          (gesture.current.startScale * Math.hypot(a.x - b.x, a.y - b.y)) / gesture.current.pinch,
        )
    } else if (scale > 1) {
      setOffset((current) => ({
        x: current.x + point.x - previous.x,
        y: current.y + point.y - previous.y,
      }))
    }
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    const wasClick = !gesture.current.moved && pointers.current.size === 1
    pointers.current.delete(event.pointerId)
    if (pointers.current.size === 0) setDragging(false)
    if (pointers.current.size < 2) gesture.current.pinch = 0
    if (wasClick) zoomAt(scale > 1 ? 1 : 2, event.clientX, event.clientY, event.currentTarget)
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "+" || event.key === "=") zoomTo(scale * 1.5)
    else if (event.key === "-") zoomTo(scale / 1.5)
    else if (event.key === "0") reset()
  }

  const picture = (sizes: string) => (
    <>
      {/* biome-ignore lint/performance/noImgElement: post pictures are static files served as they are, and the viewer sizes them by CSS. */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        draggable={false}
        className={cn(sizes, darkSrc && "dark:hidden")}
      />
      {darkSrc && (
        // biome-ignore lint/performance/noImgElement: as above.
        <img
          src={darkSrc}
          alt={alt}
          width={width}
          height={height}
          draggable={false}
          className={cn(sizes, "hidden dark:block")}
        />
      )}
    </>
  )

  const tool =
    "inline-flex size-8 items-center justify-center rounded-md text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-white disabled:pointer-events-none disabled:opacity-40"

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) reset()
      }}
    >
      <Dialog.Trigger
        aria-label={`Open the picture full screen: ${alt}`}
        className={cn(
          "block w-full cursor-zoom-in focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-link",
          className,
        )}
      >
        {picture("block h-auto w-full")}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/90 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none" />
        <Dialog.Popup
          onKeyDown={onKeyDown}
          className="fixed inset-0 z-50 flex flex-col outline-none transition-[opacity,scale] duration-150 data-ending-style:scale-98 data-ending-style:opacity-0 data-starting-style:scale-98 data-starting-style:opacity-0 motion-reduce:transition-none"
        >
          <Dialog.Title className="sr-only">{alt}</Dialog.Title>
          <div className="flex h-14 shrink-0 items-center justify-end gap-1 px-3 pt-[env(safe-area-inset-top)] md:px-4">
            <button
              type="button"
              onClick={() => zoomTo(scale / 1.5)}
              disabled={scale <= minScale}
              aria-label="Zoom out"
              className={tool}
            >
              <MinusIcon className="size-4" />
            </button>
            <span
              className="w-12 text-center font-mono text-xs text-white/80 tabular-nums"
              aria-live="polite"
            >
              {Math.round(scale * 100)}%
            </span>
            <button
              type="button"
              onClick={() => zoomTo(scale * 1.5)}
              disabled={scale >= maxScale}
              aria-label="Zoom in"
              className={tool}
            >
              <PlusIcon className="size-4" />
            </button>
            <button
              type="button"
              onClick={reset}
              disabled={scale === 1}
              aria-label="Reset zoom"
              className={tool}
            >
              <RotateCcwIcon className="size-4" />
            </button>
            <Dialog.Close aria-label="Close" className={cn(tool, "ml-2")}>
              <XIcon className="size-4" />
            </Dialog.Close>
          </div>
          <div
            onWheel={onWheel}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className={cn(
              "flex min-h-0 flex-1 touch-none items-center justify-center overflow-hidden px-4 pb-[max(1rem,env(safe-area-inset-bottom))] select-none md:px-10 md:pb-10",
              scale > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in",
            )}
          >
            <div
              style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})` }}
              className={cn(
                "max-w-full",
                !dragging &&
                  "transition-transform duration-150 ease-out motion-reduce:transition-none",
              )}
            >
              {picture("block h-auto max-h-[calc(100dvh-6rem)] w-auto max-w-full rounded-md")}
            </div>
          </div>
          <Dialog.Description className="sr-only">
            Click or tap to zoom, drag to move, and press Escape to close.
          </Dialog.Description>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
