"use client"

import { useEffect } from "react"
import { registerPublicTools } from "@/lib/webmcp"

export function WebMcp() {
  useEffect(() => registerPublicTools(document, navigator), [])
  return null
}
