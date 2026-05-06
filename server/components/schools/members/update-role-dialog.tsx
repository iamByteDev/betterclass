"use client"

import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { useSchoolContext } from "@/components/schools/school-context"
import { type OrgMember } from "@/hooks/use-school"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Field, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"

const ROLES = [
  { value: "owner", label: "Owner" },
  { value: "admin", label: "Admin" },
  { value: "member", label: "Member" },
] as const

interface UpdateRoleDialogProps {
  member: OrgMember
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpdateRoleDialog({
  member,
  open,
  onOpenChange,
}: UpdateRoleDialogProps) {
  const { organization: org } = useSchoolContext()
  const [role, setRole] = useState(member.role)
  const [isSaving, setIsSaving] = useState(false)

  const isDirty = role !== member.role
  const canSave = isDirty && !isSaving

  async function handleSave() {
    if (!canSave) return
    setIsSaving(true)
    const { error } = await authClient.organization.updateMemberRole({
      memberId: member.id,
      organizationId: org.id,
      role,
    })
    setIsSaving(false)
    if (error) {
      toast.error("Failed to update role", { description: error.message })
      return
    }
    toast.success("Role updated", {
      description: `${member.user.name} is now a${role === "owner" ? "n" : ""} ${role}.`,
    })
    onOpenChange(false)
  }

  function handleOpenChange(next: boolean) {
    onOpenChange(next)
    if (!next) setRole(member.role)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update role</DialogTitle>
          <DialogDescription>
            Change the role for <strong>{member.user.name}</strong>.
          </DialogDescription>
        </DialogHeader>
        <Field>
          <FieldLabel>Role</FieldLabel>
          <Select value={role} onValueChange={(val) => setRole(val)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <DialogFooter>
          <DialogClose
            render={
              <Button variant="outline" type="button" disabled={isSaving} />
            }
          >
            Cancel
          </DialogClose>
          <Button type="button" onClick={handleSave} disabled={!canSave}>
            {isSaving && <Spinner className="size-3" />}
            {isSaving ? "Saving…" : "Update role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
