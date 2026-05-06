"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { DashboardHeader } from "@/components/dashboard/header"
import { SidebarWrapper } from "@/components/dashboard/sidebar-wrapper"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SchoolIcon, Loader2Icon } from "lucide-react"

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export default function CreateSchoolPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [slugTouched, setSlugTouched] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setName(value)
    if (!slugTouched) {
      setSlug(toSlug(value))
    }
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

    router.push("/app/schools")
  }

  const isValid = name.trim().length > 0 && slug.trim().length > 0

  return (
    <SidebarWrapper>
      <DashboardHeader
        breadcrumbs={[
          { label: "Schools", href: "/app/schools" },
          { label: "Create" },
        ]}
      />
      <div className="flex flex-1 items-center justify-center p-4 pt-0">
        <form onSubmit={handleSubmit}>
          <Card className="w-sm">
            <CardHeader>
              <CardTitle>Create a school</CardTitle>
              <CardDescription>
                Set up a new school organisation.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">School name</FieldLabel>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Riverside Academy"
                    value={name}
                    onChange={handleNameChange}
                    autoFocus
                    disabled={isSubmitting}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="slug">Slug</FieldLabel>
                  <div className="flex items-center rounded-md border border-input bg-input/20 px-2 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30 dark:bg-input/30 transition-colors">
                    <span className="text-xs text-muted-foreground select-none shrink-0">
                      /
                    </span>
                    <input
                      id="slug"
                      type="text"
                      placeholder="riverside-academy"
                      value={slug}
                      onChange={handleSlugChange}
                      disabled={isSubmitting}
                      className="h-7 w-full min-w-0 bg-transparent px-1 py-0.5 text-xs/relaxed outline-none placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <FieldDescription>
                    Used in URLs. Only lowercase letters, numbers, and hyphens.
                  </FieldDescription>
                </Field>

                <FieldError>{error}</FieldError>
              </FieldGroup>
            </CardContent>

            <CardFooter className="border-t gap-2">
              <Button type="submit" disabled={!isValid || isSubmitting}>
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
              <Button
                type="button"
                variant="ghost"
                disabled={isSubmitting}
                onClick={() => router.push("/app/schools")}
              >
                Cancel
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </SidebarWrapper>
  )
}
