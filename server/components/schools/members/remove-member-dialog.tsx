"use client"

import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { useSchoolContext } from "@/components/schools/school-context"
import { type OrgMember } from "@/hooks/use-school"
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

interface RemoveMemberDialogProps {
  member: OrgMember
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RemoveMemberDialog({
  member,
  open,
  onOpenChange,
}: RemoveMemberDialogProps) {
  const { organization: org } = useSchoolContext()
  const [isRemoving, setIsRemoving] = useState(false)

  async function handleRemove() {
    setIsRemoving(true)
    const { error } = await authClient.organization.removeMember({
      memberIdOrEmail: member.user.email,
      organizationId: org.id,
    })
    setIsRemoving(false)
    if (error) {
      toast.error("Failed to remove member", { description: error.message })
      return
    }
    toast.success(`${member.user.name} removed`)
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove {member.user.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            {member.user.name} will lose access to this school immediately. They
            can be re-invited at any time.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isRemoving}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleRemove}
            disabled={isRemoving}
          >
            {isRemoving && <Spinner className="size-3" />}
            {isRemoving ? "Removing…" : "Remove member"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function RemoveMemberTrigger({ member }: { member: OrgMember }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <AlertDialogTrigger
        render={
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="w-full px-2 py-1.5 text-start text-xs text-destructive hover:bg-accent focus:outline-none"
          />
        }
      />
      <RemoveMemberDialog member={member} open={open} onOpenChange={setOpen} />
    </>
  )
}
