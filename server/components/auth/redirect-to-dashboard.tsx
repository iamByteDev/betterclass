"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function RedirectToDashboard({ redirect }: { redirect?: string }) {
  const router = useRouter()

  useEffect(() => {
    router.replace(redirect ?? "/app")
  }, [router, redirect])

  return null
}
