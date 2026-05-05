"use client"

import { RedirectToDashboard } from "@/components/auth/redirect-to-dashboard"
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react"
import { Loader2Icon } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

interface EnsureNoSessionProps {
  children: React.ReactNode
  allowAuthenticatedWithParam?: [string, string]
  skipAuthLoading?: boolean
  redirect?: string
}

function EnsureNoSessionInner({
  children,
  allowAuthenticatedWithParam,
  skipAuthLoading = false,
  redirect,
}: EnsureNoSessionProps) {
  const searchParams = useSearchParams()
  const hasParam =
    allowAuthenticatedWithParam &&
    searchParams.get(allowAuthenticatedWithParam[0]) ===
      allowAuthenticatedWithParam[1]

  if (skipAuthLoading) {
    return (
      <>
        {children}
        <Authenticated>
          {hasParam ? <></> : <RedirectToDashboard redirect={redirect} />}
        </Authenticated>
      </>
    )
  }

  return (
    <>
      <Authenticated>
        {hasParam ? children : <RedirectToDashboard redirect={redirect} />}
      </Authenticated>
      <Unauthenticated>{children}</Unauthenticated>
      <AuthLoading>
        <div className="flex min-h-screen items-center justify-center">
          <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
        </div>
      </AuthLoading>
    </>
  )
}

export function EnsureNoSession(props: EnsureNoSessionProps) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <EnsureNoSessionInner {...props} />
    </Suspense>
  )
}
