"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { useSchoolContext } from "@/components/schools/school-context"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"

function LeaveDialog() {
  const { organization: org } = useSchoolContext()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  async function handleLeave() {
    setIsLeaving(true)
    try {
      const { error } = await authClient.organization.leave({
        organizationId: org.id,
      })
      if (error) {
        toast.error("Failed to leave", { description: error.message })
        return
      }
      toast.success(`Left ${org.name}`)
      setOpen(false)
      router.push("/app/schools")
    } catch {
      toast.error("Failed to leave")
    } finally {
      setIsLeaving(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={<Button variant="outline" size="sm" className={DANGER_BTN} />}
      >
        Leave school
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Leave {org.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            You will lose access to this school and its resources. You can only
            rejoin if re-invited by an admin.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLeaving}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleLeave}
            disabled={isLeaving}
          >
            {isLeaving && <Spinner className="size-3" />}
            {isLeaving ? "Leaving…" : "Leave school"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function DeleteDialog() {
  const { organization: org } = useSchoolContext()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [confirm, setConfirm] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  const canConfirm = confirm === org.name && !isDeleting

  async function handleDelete() {
    if (!canConfirm) return
    setIsDeleting(true)
    try {
      const { error } = await authClient.organization.delete({
        organizationId: org.id,
      })
      if (error) {
        toast.error("Failed to delete", { description: error.message })
        return
      }
      toast.success(`${org.name} deleted`)
      setOpen(false)
      router.push("/app/schools")
    } catch {
      toast.error("Failed to delete")
    } finally {
      setIsDeleting(false)
    }
  }

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) setConfirm("")
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger
        render={<Button variant="outline" size="sm" className={DANGER_BTN} />}
      >
        Delete school
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {org.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently deletes the school, all members, and all
            invitations. This action cannot be undone.
            <br />
            <br />
            Type <strong>{org.name}</strong> to confirm.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <input
          type="text"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder={org.name}
          className="w-full rounded-md border border-input bg-input/20 px-3 py-1.5 text-xs outline-none focus:border-ring focus:ring-2 focus:ring-ring/30 dark:bg-input/30"
        />
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDelete}
            disabled={!canConfirm}
          >
            {isDeleting && <Spinner className="size-3" />}
            {isDeleting ? "Deleting…" : "Delete school"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

const DANGER_BTN =
  "border-destructive/50 text-destructive hover:bg-destructive/5 hover:text-destructive"

export function DangerZone() {
  const { can, currentMember } = useSchoolContext()
  const isOwner = currentMember?.role === "owner"
  const canDelete = can({ organization: ["delete"] })
  const canLeave = !isOwner

  if (!canLeave && !canDelete) return null

  return (
    <div className="rounded-lg border border-destructive/40">
      <div className="border-b border-destructive/40 px-4 py-3">
        <h2 className="text-xs font-semibold text-destructive">Danger zone</h2>
      </div>
      <div className="flex flex-col divide-y divide-destructive/20">
        {canLeave && (
          <div className="flex items-center justify-between gap-4 px-4 py-3">
            <div className="flex flex-col gap-0.5">
              <p className="text-xs font-medium">Leave school</p>
              <p className="text-xs text-muted-foreground">
                Remove yourself from this organisation. You will need to be
                re-invited to regain access.
              </p>
            </div>
            <LeaveDialog />
          </div>
        )}

        {canDelete && (
          <div className="flex items-center justify-between gap-4 px-4 py-3">
            <div className="flex flex-col gap-0.5">
              <p className="text-xs font-medium">Delete school</p>
              <p className="text-xs text-muted-foreground">
                Permanently delete this school and all associated data. This
                cannot be undone.
              </p>
            </div>
            <DeleteDialog />
          </div>
        )}
      </div>
    </div>
  )
}
