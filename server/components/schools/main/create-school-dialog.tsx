"use client"

import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { useCheckOrgSlug } from "@/hooks/use-check-org-slug"
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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  SchoolIcon,
  PlusIcon,
  Loader2Icon,
  CircleCheckIcon,
  CircleXIcon,
} from "lucide-react"
import { cn, toSlug } from "@/lib/utils"

export function CreateSchoolDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [slugTouched, setSlugTouched] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleOpenChange(next: boolean) {
    if (!next && isSubmitting) return

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

    try {
      const { error: createError } = await authClient.organization.create({
        name: name.trim(),
        slug: slug.trim(),
      })

      if (createError) {
        setError(
          createError.message ?? "Something went wrong. Please try again."
        )
        return
      }

      setOpen(false)
      setName("")
      setSlug("")
      setSlugTouched(false)
      setError(null)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
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
      <DialogContent showCloseButton={!isSubmitting}>
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
                  slugState === "available" &&
                    "focus-within:border-success focus-within:ring-success/30",
                  slugState === "unavailable" &&
                    "focus-within:border-destructive focus-within:ring-destructive/30"
                )}
              >
                <input
                  id="school-slug"
                  type="text"
                  placeholder="riverside-academy"
                  value={slug}
                  onChange={handleSlugChange}
                  disabled={isSubmitting}
                  className="h-7 w-full min-w-0 bg-transparent py-0.5 pr-1 text-xs/relaxed outline-none placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                />
                {slugState === "checking" && (
                  <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
                )}
                {slugState === "available" && (
                  <CircleCheckIcon className="size-4 text-success" />
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
