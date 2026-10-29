import { handleA2a } from "@/lib/a2a"

const MAX_BODY_BYTES = 16 * 1024

export async function POST(request: Request) {
  const body = await request.arrayBuffer()
  if (body.byteLength > MAX_BODY_BYTES)
    return Response.json(
      { jsonrpc: "2.0", id: null, error: { code: -32600, message: "Use at most 16 KiB." } },
      { status: 413 },
    )
  try {
    return handleA2a(JSON.parse(new TextDecoder().decode(body)))
  } catch {
    return Response.json(
      { jsonrpc: "2.0", id: null, error: { code: -32700, message: "The body isn't valid JSON." } },
      { status: 400 },
    )
  }
}
