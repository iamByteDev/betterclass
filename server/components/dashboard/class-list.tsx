"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { authClient } from "@/lib/auth-client"
import { motion } from "motion/react"
import Link from "next/link"
import { BookOpenIcon } from "lucide-react"
import { Card, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { ClassCardActions } from "./class-card-actions"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { CreateClassDialog } from "./create-class-dialog"

const AVATAR_COLORS = [
  "bg-blue-500/15 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
  "bg-violet-500/15 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300",
  "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  "bg-orange-500/15 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300",
  "bg-pink-500/15 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300",
  "bg-cyan-500/15 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300",
]

function getAvatarColor(id: string) {
  const hash = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return AVATAR_COLORS[hash % AVATAR_COLORS.length]
}

export function ClassList() {
  const activeOrg = authClient.useActiveOrganization()
  const classes = useQuery(
    api.classes.listClasses,
    activeOrg.data ? { organizationId: activeOrg.data.id } : "skip"
  )

  if (activeOrg.isPending || classes === undefined) {
    return (
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-xl" />
        ))}
      </div>
    )
  }

  const orgId = activeOrg.data!.id

  if (classes.length === 0) {
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
              <EmptyTitle>No classes yet</EmptyTitle>
              <EmptyDescription>
                Create your first class to get started.
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
              <CreateClassDialog organizationId={orgId} />
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
          {classes.length} {classes.length === 1 ? "class" : "classes"}
        </p>
        <CreateClassDialog organizationId={orgId} />
      </div>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        {classes.map((cls, i) => (
          <motion.div
            key={cls._id}
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.2,
              delay: i * 0.05,
              ease: [0.23, 1, 0.32, 1],
            }}
          >
            <Link
              href={`/app/classroom/${cls._id}`}
              className="block transition-transform duration-160 ease-out active:scale-[0.99]"
            >
              <Card className="transition-shadow duration-200 hover:shadow-md">
                <CardHeader>
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex size-8 shrink-0 items-center justify-center rounded-md font-heading text-sm font-semibold ${getAvatarColor(cls._id)}`}
                    >
                      {cls.name.charAt(0).toUpperCase()}
                    </div>
                    <CardTitle className="truncate">{cls.name}</CardTitle>
                  </div>
                  <CardAction>
                    <ClassCardActions classId={cls._id} className={cls.name} />
                  </CardAction>
                </CardHeader>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
