"use client"

import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

interface DeleteClassDialogProps {
  classId: Id<"classes">
  className: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteClassDialog({
  classId,
  className,
  open,
  onOpenChange,
}: DeleteClassDialogProps) {
  const [isPending, setIsPending] = useState(false)
  const deleteClass = useMutation(api.classes.deleteClass)

  async function handleDelete() {
    setIsPending(true)
    try {
      await deleteClass({ classId })
      onOpenChange(false)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete class?</AlertDialogTitle>
          <AlertDialogDescription>
            &ldquo;{className}&rdquo; will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isPending}
            onClick={handleDelete}
          >
            {isPending ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
