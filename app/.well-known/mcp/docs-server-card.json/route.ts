import { docsServerCard } from "@/lib/agent-docs"

export function GET() {
  return Response.json(docsServerCard)
}
