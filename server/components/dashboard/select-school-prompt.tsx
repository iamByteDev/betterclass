"use client"

import { SchoolIcon } from "lucide-react"
import { motion } from "motion/react"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"

export function SelectSchoolPrompt() {
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
              <SchoolIcon className="size-6" />
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
            <EmptyTitle>Select a school</EmptyTitle>
            <EmptyDescription>
              Choose a school from the sidebar to continue.
            </EmptyDescription>
          </motion.div>
        </EmptyHeader>
      </Empty>
    </motion.div>
  )
}
