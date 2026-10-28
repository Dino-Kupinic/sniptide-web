export function prefersMarkdown(accept: string | null) {
  const ranges = (accept ?? "").split(",").map((part) => {
    const [mediaType, ...parameters] = part.trim().toLowerCase().split(";")
    const quality = parameters.find((parameter) => parameter.trim().startsWith("q="))
    const q = quality ? Number(quality.trim().slice(2)) : 1
    return { mediaType, q: Number.isFinite(q) && q >= 0 && q <= 1 ? q : 0 }
  })
  const markdown = ranges.find((range) => range.mediaType === "text/markdown")?.q ?? 0
  const html = ranges.find((range) => range.mediaType === "text/html")?.q ?? 0
  return markdown > 0 && markdown >= html
}
