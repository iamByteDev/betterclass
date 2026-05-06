"use client"

import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { useSchoolContext } from "@/components/schools/school-context"
import { InviteMemberDialog } from "@/components/schools/invitations/invite-member-dialog"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import { MoreHorizontalIcon, MailIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { MEMBER_ROLES } from "@/components/schools/configuration"

type Invitation = {
  id: string
  email: string
  role?: string | null
  status: string
  createdAt: Date | number
  expiresAt: Date | number
  inviterId: string
  organizationId: string
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  accepted: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  rejected: "bg-destructive/10 text-destructive",
  canceled: "border-border bg-input/20 text-muted-foreground dark:bg-input/30",
}

function statusLabel(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

function roleLabel(role?: string | null) {
  if (!role) return "Member"
  const roleObject = MEMBER_ROLES.find((r) => r.value === role)
  if (!roleObject) return "Member"
  return roleObject.label
}

function InvitationRow({
  invitation,
  canCancel,
}: {
  invitation: Invitation
  canCancel: boolean
}) {
  const [isCanceling, setIsCanceling] = useState(false)

  async function handleCancel() {
    setIsCanceling(true)
    const { error } = await authClient.organization.cancelInvitation({
      invitationId: invitation.id,
    })
    setIsCanceling(false)
    if (error) {
      toast.error("Failed to cancel", { description: error.message })
      return
    }
    toast.success("Invitation cancelled")
  }

  const createdDate = new Date(invitation.createdAt).toLocaleDateString(
    "en-GB",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  )

  const isPending = invitation.status === "pending"

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          <MailIcon className="size-3 shrink-0 text-muted-foreground/60" />
          <span>{invitation.email}</span>
        </div>
      </TableCell>
      <TableCell>
        <Badge
          className={cn(
            "border",
            STATUS_STYLES[invitation.status] ?? STATUS_STYLES.pending
          )}
        >
          {statusLabel(invitation.status)}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge className="border border-border bg-input/20 text-foreground dark:bg-input/30">
          {roleLabel(invitation.role)}
        </Badge>
      </TableCell>
      <TableCell className="text-muted-foreground">{createdDate}</TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-1">
          {isPending && canCancel && (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-muted-foreground"
                    disabled={isCanceling}
                  />
                }
              >
                {isCanceling ? (
                  <Spinner className="size-3.5" />
                ) : (
                  <MoreHorizontalIcon className="size-3.5" />
                )}
                <span className="sr-only">Invitation actions</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-36">
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={handleCancel}
                >
                  Cancel invitation
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </TableCell>
    </TableRow>
  )
}

export function InvitationsPage() {
  const { organization: org, can } = useSchoolContext()

  const canInvite = can({ invitation: ["create"] })
  const canCancel = can({ invitation: ["cancel"] })

  const invitations = useQuery(api.auth.listOrgInvitations, {
    organizationId: org.id,
  })
  const isPending = invitations === undefined

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-xs font-semibold">Invitations</h2>
          <p className="text-xs text-muted-foreground">
            Manage pending and past invitations.
          </p>
        </div>
        {canInvite && <InviteMemberDialog />}
      </div>

      {isPending ? (
        <div className="flex items-center justify-center py-12">
          <Spinner className="size-4 text-muted-foreground" />
        </div>
      ) : invitations.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <MailIcon />
            </EmptyMedia>
            <EmptyTitle>No invitations yet</EmptyTitle>
            <EmptyDescription>Invite someone to get started.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead className="w-16" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitations.map((inv) => (
                <InvitationRow
                  key={inv.id}
                  invitation={inv}
                  canCancel={canCancel}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
