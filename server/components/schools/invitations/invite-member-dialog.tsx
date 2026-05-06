"use client"

import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { useSchoolContext } from "@/components/schools/school-context"
import { CopyInviteLink } from "@/components/schools/invitations/copy-invite-link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
  FieldDescription,
} from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { UserPlusIcon, CheckCircleIcon } from "lucide-react"
import { toast } from "sonner"
import {
  MEMBER_ROLES,
  type MemberRole,
} from "@/components/schools/configuration"

export function InviteMemberDialog() {
  const { organization: org } = useSchoolContext()
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<MemberRole | null>("member")
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [invitationId, setInvitationId] = useState<string | null>(null)

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      setEmail("")
      setRole("member")
      setError(null)
      setIsSending(false)
      setInvitationId(null)
    }
  }

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setIsSending(true)
    setError(null)

    let validatedRole: MemberRole = "member"
    if (role && MEMBER_ROLES.some((r) => r.value === role)) {
      validatedRole = role as MemberRole
    }

    const { data, error: inviteError } =
      await authClient.organization.inviteMember({
        email: email.trim(),
        role: validatedRole,
        organizationId: org.id,
      })

    setIsSending(false)

    if (inviteError) {
      setError(inviteError.message ?? "Failed to send invitation.")
      return
    }

    if (data?.id) {
      setInvitationId(data.id)
      toast.success("Invitation created", {
        description: `Invitation for ${email} is ready to share.`,
      })
    }
  }

  const inviteUrl = invitationId
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/accept-invitation/${invitationId}`
    : null

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button size="sm" />}>
        <UserPlusIcon />
        Invite member
      </DialogTrigger>
      <DialogContent>
        {invitationId && inviteUrl ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircleIcon className="size-4 text-emerald-500" />
                Invitation ready
              </DialogTitle>
              <DialogDescription>
                Share this link with {email} to give them access.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-2">
              <p className="min-w-0 flex-1 truncate font-mono text-[0.65rem] text-muted-foreground">
                {inviteUrl}
              </p>
              <CopyInviteLink invitationId={invitationId} size="sm" />
            </div>
            <DialogFooter>
              <Button type="button" onClick={() => handleOpenChange(false)}>
                Done
              </Button>
            </DialogFooter>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="contents">
            <DialogHeader>
              <DialogTitle>Invite a member</DialogTitle>
              <DialogDescription>
                Send an invitation to join <strong>{org.name}</strong>.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="invite-email">Email address</FieldLabel>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="jane@school.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                  disabled={isSending}
                  required
                />
              </Field>
              <Field>
                <FieldLabel>Role</FieldLabel>
                <Select
                  value={role}
                  onValueChange={(val) => setRole(val)}
                  items={MEMBER_ROLES}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MEMBER_ROLES.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldDescription>
                  Members can view. Admins can manage members and invitations.
                </FieldDescription>
              </Field>
              {error && <FieldError>{error}</FieldError>}
            </FieldGroup>
            <DialogFooter>
              <DialogClose
                render={
                  <Button
                    variant="outline"
                    type="button"
                    disabled={isSending}
                  />
                }
              >
                Cancel
              </DialogClose>
              <Button type="submit" disabled={!email.trim() || isSending}>
                {isSending && <Spinner className="size-3" />}
                {isSending ? "Sending…" : "Send invitation"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
