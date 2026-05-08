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

interface CreateClassDialogProps {
  organizationId: string
  children?: React.ReactNode
}

export function CreateClassDialog({
  organizationId,
  children,
}: CreateClassDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [isPending, setIsPending] = useState(false)
  const createClass = useMutation(api.classes.createClass)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return

    setIsPending(true)
    try {
      await createClass({ organizationId, className: trimmed })
      setOpen(false)
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
              New class
            </Button>
          )
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New class</DialogTitle>
          <DialogDescription>
            Give your class a name to get started.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="class-name">Class name</Label>
            <Input
              id="class-name"
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
            <Button
              type="submit"
              disabled={!name.trim() || isPending}
            >
              {isPending ? "Creating…" : "Create class"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
