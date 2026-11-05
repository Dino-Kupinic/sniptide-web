/** Preserve source antialiasing while lowering contrast in the texture's gaps. */
export const ditherCoverage = (coverage: number, inked: boolean, strength: number) =>
  coverage * (inked ? 1 : 1 - Math.min(1, Math.max(0, strength)))
