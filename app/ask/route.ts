import { markdownPath } from "@/lib/agent-docs"
import { searchDocuments } from "@/lib/public-doc-search"
import { siteUrl } from "@/lib/site"
import { z } from "zod"

const askSchema = z
  .object({
    query: z
      .object({
        text: z.string().trim().min(1).max(500),
        site: z.string().optional(),
        itemType: z.string().optional(),
      })
      .passthrough(),
    prefer: z
      .object({
        streaming: z.boolean().optional(),
        mode: z.string().optional(),
        response_format: z.string().optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough()
const event = (name: string, data: unknown) => `event: ${name}\ndata: ${JSON.stringify(data)}\n\n`
const streamResponse = (body: string, status = 200) =>
  new Response(body, {
    status,
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Vary: "Accept" },
  })
const failure = (code: string, message: string, status = 200, streaming = false) => {
  const body = { _meta: { response_type: "failure", version: "0.55" }, error: { code, message } }
  return streaming
    ? streamResponse(
        event("start", { _meta: { ...body._meta, streaming: true } }) +
          event("error", body) +
          event("complete", { _meta: body._meta }),
        status,
      )
    : Response.json(body, { status, headers: { Vary: "Accept" } })
}
export async function POST(request: Request) {
  let input: unknown
  try {
    const reader = request.body?.getReader()
    if (!reader) return failure("INVALID_QUERY", "Expected a JSON request.", 400)
    const decoder = new TextDecoder("utf-8", { fatal: true })
    let text = ""
    let bytes = 0
    try {
      while (true) {
        const part = await reader.read()
        if (part.done) break
        bytes += part.value.byteLength
        if (bytes > 16 * 1024) {
          await reader.cancel()
          return failure("INVALID_QUERY", "Use at most 16 KiB per request.", 413)
        }
        text += decoder.decode(part.value, { stream: true })
      }
      text += decoder.decode()
    } finally {
      reader.releaseLock()
    }
    input = JSON.parse(text)
  } catch {
    return failure("INVALID_QUERY", "Expected a JSON request.", 400)
  }
  const parsed = askSchema.safeParse(input)
  if (!parsed.success)
    return failure("INVALID_QUERY", "Provide query.text and valid query and prefer fields.", 400)
  const body = parsed.data
  const query = body.query.text
  const streaming =
    body.prefer?.streaming ??
    request.headers
      .get("accept")
      ?.split(",")
      .some((part) => {
        const [type, ...parameters] = part.trim().toLowerCase().split(";")
        const quality = parameters.find((parameter) => parameter.trim().startsWith("q="))
        return type === "text/event-stream" && (!quality || Number(quality.trim().slice(2)) > 0)
      }) ??
    false
  if (
    body.prefer?.response_format !== undefined &&
    body.prefer.response_format !== "conversational_search"
  )
    return failure("UNSUPPORTED_FORMAT", "Only conversational_search is supported.", 200, streaming)
  if (body.prefer?.mode !== undefined && body.prefer.mode !== "list")
    return failure("UNSUPPORTED_MODE", "Only list mode is supported.", 200, streaming)
  if (body.query?.site && body.query.site !== "sniptide.com")
    return failure("NO_RESULTS", "No matching public documents.", 200, streaming)
  if (body.query?.itemType && body.query.itemType !== "WebPage")
    return failure("NO_RESULTS", "No matching public documents.", 200, streaming)
  const results = searchDocuments(query).map((doc) => ({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: doc.title,
    description: doc.description,
    url: `${siteUrl}${markdownPath(doc.path)}`,
  }))
  if (!results.length) return failure("NO_RESULTS", "No matching public documents.", 200, streaming)
  const meta = {
    response_type: "answer",
    response_format: "conversational_search",
    version: "0.55",
  }
  if (streaming) {
    return streamResponse(
      event("start", { _meta: { ...meta, streaming: true } }) +
        results.map((item, index) => event("result", { index, item })).join("") +
        event("complete", { _meta: meta }),
    )
  }
  return Response.json({ _meta: meta, results }, { headers: { Vary: "Accept" } })
}
