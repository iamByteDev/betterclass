import { useEffect, useState } from "react"
import { authClient } from "@/lib/auth-client"

export type OrgSlugState = "idle" | "checking" | "available" | "unavailable"

export function useCheckOrgSlug(slug: string, debounceMs = 400): OrgSlugState {
  const trimmed = slug.trim()
  const [debounced, setDebounced] = useState(trimmed)

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(trimmed), debounceMs)
    return () => window.clearTimeout(id)
  }, [trimmed, debounceMs])

  const [finalState, setFinalState] = useState<OrgSlugState>("idle")

  useEffect(() => {
    if (!debounced) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFinalState("idle")
      return
    }

    let cancelled = false
    setFinalState("checking")

    void (async () => {
      const { data, error } = await authClient.organization.checkSlug({
        slug: debounced,
      })
      if (cancelled) return
      if (error) setFinalState("unavailable")
      else setFinalState(data?.status === true ? "available" : "unavailable")
    })()

    return () => {
      cancelled = true
    }
  }, [debounced])

  if (!trimmed) return "idle"
  if (trimmed !== debounced) return "checking"
  return finalState
}
