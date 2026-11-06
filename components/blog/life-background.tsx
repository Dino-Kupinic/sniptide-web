"use client"

import { useEffect, useRef } from "react"

const cell = 8
const gap = 1
const tickMs = 360
// A board that settles into still lifes and blinkers looks frozen, so it reseeds on a timer.
const reseedEvery = 240

// Conway's Game of Life on a wrapping grid of small squares in the brand blue, drawn behind the
// top of the blog index. It runs only while on screen and the tab is visible, and shows a still frame when
// the reader prefers reduced motion. A canvas with no content is skipped by assistive technology.
export function LifeBackground({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if (!canvas || !context) return

    let columns = 0
    let rows = 0
    let board = new Uint8Array(0)
    let next = new Uint8Array(0)
    let age = new Uint8Array(0)
    let generation = 0
    let color = "#2a26ec"
    let timer: number | undefined
    let onScreen = false

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")

    function seed() {
      for (let i = 0; i < board.length; i++) {
        board[i] = Math.random() < 0.18 ? 1 : 0
        age[i] = 0
      }
      generation = 0
    }

    function resize() {
      if (!canvas || !context) return
      const { width, height } = canvas.getBoundingClientRect()
      const ratio = window.devicePixelRatio || 1
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      const nextColumns = Math.ceil(width / cell)
      const nextRows = Math.ceil(height / cell)
      if (nextColumns !== columns || nextRows !== rows) {
        columns = nextColumns
        rows = nextRows
        board = new Uint8Array(columns * rows)
        next = new Uint8Array(columns * rows)
        age = new Uint8Array(columns * rows)
        seed()
      }
      draw()
    }

    function readColor() {
      if (!canvas) return
      color = getComputedStyle(canvas).getPropertyValue("--life").trim() || color
    }

    function step() {
      for (let y = 0; y < rows; y++) {
        const up = ((y - 1 + rows) % rows) * columns
        const row = y * columns
        const down = ((y + 1) % rows) * columns
        for (let x = 0; x < columns; x++) {
          const left = (x - 1 + columns) % columns
          const right = (x + 1) % columns
          const neighbours =
            (board[up + left] ?? 0) +
            (board[up + x] ?? 0) +
            (board[up + right] ?? 0) +
            (board[row + left] ?? 0) +
            (board[row + right] ?? 0) +
            (board[down + left] ?? 0) +
            (board[down + x] ?? 0) +
            (board[down + right] ?? 0)
          const alive = board[row + x] === 1
          const lives = neighbours === 3 || (alive && neighbours === 2)
          next[row + x] = lives ? 1 : 0
          age[row + x] = lives ? Math.min((age[row + x] ?? 0) + 1, 6) : 0
        }
      }
      ;[board, next] = [next, board]
      generation++
      if (generation >= reseedEvery) seed()
    }

    // Newborn cells start faint and darken over a few generations, so the board shimmers instead
    // of blinking.
    function draw() {
      if (!context || !canvas) return
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.fillStyle = color
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
          const index = y * columns + x
          if (board[index] === 0) continue
          context.globalAlpha = 0.35 + ((age[index] ?? 0) / 6) * 0.65
          context.fillRect(x * cell, y * cell, cell - gap, cell - gap)
        }
      }
      context.globalAlpha = 1
    }

    function stop() {
      if (timer !== undefined) window.clearInterval(timer)
      timer = undefined
    }

    function start() {
      stop()
      if (reduced.matches || !onScreen || document.hidden) return
      timer = window.setInterval(() => {
        step()
        draw()
      }, tickMs)
    }

    readColor()
    resize()
    // A few generations in, the random noise has turned into shapes.
    for (let i = 0; i < 12; i++) step()
    draw()

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)
    const visibility = new IntersectionObserver((entries) => {
      onScreen = entries.some((entry) => entry.isIntersecting)
      start()
    })
    visibility.observe(canvas)
    // The theme switches by a class on <html>, which changes --life.
    const theme = new MutationObserver(() => {
      readColor()
      draw()
    })
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    document.addEventListener("visibilitychange", start)
    reduced.addEventListener("change", start)

    return () => {
      stop()
      resizeObserver.disconnect()
      visibility.disconnect()
      theme.disconnect()
      document.removeEventListener("visibilitychange", start)
      reduced.removeEventListener("change", start)
    }
  }, [])

  return <canvas ref={canvasRef} className={className} />
}
