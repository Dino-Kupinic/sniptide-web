import { cn } from "@sniptide/ui/lib/utils"

// The two-tone heading of the feature sections: the claim in ink, the reason in the accent colour.
export function SectionHeading({
  claim,
  reason,
  className,
  reasonClassName = "text-[#2a26ec] dark:text-[#8f8cff]",
}: {
  claim: string
  reason: string
  className?: string
  reasonClassName?: string
}) {
  return (
    <h2
      className={cn(
        "max-w-240 font-heading text-[30px] leading-8.75 font-medium tracking-[-0.03em] text-balance md:text-5xl md:leading-13.5",
        className,
      )}
    >
      {claim} <span className={cn("block", reasonClassName)}>{reason}</span>
    </h2>
  )
}
