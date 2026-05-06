"use client"

import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { useSchoolContext } from "@/components/schools/school-context"
import { useCheckOrgSlug } from "@/hooks/use-check-org-slug"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { CircleCheckIcon, CircleXIcon, Loader2Icon } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export function GeneralForm() {
  const { organization: org, can } = useSchoolContext()

  const [name, setName] = useState(org.name)
  const [slug, setSlug] = useState(org.slug)
  const [logo, setLogo] = useState(org.logo ?? "")
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canEdit = can({ organization: ["update"] })

  const rawSlugState = useCheckOrgSlug(slug)
  const slugState = slug === org.slug ? "available" : rawSlugState

  const isDirty =
    name !== org.name || slug !== org.slug || logo !== (org.logo ?? "")
  const isSlugValid = slugState === "available"
  const canSave =
    canEdit && isDirty && isSlugValid && name.trim().length > 0 && !isSaving

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setName(value)
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSlug(toSlug(e.target.value))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSave) return
    setIsSaving(true)
    setError(null)

    const { error: updateError } = await authClient.organization.update({
      organizationId: org.id,
      data: {
        name: name.trim(),
        slug: slug.trim(),
        logo: logo.trim() || undefined,
      },
    })

    setIsSaving(false)

    if (updateError) {
      setError(updateError.message ?? "Failed to save changes.")
      return
    }

    toast.success("School updated", {
      description: "Your changes have been saved.",
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-lg border border-border bg-card">
        <div className="flex flex-col gap-1 border-b border-border px-4 py-3">
          <h2 className="text-xs font-semibold">General</h2>
          <p className="text-xs text-muted-foreground">
            Basic information about this school.
          </p>
        </div>
        <div className="p-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="org-name">School name</FieldLabel>
              <Input
                id="org-name"
                type="text"
                value={name}
                onChange={handleNameChange}
                disabled={!canEdit || isSaving}
                placeholder="Riverside Academy"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="org-slug">Slug</FieldLabel>
              <div
                className={cn(
                  "flex items-center rounded-md border border-input bg-input/20 px-2 transition-colors",
                  "focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30",
                  "dark:bg-input/30",
                  slugState === "unavailable" &&
                    "focus-within:border-destructive focus-within:ring-destructive/30"
                )}
              >
                <span className="shrink-0 text-xs text-muted-foreground select-none">
                  /
                </span>
                <input
                  id="org-slug"
                  type="text"
                  value={slug}
                  onChange={handleSlugChange}
                  disabled={!canEdit || isSaving}
                  placeholder="riverside-academy"
                  className="h-7 w-full min-w-0 bg-transparent px-1 py-0.5 text-xs/relaxed outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                />
                {slugState === "checking" && (
                  <Loader2Icon className="size-3.5 animate-spin text-muted-foreground" />
                )}
                {slugState === "available" && slug !== org.slug && (
                  <CircleCheckIcon className="size-3.5 text-muted-foreground" />
                )}
                {slugState === "unavailable" && (
                  <CircleXIcon className="size-3.5 text-destructive" />
                )}
              </div>
              <FieldDescription>
                Used in URLs. Lowercase letters, numbers, and hyphens only.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="org-logo">Logo URL</FieldLabel>
              <Input
                id="org-logo"
                type="url"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                disabled={!canEdit || isSaving}
                placeholder="https://example.com/logo.png"
              />
              <FieldDescription>
                Optional. A publicly accessible image URL.
              </FieldDescription>
            </Field>

            {error && <FieldError>{error}</FieldError>}
          </FieldGroup>
        </div>
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          {!canEdit && (
            <p className="text-xs text-muted-foreground">
              You don&apos;t have permission to edit this school.
            </p>
          )}
          <div className="ms-auto">
            <Button type="submit" size="sm" disabled={!canSave}>
              {isSaving && <Spinner className="size-3" />}
              {isSaving ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
