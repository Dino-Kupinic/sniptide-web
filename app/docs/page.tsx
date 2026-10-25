import type { Metadata } from "next"
import { AgentDocPage } from "@/components/agent-doc-page"
import { docsDocument } from "@/lib/agent-docs"

export const metadata: Metadata = {
  title: docsDocument.title,
  description: docsDocument.description,
  alternates: { canonical: docsDocument.path },
}

export default function Docs() {
  return <AgentDocPage document={docsDocument} />
}
