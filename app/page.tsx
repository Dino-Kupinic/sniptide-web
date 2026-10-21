import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { links } from "@/lib/links"
import { hasAppSession } from "@/lib/session"
import Home from "./home/page"

// The home page lives at / (and, for signed-in visitors' links, at /home), so / is the one address
// search engines should know.
export const metadata: Metadata = { alternates: { canonical: "/" } }

export default async function Index() {
  if (await hasAppSession((await cookies()).getAll())) redirect(links.dashboard)

  return <Home />
}
