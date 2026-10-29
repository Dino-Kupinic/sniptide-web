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

// AI assistants and crawlers that read pages for a model. They get the Markdown twin of a page
// even when they ask for HTML, since the HTML adds only layout. Search engine crawlers such as
// Googlebot and Bingbot are not in this list and keep getting HTML.
const aiAgents =
  /\b(?:GPTBot|ChatGPT-User|OAI-SearchBot|ClaudeBot|Claude-User|Claude-SearchBot|anthropic-ai|PerplexityBot|Perplexity-User)\b/i

export function isAiAgent(userAgent: string | null) {
  return aiAgents.test(userAgent ?? "")
}
