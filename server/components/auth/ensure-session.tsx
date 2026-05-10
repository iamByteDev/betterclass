"use client"

import { RedirectToSignIn } from "@/components/auth/redirect-to-signin"
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react"
import { Loader2Icon } from "lucide-react"

export function EnsureSession({
  children,
  redirectTo,
}: {
  children: React.ReactNode
  redirectTo?: string
}) {
  return (
    <>
      <Authenticated>{children}</Authenticated>
      <Unauthenticated>
        <RedirectToSignIn redirectTo={redirectTo} />
      </Unauthenticated>
      <AuthLoading>
        <div className="flex min-h-screen items-center justify-center">
          <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
        </div>
      </AuthLoading>
    </>
  )
}
