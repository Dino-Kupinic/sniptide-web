import type { Metadata } from "next"
import { AgentDocPage } from "@/components/agent-doc-page"
import { mcpDocument } from "@/lib/agent-docs"

export const metadata: Metadata = {
  title: mcpDocument.title,
  description: mcpDocument.description,
  alternates: { canonical: mcpDocument.path },
}

export default function McpDocs() {
  return <AgentDocPage document={mcpDocument} />
}
