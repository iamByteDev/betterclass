"use client"

import { useState } from "react"
import type { Id } from "@/convex/_generated/dataModel"
import { EllipsisIcon, PencilIcon, Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { RenameClassroomDialog } from "./rename-classroom-dialog"
import { DeleteClassroomDialog } from "./delete-classroom-dialog"

interface ClassroomCardActionsProps {
  classroomId: Id<"classrooms">
  name: string
}

export function ClassroomCardActions({
  classroomId,
  name,
}: ClassroomCardActionsProps) {
  const [renameOpen, setRenameOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <div onClick={(e) => e.preventDefault()}>
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
          <EllipsisIcon />
          <span className="sr-only">Classroom options</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setRenameOpen(true)}>
            <PencilIcon />
            Rename
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2Icon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <RenameClassroomDialog
        classroomId={classroomId}
        currentName={name}
        open={renameOpen}
        onOpenChange={setRenameOpen}
      />
      <DeleteClassroomDialog
        classroomId={classroomId}
        name={name}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </div>
  )
}
