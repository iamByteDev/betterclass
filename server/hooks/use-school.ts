"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

export type FullOrganization = NonNullable<
  (typeof api.organization.getOrgData)["_returnType"]
>
export type OrgMember = FullOrganization["members"][number]

export function useSchool(organizationSlug: string) {
  const orgData = useQuery(api.organization.getOrgData, {
    organizationSlug,
  })
  const isPending = orgData === undefined
  return { data: orgData, isPending, error: null }
}
