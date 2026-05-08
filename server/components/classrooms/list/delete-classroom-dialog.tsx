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
import { toast } from "sonner"

interface DeleteClassroomDialogProps {
  classroomId: Id<"classrooms">
  name: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteClassroomDialog({
  classroomId,
  name,
  open,
  onOpenChange,
}: DeleteClassroomDialogProps) {
  const [isPending, setIsPending] = useState(false)
  const deleteClassroom = useMutation(api.classrooms.deleteClassroom)

  async function handleDelete() {
    setIsPending(true)
    try {
      const result = await deleteClassroom({ classroomId })
      if (result.success) {
        onOpenChange(false)
        toast.success("Classroom deleted successfully.")
      } else {
        toast.error(result.error ?? "Failed to delete classroom.")
      }
    } finally {
      setIsPending(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete classroom?</AlertDialogTitle>
          <AlertDialogDescription>
            &ldquo;{name}&rdquo; will be permanently deleted.
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
