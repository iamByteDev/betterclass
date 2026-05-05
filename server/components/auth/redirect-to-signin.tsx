"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function RedirectToSignIn({ redirectTo = "/login" }: { redirectTo?: string }) {
  const router = useRouter();

  useEffect(() => {
    router.replace(redirectTo);
  }, [router, redirectTo]);

  return null;
}
