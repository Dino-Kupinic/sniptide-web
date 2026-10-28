import { AgentDocPage } from "@/components/agent-doc-page"
import { contactDocument as document } from "@/lib/agent-docs"

export const metadata = {
  title: document.title,
  description: document.description,
  alternates: { canonical: document.path },
}

export default function Page() {
  return <AgentDocPage document={document} />
}
