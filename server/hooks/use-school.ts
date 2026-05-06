"use client"

import { authClient } from "@/lib/auth-client"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

export type FullOrganization = NonNullable<
  (typeof api.auth.getOrgData)["_returnType"]
>
export type OrgMember = FullOrganization["members"][number]

export function useSchool(organizationSlug: string) {
  const orgData = useQuery(api.auth.getOrgData, {
    organizationSlug,
  })
  const isPending = orgData === undefined
  return { data: orgData, isPending, error: null }
}
