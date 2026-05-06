"use client"

import { useState } from "react"
import { useSchoolContext } from "@/components/schools/school-context"
import { type OrgMember } from "@/hooks/use-school"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { UpdateRoleDialog } from "@/components/schools/members/update-role-dialog"
import { RemoveMemberDialog } from "@/components/schools/members/remove-member-dialog"
import { InviteMemberDialog } from "@/components/schools/invitations/invite-member-dialog"
import { MoreHorizontalIcon, UsersIcon } from "lucide-react"
import { cn, getInitials } from "@/lib/utils"

const ROLE_STYLES: Record<string, string> = {
  owner: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  admin: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  member: "border-border bg-input/20 text-foreground dark:bg-input/30",
}

function roleLabel(role: string) {
  return role.charAt(0).toUpperCase() + role.slice(1)
}

function MemberRow({ member }: { member: OrgMember }) {
  const { currentMember, can } = useSchoolContext()
  const [updateOpen, setUpdateOpen] = useState(false)
  const [removeOpen, setRemoveOpen] = useState(false)

  const isSelf = member.user.email === currentMember?.user.email
  const canUpdateRole = can({ member: ["update"] }) && !isSelf
  const canRemove = can({ member: ["delete"] }) && !isSelf

  const joinedDate = new Date(member.createdAt).toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  })

  const showActions = canUpdateRole || canRemove

  return (
    <>
      <TableRow>
        <TableCell>
          <div className="flex items-center gap-2.5">
            <Avatar size="sm">
              {member.user.image && (
                <AvatarImage src={member.user.image} alt={member.user.name} />
              )}
              <AvatarFallback>{getInitials(member.user.name)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs leading-none font-medium">
                {member.user.name}
                {isSelf && (
                  <span className="ms-1.5 text-[0.6rem] text-muted-foreground">
                    (you)
                  </span>
                )}
              </span>
              <span className="text-[0.65rem] text-muted-foreground">
                {member.user.email}
              </span>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <Badge
            className={cn(
              "border",
              ROLE_STYLES[member.role] ?? ROLE_STYLES.member
            )}
          >
            {roleLabel(member.role)}
          </Badge>
        </TableCell>
        <TableCell className="text-muted-foreground">{joinedDate}</TableCell>
        <TableCell>
          {showActions && (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-muted-foreground"
                  />
                }
              >
                <MoreHorizontalIcon className="size-3.5" />
                <span className="sr-only">Member actions</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-36">
                {canUpdateRole && (
                  <DropdownMenuItem onClick={() => setUpdateOpen(true)}>
                    Update role
                  </DropdownMenuItem>
                )}
                {canUpdateRole && canRemove && <DropdownMenuSeparator />}
                {canRemove && (
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => setRemoveOpen(true)}
                  >
                    Remove
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </TableCell>
      </TableRow>

      {canUpdateRole && (
        <UpdateRoleDialog
          member={member}
          open={updateOpen}
          onOpenChange={setUpdateOpen}
        />
      )}
      {canRemove && (
        <RemoveMemberDialog
          member={member}
          open={removeOpen}
          onOpenChange={setRemoveOpen}
        />
      )}
    </>
  )
}

export function MembersPage() {
  const { members, can } = useSchoolContext()
  const canInvite = can({ invitation: ["create"] })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-xs font-semibold">Members</h2>
          <p className="text-xs text-muted-foreground">
            {members.length} {members.length === 1 ? "member" : "members"}
          </p>
        </div>
        {canInvite && <InviteMemberDialog />}
      </div>

      {members.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-12 text-center">
          <UsersIcon className="size-6 text-muted-foreground/50" />
          <p className="text-xs text-muted-foreground">No members yet.</p>
        </div>
      ) : (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <MemberRow key={member.id} member={member} />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
