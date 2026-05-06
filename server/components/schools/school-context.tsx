"use client"

import { createContext, useContext } from "react"
import { type FullOrganization, type OrgMember } from "@/hooks/use-school"
import { authClient } from "@/lib/auth-client"

type PermissionArg = Parameters<
  typeof authClient.organization.checkRolePermission
>[0]["permissions"]

interface SchoolContextValue {
  organization: FullOrganization
  members: FullOrganization["members"]
  currentMember: OrgMember | null
  can: (permissions: PermissionArg) => boolean
}

const SchoolContext = createContext<SchoolContextValue | null>(null)

export function SchoolProvider({
  organization,
  currentMember,
  children,
}: {
  organization: FullOrganization
  currentMember: OrgMember | null
  children: React.ReactNode
}) {
  function can(permissions: PermissionArg) {
    if (!currentMember) return false
    return authClient.organization.checkRolePermission({
      permissions,
      role: currentMember.role,
    })
  }

  return (
    <SchoolContext.Provider
      value={{
        organization,
        members: organization.members,
        currentMember,
        can,
      }}
    >
      {children}
    </SchoolContext.Provider>
  )
}

export function useSchoolContext() {
  const ctx = useContext(SchoolContext)
  if (!ctx)
    throw new Error("useSchoolContext must be used inside SchoolProvider")
  return ctx
}
