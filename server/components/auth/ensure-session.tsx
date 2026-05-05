"use client";

import { RedirectToSignIn } from "@/components/auth/redirect-to-signin";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { Loader2Icon } from "lucide-react";
import { usePathname } from "next/navigation";

export function EnsureSession({ children, redirectTo }: { children: React.ReactNode; redirectTo?: string }) {
  const pathname = usePathname();

  let customRedirectTo = redirectTo;
  if (!customRedirectTo && pathname === "/app/leaderboards") {
    customRedirectTo = "/leaderboards";
  }

  return (
    <>
      <Authenticated>{children}</Authenticated>
      <Unauthenticated>
        <RedirectToSignIn redirectTo={customRedirectTo} />
      </Unauthenticated>
      <AuthLoading>
        <div className="flex min-h-screen items-center justify-center">
          <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
        </div>
      </AuthLoading>
    </>
  );
}
