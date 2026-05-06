"use client"

import { Button } from "@/components/ui/button"
import { CopyIcon, CheckIcon } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export function CopyInviteLink({
  invitationId,
  size = "icon-sm",
}: {
  invitationId: string
  size?: "icon-sm" | "sm"
}) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    const url = `${window.location.origin}/accept-invitation/${invitationId}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    toast.success("Link copied", {
      description: "Share this link with the invitee.",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      variant="ghost"
      size={size}
      type="button"
      onClick={handleCopy}
      title="Copy invite link"
      className="text-muted-foreground transition-colors duration-150"
    >
      {copied ? (
        <CheckIcon className="size-3.5 text-emerald-500" />
      ) : (
        <CopyIcon className="size-3.5" />
      )}
      {size === "sm" && <span>{copied ? "Copied" : "Copy link"}</span>}
    </Button>
  )
}
