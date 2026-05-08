"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { authClient } from "@/lib/auth-client"
import { motion } from "motion/react"
import { BookOpenIcon } from "lucide-react"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { CreateClassroomDialog } from "./create-classroom-dialog"
import { ClassroomCard } from "@/components/dashboard/classroom-card"

export function ClassroomList() {
  const activeOrg = authClient.useActiveOrganization()
  const classrooms = useQuery(
    api.classrooms.listClassrooms,
    activeOrg.data ? { organizationId: activeOrg.data.id } : "skip"
  )

  if (activeOrg.isPending || classrooms === undefined) {
    return (
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-xl" />
        ))}
      </div>
    )
  }

  const orgId = activeOrg.data!.id

  if (classrooms.length === 0) {
    return (
      <motion.div
        className="flex flex-1"
        initial={{ opacity: 0, scale: 0.97, y: 6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
      >
        <Empty className="border border-dashed border-border">
          <EmptyHeader>
            <EmptyMedia>
              <motion.div
                className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground"
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 0.25,
                  delay: 0.07,
                  ease: [0.23, 1, 0.32, 1],
                }}
              >
                <BookOpenIcon className="size-6" />
              </motion.div>
            </EmptyMedia>
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.2,
                delay: 0.1,
                ease: [0.23, 1, 0.32, 1],
              }}
              className="flex flex-col items-center gap-1"
            >
              <EmptyTitle>No classrooms yet</EmptyTitle>
              <EmptyDescription>
                Create your first classroom to get started.
              </EmptyDescription>
            </motion.div>
          </EmptyHeader>
          <EmptyContent>
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.2,
                delay: 0.15,
                ease: [0.23, 1, 0.32, 1],
              }}
            >
              <CreateClassroomDialog organizationId={orgId} />
            </motion.div>
          </EmptyContent>
        </Empty>
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {classrooms.length}{" "}
          {classrooms.length === 1 ? "classroom" : "classrooms"}
        </p>
        <CreateClassroomDialog organizationId={orgId} />
      </div>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        {classrooms.map((room, i) => (
          <ClassroomCard key={room._id} room={room} index={i} />
        ))}
      </div>
    </div>
  )
}
