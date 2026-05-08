"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { SelectSchoolPrompt } from "./select-school-prompt"
import { authClient } from "@/lib/auth-client"

export function SchoolSelected({ children }: { children: React.ReactNode }) {
  const activeOrgData = authClient.useActiveOrganization()
  if (activeOrgData.isPending) {
    return <Skeleton className="size-full" />
  }
  if (activeOrgData.data) {
    return children
  } else {
    return <SelectSchoolPrompt />
  }
}
