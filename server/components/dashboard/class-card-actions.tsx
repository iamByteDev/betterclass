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
import { RenameClassDialog } from "./rename-class-dialog"
import { DeleteClassDialog } from "./delete-class-dialog"

interface ClassCardActionsProps {
  classId: Id<"classes">
  className: string
}

export function ClassCardActions({
  classId,
  className,
}: ClassCardActionsProps) {
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
          <span className="sr-only">Class options</span>
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

      <RenameClassDialog
        classId={classId}
        currentName={className}
        open={renameOpen}
        onOpenChange={setRenameOpen}
      />
      <DeleteClassDialog
        classId={classId}
        className={className}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </div>
  )
}
