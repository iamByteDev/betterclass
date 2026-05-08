"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { RefreshCw, X } from "lucide-react"

function generateCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase()
}

interface AddClientsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddClientsDialog({ open, onOpenChange }: AddClientsDialogProps) {
  const [classCode, setClassCode] = useState<string | null>(generateCode())
  const [isReloading, setIsReloading] = useState(false)

  async function handleRegenCode() {
    setIsReloading(true)
    await new Promise((r) => setTimeout(r, 600))
    setClassCode(generateCode())
    setIsReloading(false)
  }

  function handleRevokeCode() {
    setClassCode(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Add clients</DialogTitle>
          <DialogDescription>
            Use this code to setup new clients for this classroom.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          {classCode ? (
            <div className="flex items-center gap-2">
              <div className="flex flex-1 items-center justify-center rounded-lg border border-border bg-muted px-4 py-3">
                <span className="font-mono text-2xl font-bold tracking-[0.25em] text-foreground">
                  {classCode}
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 shrink-0"
                        onClick={handleRegenCode}
                        disabled={isReloading}
                      >
                        <RefreshCw
                          className={`h-4 w-4 ${isReloading ? "animate-spin" : ""}`}
                        />
                      </Button>
                    }
                  />
                  <TooltipContent side="right">
                    <p>Regenerate code</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={handleRevokeCode}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    }
                  />
                  <TooltipContent side="right">
                    <p>Revoke code</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-muted/50 px-4 py-6 text-center">
              <p className="text-sm text-muted-foreground">
                Class code has been revoked.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={handleRegenCode}
                disabled={isReloading}
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${isReloading ? "animate-spin" : ""}`}
                />
                Generate new code
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
