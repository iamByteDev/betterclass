"use client"

import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { toast } from "sonner"

interface RenameClassroomDialogProps {
  classroomId: Id<"classrooms">
  currentName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RenameClassroomDialog({
  classroomId,
  currentName,
  open,
  onOpenChange,
}: RenameClassroomDialogProps) {
  const [value, setValue] = useState(currentName)
  const [isPending, setIsPending] = useState(false)
  const renameClassroom = useMutation(api.classrooms.renameClassroom)

  function handleOpenChange(next: boolean) {
    if (!next) setValue(currentName)
    onOpenChange(next)
  }

  async function commitRename() {
    const trimmed = value.trim()
    if (!trimmed || trimmed === currentName) {
      handleOpenChange(false)
      return
    }
    setIsPending(true)
    try {
      const result = await renameClassroom({ classroomId, newName: trimmed })
      if (result.success) {
        handleOpenChange(false)
        toast.success("Classroom renamed successfully!")
      } else {
        toast.error(result.error || "Failed to rename classroom!")
      }
    } finally {
      setIsPending(false)
    }
  }

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault()
    void commitRename()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename classroom</DialogTitle>
          <DialogDescription>
            Enter a new name for &ldquo;{currentName}&rdquo;.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="rename-classroom">Classroom name</Label>
            <Input
              id="rename-classroom"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  void commitRename()
                }
              }}
              autoFocus
              disabled={isPending}
            />
          </div>
          <DialogFooter>
            <DialogClose
              render={
                <Button variant="outline" type="button" disabled={isPending} />
              }
            >
              Cancel
            </DialogClose>
            <Button
              type="button"
              disabled={!value.trim() || isPending}
              onClick={() => void commitRename()}
            >
              {isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
