"use client"

import { EnsureNoSession } from "@/components/auth/ensure-no-session"
import { LoginForm } from "@/components/login-form"
import { GraduationCapIcon } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  return (
    <EnsureNoSession>
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 self-center font-medium"
          >
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GraduationCapIcon className="size-4" />
            </div>
            BetterClass
          </Link>
          <LoginForm />
        </div>
      </div>
    </EnsureNoSession>
  )
}
