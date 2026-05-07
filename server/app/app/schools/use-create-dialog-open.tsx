"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export function useCreateDialogOpen() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const shouldOpenCreateDialog = searchParams.get("create") === "true"

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(
    () => shouldOpenCreateDialog
  )

  useEffect(() => {
    if (!shouldOpenCreateDialog) return

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsCreateDialogOpen(true)

    const params = new URLSearchParams(searchParams.toString())
    params.delete("create")

    const query = params.toString()
    const nextUrl = query ? `${pathname}?${query}` : pathname

    router.replace(nextUrl, { scroll: false })
  }, [shouldOpenCreateDialog, searchParams, pathname, router])

  return {
    isCreateDialogOpen,
    setIsCreateDialogOpen,
  }
}
