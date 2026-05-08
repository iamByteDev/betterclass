"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Lock,
  LockOpen,
  Monitor,
  MonitorOff,
  WifiOff,
  GraduationCap,
} from "lucide-react"
import Link from "next/link"

type StudentStatus = "online" | "offline" | "locked"

interface Student {
  id: string
  name: string
  status: StudentStatus
  screenshotHue?: number
}

const MOCK_STUDENTS: Student[] = [
  { id: "1", name: "Alice Johnson", status: "online", screenshotHue: 210 },
  { id: "2", name: "Bob Smith", status: "online", screenshotHue: 145 },
  { id: "3", name: "Carol White", status: "offline" },
  { id: "4", name: "David Lee", status: "online", screenshotHue: 30 },
  { id: "5", name: "Eva Martinez", status: "online", screenshotHue: 270 },
  { id: "6", name: "Frank Kim", status: "locked", screenshotHue: 190 },
  { id: "7", name: "Grace Chen", status: "online", screenshotHue: 350 },
  { id: "8", name: "Henry Park", status: "offline" },
  { id: "9", name: "Iris Thompson", status: "online", screenshotHue: 90 },
  { id: "10", name: "Jack Williams", status: "locked", screenshotHue: 50 },
  { id: "11", name: "Kate Brown", status: "online", screenshotHue: 180 },
  { id: "12", name: "Liam Davis", status: "online", screenshotHue: 310 },
  { id: "13", name: "Mia Wilson", status: "offline" },
  { id: "14", name: "Noah Garcia", status: "online", screenshotHue: 15 },
  { id: "15", name: "Olivia Moore", status: "online", screenshotHue: 240 },
  { id: "16", name: "Peter Taylor", status: "locked", screenshotHue: 120 },
  { id: "17", name: "Quinn Anderson", status: "online", screenshotHue: 75 },
  { id: "18", name: "Rachel Jackson", status: "offline" },
  { id: "19", name: "Sam Harris", status: "online", screenshotHue: 200 },
  { id: "20", name: "Tina Clark", status: "online", screenshotHue: 160 },
]

const onlineCount = MOCK_STUDENTS.filter((s) => s.status !== "offline").length
const totalCount = MOCK_STUDENTS.length

