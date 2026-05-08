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

interface RenameClassDialogProps {
  classId: Id<"classes">
  currentName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RenameClassDialog({
  classId,
  currentName,
  open,
  onOpenChange,
}: RenameClassDialogProps) {
  const [value, setValue] = useState(currentName)
  const [isPending, setIsPending] = useState(false)
  const renameClass = useMutation(api.classes.renameClass)

  function handleOpenChange(next: boolean) {
    if (!next) setValue(currentName)
    onOpenChange(next)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed || trimmed === currentName) {
      onOpenChange(false)
      return
    }
    setIsPending(true)
    try {
      await renameClass({ classId, newName: trimmed })
      onOpenChange(false)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename class</DialogTitle>
          <DialogDescription>
            Enter a new name for &ldquo;{currentName}&rdquo;.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="rename-class">Class name</Label>
            <Input
              id="rename-class"
              value={value}
              onChange={(e) => setValue(e.target.value)}
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
            <Button type="submit" disabled={!value.trim() || isPending}>
              {isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
