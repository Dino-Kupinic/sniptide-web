import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { links } from "@/lib/links"
import { hasAppSession } from "@/lib/session"
import Home from "./home/page"

export default async function Index() {
  if (await hasAppSession((await cookies()).getAll())) redirect(links.dashboard)

  return <Home />
}
