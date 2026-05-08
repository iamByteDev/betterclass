"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import { Badge } from "@/components/ui/badge"
import { MailIcon, CheckIcon, XIcon } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"

type Invitation = {
  id: string
  email: string
  role?: string | null
  status: string
  organizationId: string
  organizationName?: string | null
  organizationSlug?: string | null
  createdAt: Date | number
  expiresAt: Date | number
  inviterId: string
}

function InvitationItem({ invitation }: { invitation: Invitation }) {
  const [isAccepting, setIsAccepting] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const busy = isAccepting || isRejecting

  async function handleAccept() {
    setIsAccepting(true)
    try {
      const { error } = await authClient.organization.acceptInvitation({
        invitationId: invitation.id,
      })
      if (error) {
        toast.error("Failed to accept", { description: error.message })
        return
      }
      toast.success("Invitation accepted")
    } catch {
      toast.error("Failed to accept invitation")
    } finally {
      setIsAccepting(false)
    }
  }

  async function handleReject() {
    setIsRejecting(true)
    try {
      const { error } = await authClient.organization.rejectInvitation({
        invitationId: invitation.id,
      })
      if (error) {
        toast.error("Failed to reject", { description: error.message })
        return
      }
      toast.success("Invitation rejected")
    } catch {
      toast.error("Failed to reject invitation")
    } finally {
      setIsRejecting(false)
    }
  }

  const sentDate = new Date(invitation.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border px-4 py-3">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {invitation.organizationName ?? invitation.organizationId}
          </span>
          {invitation.role && (
            <Badge className="border border-border bg-input/20 text-foreground dark:bg-input/30">
              {invitation.role.charAt(0).toUpperCase() +
                invitation.role.slice(1)}
            </Badge>
          )}
        </div>
        <span className="text-xs text-muted-foreground">
          Sent {sentDate}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={busy}
          onClick={handleReject}
        >
          {isRejecting ? (
            <Spinner className="size-3.5" />
          ) : (
            <XIcon className="size-3.5" />
          )}
          Reject
        </Button>
        <Button size="sm" disabled={busy} onClick={handleAccept}>
          {isAccepting ? (
            <Spinner className="size-3.5" />
          ) : (
            <CheckIcon className="size-3.5" />
          )}
          Accept
        </Button>
      </div>
    </div>
  )
}

export default function InvitesPage() {
  const invitations = useQuery(api.organization.listUserInvitations)
  const isPending = invitations === undefined

  const pendingInvitations = invitations?.filter(
    (inv) => inv.status === "pending"
  )

  return (
    <>
      <DashboardHeader breadcrumbs={[{ label: "Invites" }]} />
      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        <div className="flex flex-col gap-1">
          <h1 className="text-base font-semibold">Invites</h1>
          <p className="text-xs text-muted-foreground">
            Pending invitations to join organisations.
          </p>
        </div>

        {isPending ? (
          <div className="flex items-center justify-center py-12">
            <Spinner className="size-4 text-muted-foreground" />
          </div>
        ) : !pendingInvitations || pendingInvitations.length === 0 ? (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <MailIcon />
              </EmptyMedia>
              <EmptyTitle>No pending invitations</EmptyTitle>
              <EmptyDescription>
                You don&apos;t have any invitations right now.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="flex flex-col gap-3">
            {pendingInvitations.map((inv) => (
              <InvitationItem key={inv.id} invitation={inv} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
