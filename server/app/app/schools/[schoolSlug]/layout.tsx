"use client"

import { use } from "react"
import { redirect } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { useSchool } from "@/hooks/use-school"
import { SchoolProvider } from "@/components/schools/school-context"
import { SchoolTabs } from "@/components/schools/school-tabs"
import { SidebarWrapper } from "@/components/dashboard/sidebar-wrapper"
import { DashboardHeader } from "@/components/dashboard/header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { getInitials } from "@/lib/utils"

function LayoutSkeleton() {
  return (
    <SidebarWrapper>
      <DashboardHeader
        breadcrumbs={[
          { label: "Schools", href: "/app/schools" },
          { label: "…" },
        ]}
      />
      <div className="flex flex-1 flex-col p-4 pt-0">
        <div className="flex items-center gap-3 pb-4">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <div className="flex gap-4 border-b border-border pt-0 pb-0">
          <Skeleton className="mb-2.5 h-3 w-14" />
          <Skeleton className="mb-2.5 h-3 w-16" />
          <Skeleton className="mb-2.5 h-3 w-20" />
        </div>
      </div>
    </SidebarWrapper>
  )
}

export default function SchoolLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ schoolSlug: string }>
}) {
  const { schoolSlug } = use(params)
  const session = authClient.useSession()
  const { data: org, isPending, error } = useSchool(schoolSlug)

  if (isPending || session.isPending) {
    return <LayoutSkeleton />
  }

  if (error || !org) {
    return redirect("/app/schools")
  }

  const currentMember =
    org.members.find(
      (m: { user: { email: string } }) =>
        m.user.email === session.data?.user.email
    ) ?? null

  return (
    <SchoolProvider organization={org} currentMember={currentMember}>
      <SidebarWrapper>
        <DashboardHeader
          breadcrumbs={[
            { label: "Schools", href: "/app/schools" },
            { label: org.name },
          ]}
        />
        <div className="flex flex-1 flex-col p-4 pt-0">
          <div className="flex items-center gap-3 pb-4">
            <Avatar size="lg">
              {org.logo && <AvatarImage src={org.logo} alt={org.name} />}
              <AvatarFallback>{getInitials(org.name)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-0.5">
              <h1 className="text-sm font-semibold">{org.name}</h1>
              <p className="text-xs text-muted-foreground">{org.slug}</p>
            </div>
          </div>
          <SchoolTabs baseHref={`/app/schools/${schoolSlug}`} />
          <div className="pt-6">{children}</div>
        </div>
      </SidebarWrapper>
    </SchoolProvider>
  )
}
