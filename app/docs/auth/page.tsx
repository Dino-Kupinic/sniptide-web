import type { Metadata } from "next"
import { AgentDocPage } from "@/components/agent-doc-page"
import { authDocument } from "@/lib/agent-docs"

export const metadata: Metadata = {
  title: authDocument.title,
  description: authDocument.description,
  alternates: { canonical: authDocument.path },
}

export default function AuthDocs() {
  return <AgentDocPage document={authDocument} />
}
