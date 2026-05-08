"use client"

import { DashboardHeader } from "@/components/dashboard/header"
import { SidebarWrapper } from "@/components/dashboard/sidebar-wrapper"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { SchoolIcon } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { CreateSchoolDialog } from "@/components/schools/main/create-school-dialog"
import { OrganizationCard } from "@/components/schools/main/organization-card"
import { useCreateDialogOpen } from "@/app/app/schools/use-create-dialog-open"

function SchoolCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex flex-1 flex-col gap-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-3 w-24" />
      </CardContent>
    </Card>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <SchoolIcon className="size-5 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium">No schools yet</p>
        <p className="text-xs text-muted-foreground">
          You are not a member of any school organisations.
        </p>
      </div>
    </div>
  )
}

export default function SchoolsPage() {
  const organizations = useQuery(api.organization.listUserOrgs)
  const isPending = organizations === undefined

  const { isCreateDialogOpen, setIsCreateDialogOpen } = useCreateDialogOpen()
  return (
    <SidebarWrapper>
      <DashboardHeader breadcrumbs={[{ label: "Schools" }]} />
      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-base font-semibold">Schools</h1>
            <p className="text-xs text-muted-foreground">
              Organisations you are a member of.
            </p>
          </div>
          <CreateSchoolDialog
            open={isCreateDialogOpen}
            setOpen={setIsCreateDialogOpen}
          />
        </div>

        {isPending ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <SchoolCardSkeleton key={i} />
            ))}
          </div>
        ) : !organizations || organizations.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {organizations.map((org) => (
              <OrganizationCard key={org.id} org={org} />
            ))}
          </div>
        )}
      </div>
    </SidebarWrapper>
  )
}
