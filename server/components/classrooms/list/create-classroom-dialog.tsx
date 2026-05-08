"use client"

import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { PlusIcon } from "lucide-react"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"

interface CreateClassroomDialogProps {
  organizationId: string
  children?: React.ReactNode
}

export function CreateClassroomDialog({
  organizationId,
  children,
}: CreateClassroomDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [isPending, setIsPending] = useState(false)
  const createClassroom = useMutation(api.classrooms.createClassroom)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return

    setIsPending(true)
    try {
      const result = await createClassroom({
        organizationId,
        classroomName: trimmed,
      })
      if (result.success) {
        toast.success("Classroom created successfully!")
        setOpen(false)
      } else {
        toast.error(result.error ?? "Failed to create classroom!")
      }

      setName("")
    } finally {
      setIsPending(false)
    }
  }

  function handleOpenChange(next: boolean) {
    if (!next) setName("")
    setOpen(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          children ? (
            <span>{children}</span>
          ) : (
            <Button size="sm">
              <PlusIcon />
              New classroom
            </Button>
          )
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New classroom</DialogTitle>
          <DialogDescription>
            Give your classroom a name to get started.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="classroom-name">Classroom name</Label>
            <Input
              id="classroom-name"
              placeholder="e.g. Biology 101"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            <Button type="submit" disabled={!name.trim() || isPending}>
              {isPending ? "Creating…" : "Create classroom"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