function ComputerTile({
  student,
  isGloballyLocked,
}: {
  student: Student
  isGloballyLocked: boolean
}) {
  const effectiveStatus: StudentStatus =
    isGloballyLocked && student.status !== "offline" ? "locked" : student.status
  const isOffline = effectiveStatus === "offline"
  const isLocked = effectiveStatus === "locked"

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow duration-150 hover:shadow-md"
      style={{ animationFillMode: "both" }}
    >
      {/* Screenshot area */}
      <div className="relative aspect-video w-full overflow-hidden bg-black">
        {isOffline ? (
          <div className="flex h-full w-full items-center justify-center bg-zinc-900">
            <WifiOff className="h-8 w-8 text-zinc-700" />
          </div>
        ) : (
          <>
            {/* Simulated screenshot with a gradient placeholder */}
            <div
              className="h-full w-full"
              style={{
                background: `
                  linear-gradient(
                    135deg,
                    hsl(${student.screenshotHue}, 25%, 18%) 0%,
                    hsl(${student.screenshotHue}, 30%, 12%) 40%,
                    hsl(${(student.screenshotHue ?? 0) + 40}, 20%, 15%) 100%
                  )
                `,
              }}
            >
              {/* Fake UI elements to simulate a desktop */}
              <div className="absolute inset-0 p-2 opacity-40">
                <div
                  className="mb-1.5 h-1.5 w-3/4 rounded-full"
                  style={{
                    background: `hsl(${student.screenshotHue}, 60%, 60%)`,
                  }}
                />
                <div
                  className="mb-1.5 h-1.5 w-1/2 rounded-full"
                  style={{
                    background: `hsl(${student.screenshotHue}, 40%, 50%)`,
                  }}
                />
                <div
                  className="mb-3 h-1.5 w-2/3 rounded-full"
                  style={{
                    background: `hsl(${student.screenshotHue}, 40%, 50%)`,
                  }}
                />
                <div
                  className="h-10 w-full rounded"
                  style={{
                    background: `hsl(${student.screenshotHue}, 20%, 22%)`,
                  }}
                />
              </div>
            </div>

            {/* Lock overlay */}
            {isLocked && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/75 backdrop-blur-[2px]">
                <Lock className="h-6 w-6 text-white/80" />
                <span className="text-xs font-medium text-white/60">
                  Locked
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Student info footer */}
      <div className="flex items-center justify-between border-t border-border px-2.5 py-2">
        <span className="truncate text-xs font-medium text-foreground">
          {student.name}
        </span>
        <StatusBadge status={effectiveStatus} />
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: StudentStatus }) {
  if (status === "offline") {
    return (
      <Badge
        variant="outline"
        className="border-zinc-300 text-zinc-400 dark:border-zinc-700 dark:text-zinc-500"
      >
        Offline
      </Badge>
    )
  }
  if (status === "locked") {
    return (
      <Badge className="bg-amber-500/15 text-amber-600 hover:bg-amber-500/15 dark:text-amber-400">
        Locked
      </Badge>
    )
  }
  return (
    <Badge className="bg-success/15 text-success">
      Online
    </Badge>
  )
}

export function ClassroomLayout() {
  const [isLocked, setIsLocked] = useState(false)
  const [isSharing, setIsSharing] = useState(false)

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Top bar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4">
        {/* Left: Branding + class info */}
        <div className="flex items-center gap-3">
          <Link href="/app">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
                <GraduationCap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-sm font-semibold text-foreground">
                BetterClass
              </span>
            </div>
          </Link>
          <div className="hidden h-4 w-px bg-border sm:block" />
          <span className="hidden text-sm text-muted-foreground sm:block">
            Period 3 — Computer Science
          </span>
          <Badge
            variant="outline"
            className="hidden text-xs text-muted-foreground sm:flex"
          >
            {onlineCount}/{totalCount} online
          </Badge>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Lock / Unlock */}
          {isLocked ? (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 border-amber-300 text-amber-600 hover:bg-amber-50 hover:text-amber-700 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-950"
                    onClick={() => setIsLocked(false)}
                  >
                    <LockOpen className="h-3.5 w-3.5" />
                    Unlock
                  </Button>
                }
              />
              <TooltipContent>
                <p>Unlock all computers</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => setIsLocked(true)}
                  >
                    <Lock className="h-3.5 w-3.5" />
                    Lock
                  </Button>
                }
              />
              <TooltipContent>
                <p>Lock all computers</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Share Screen / Stop Sharing */}
          {isSharing ? (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    size="sm"
                    className="text-destructive-foreground gap-1.5 bg-destructive hover:bg-destructive/90"
                    onClick={() => setIsSharing(false)}
                  >
                    <MonitorOff className="h-3.5 w-3.5" />
                    Stop Sharing
                  </Button>
                }
              />
              <TooltipContent>
                <p>Stop sharing your screen</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    size="sm"
                    className="gap-1.5"
                    onClick={() => setIsSharing(true)}
                  >
                    <Monitor className="h-3.5 w-3.5" />
                    Share Screen
                  </Button>
                }
              />
              <TooltipContent>
                <p>Share your screen with students</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </header>

      {/* Status bar when sharing */}
      {isSharing && (
        <div className="flex h-8 shrink-0 items-center justify-center gap-2 bg-primary/10 text-xs font-medium text-primary">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Broadcasting your screen to all students
        </div>
      )}

      {/* Grid */}
      <main className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
          {MOCK_STUDENTS.map((student) => (
            <ComputerTile
              key={student.id}
              student={student}
              isGloballyLocked={isLocked}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
