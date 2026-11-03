import { cn } from "@sniptide/ui/lib/utils"
import Image, { type StaticImageData } from "next/image"

// A crop of the real app. With both shots the frame follows the color scheme; with one it shows
// that shot in both, for sections whose own background stays the same. A wide screen passes
// `crop` so phones show its left part at a readable size instead of shrinking all of it.
export function Screenshot({
  light,
  dark,
  alt,
  className,
  crop,
}: {
  light: StaticImageData
  dark?: StaticImageData
  alt: string
  className?: string
  crop?: boolean
}) {
  const size = crop ? "max-md:w-160 max-md:max-w-none" : ""
  return (
    <div
      className={cn(
        "min-w-0 overflow-hidden rounded-lg border border-[#e8e8e8] bg-white dark:border-[#262626] dark:bg-[#121111]",
        className,
      )}
    >
      <Image
        src={light}
        alt={alt}
        unoptimized
        className={cn("block h-auto w-full", size, dark && "dark:hidden")}
      />
      {dark && (
        <Image
          src={dark}
          alt={alt}
          unoptimized
          className={cn("hidden h-auto w-full dark:block", size)}
        />
      )}
    </div>
  )
}
