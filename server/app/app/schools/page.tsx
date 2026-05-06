"use client"

import { useState } from "react"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { useCheckOrgSlug } from "@/hooks/use-check-org-slug"
import { DashboardHeader } from "@/components/dashboard/header"
import { SidebarWrapper } from "@/components/dashboard/sidebar-wrapper"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
} from "@/components/ui/field"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  SchoolIcon,
  PlusIcon,
  Loader2Icon,
  CircleCheckIcon,
  CircleXIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

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

function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function CreateSchoolDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [slugTouched, setSlugTouched] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      setName("")
      setSlug("")
      setSlugTouched(false)
      setError(null)
      setIsSubmitting(false)
    }
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setName(value)
    if (!slugTouched) setSlug(toSlug(value))
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSlugTouched(true)
    setSlug(toSlug(e.target.value))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !slug.trim()) return

    setIsSubmitting(true)
    setError(null)

    const { error: createError } = await authClient.organization.create({
      name: name.trim(),
      slug: slug.trim(),
    })

    setIsSubmitting(false)

    if (createError) {
      setError(createError.message ?? "Something went wrong. Please try again.")
      return
    }

    handleOpenChange(false)
  }

  const isValid = name.trim().length > 0 && slug.trim().length > 0
  const slugState = useCheckOrgSlug(slug)
  const canSubmit = isValid && slugState === "available" && !isSubmitting

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button size="sm" />}>
        <PlusIcon />
        Create school
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit} className="contents">
          <DialogHeader>
            <DialogTitle>Create a school</DialogTitle>
            <DialogDescription>
              Set up a new school organisation.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="school-name">School name</FieldLabel>
              <Input
                id="school-name"
                type="text"
                placeholder="Riverside Academy"
                value={name}
                onChange={handleNameChange}
                autoFocus
                disabled={isSubmitting}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="school-slug">Slug</FieldLabel>
              <div
                className={cn(
                  "flex items-center rounded-md",
                  "border border-input",
                  "bg-input/20 dark:bg-input/30",
                  "px-2 transition-colors focus-within:ring-2",
                  "focus-within:border-ring focus-within:ring-ring/30",
                  slugState === "unavailable" &&
                    "focus-within:border-destructive focus-within:ring-destructive/30"
                )}
              >
                <span className="shrink-0 text-xs text-muted-foreground select-none">
                  /
                </span>
                <input
                  id="school-slug"
                  type="text"
                  placeholder="riverside-academy"
                  value={slug}
                  onChange={handleSlugChange}
                  disabled={isSubmitting}
                  className="h-7 w-full min-w-0 bg-transparent px-1 py-0.5 text-xs/relaxed outline-none placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                />
                {slugState === "checking" && (
                  <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
                )}
                {slugState === "available" && (
                  <CircleCheckIcon className="size-4 text-muted-foreground" />
                )}
                {slugState === "unavailable" && (
                  <CircleXIcon className="size-4 text-destructive" />
                )}
              </div>
              <FieldDescription>
                Used in URLs. Only lowercase letters, numbers, and hyphens.
              </FieldDescription>
            </Field>

            <FieldError>{error}</FieldError>
          </FieldGroup>

          <DialogFooter>
            <DialogClose
              render={
                <Button
                  variant="outline"
                  type="button"
                  disabled={isSubmitting}
                />
              }
            >
              Cancel
            </DialogClose>
            <Button type="submit" disabled={!canSubmit}>
              {isSubmitting ? (
                <>
                  <Loader2Icon className="animate-spin" />
                  Creating…
                </>
              ) : (
                <>
                  <SchoolIcon />
                  Create school
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
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
          <CreateSchoolDialog />
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
              <Link
                key={org.id}
                href={`/app/schools/${org.slug}/general`}
                className="group outline-none"
              >
                <Card className="h-full transition-shadow duration-150 group-hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-ring">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Avatar size="lg">
                        {org.logo && (
                          <AvatarImage src={org.logo} alt={org.name} />
                        )}
                        <AvatarFallback>{getInitials(org.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex min-w-0 flex-col gap-0.5">
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
              </Link>
            ))}
          </div>
        )}
      </div>
    </SidebarWrapper>
  )
}
