"use client"

import { authClient } from "@/lib/auth-client"
import { DashboardHeader } from "@/components/dashboard/header"
import { SidebarWrapper } from "@/components/dashboard/sidebar-wrapper"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { buttonVariants } from "@/components/ui/button"
import { SchoolIcon, PlusIcon } from "lucide-react"
import Link from "next/link"

function SchoolCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex flex-col gap-1.5 flex-1">
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

function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}


export default function SchoolsPage() {
  const { data: organizations, isPending } = authClient.useListOrganizations()

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
          <Link
            href="/app/schools/create"
            className={buttonVariants({ size: "sm" })}
          >
            <PlusIcon />
            Create school
          </Link>
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
              <Card
                key={org.id}
                className="cursor-pointer transition-shadow duration-150 hover:shadow-md"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Avatar size="lg">
                      {org.logo && (
                        <AvatarImage src={org.logo} alt={org.name} />
                      )}
                      <AvatarFallback>{getInitials(org.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <CardTitle className="truncate">{org.name}</CardTitle>
                      <CardDescription className="truncate">
                        /{org.slug}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Joined{" "}
                    {new Date(org.createdAt).toLocaleDateString("en-GB", {
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </SidebarWrapper>
  )
}
