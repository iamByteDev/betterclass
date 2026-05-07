"use client"

import * as React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { ChevronsUpDownIcon, PlusIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BaseUIEvent } from "@base-ui/react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { type Organization } from "better-auth/client"
import { getInitials } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"

const createSchoolHref = "/app/schools?create=true"

function OrgInitials({ org }: { org: Organization }) {
  return <span>{getInitials(org.name)}</span>
}

export function OrgSwitcher() {
  const router = useRouter()
  const { isMobile } = useSidebar()

  const queriedOrgs = useQuery(api.auth.listUserOrgs)
  const orgs =
    queriedOrgs?.map((orgData) => {
      const logo = <OrgInitials org={orgData} />
      return { id: orgData.id, name: orgData.name, logo, plan: "Free Plan" }
    }) ?? []

  const openCreateDialog = React.useCallback(
    (event: BaseUIEvent<React.MouseEvent<HTMLDivElement, MouseEvent>>) => {
      event.preventDefault()
      router.push(createSchoolHref)
    },
    [router]
  )

  const activeOrgData = authClient.useActiveOrganization()
  const activeOrg = orgs.find((org) => org.id === activeOrgData.data?.id)

  function setActiveOrg(orgId: string) {
    authClient.organization
      .setActive({ organizationId: orgId })
      .then((result) => {
        if (result.data) {
          toast.success("Successfully set active school!")
        } else {
          toast.error(result.error?.message ?? "Failed to set active school")
        }
      })
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
              />
            }
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              {activeOrg?.logo ?? <PlusIcon className="size-4" />}
            </div>
            <div className="grid flex-1 text-start text-sm leading-tight">
              <span className="truncate font-medium">
                {activeOrg?.name ?? "Choose a school"}
              </span>
              {activeOrg && (
                <span className="truncate text-xs">{activeOrg.plan}</span>
              )}
            </div>
            <ChevronsUpDownIcon className="ms-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Schools
              </DropdownMenuLabel>
              {orgs.map((org) => (
                <DropdownMenuItem
                  key={org.name}
                  onClick={() => setActiveOrg(org.id)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-md border">
                    {org.logo}
                  </div>
                  {org.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href={createSchoolHref}>
                <DropdownMenuItem
                  className="gap-2 p-2"
                  onClick={openCreateDialog}
                >
                  <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                    <PlusIcon className="size-4" />
                  </div>
                  <div className="font-medium text-muted-foreground">
                    Add school
                  </div>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
