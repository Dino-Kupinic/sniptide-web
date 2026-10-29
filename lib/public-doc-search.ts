import { agentDocuments, renderMarkdown } from "@/lib/agent-docs"

export function searchDocuments(query: string) {
  const terms = query.toLowerCase().match(/[a-z0-9]+/g) ?? []
  if (!terms.length) return []
  return agentDocuments
    .map((doc) => {
      const text = [renderMarkdown(doc), ...(doc.searchTerms ?? [])].join("\n").toLowerCase()
      const score = terms.reduce((sum, term) => sum + (text.includes(term) ? 1 : 0), 0)
      return { doc, score }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ doc }) => doc)
}
