"use client"

import { motion } from "motion/react"
import Link from "next/link"

const EASE_OUT = [0.23, 1, 0.32, 1] as const

const items = [
  { delay: 0, content: "404" as const },
  { delay: 0.1, content: "label" as const },
  { delay: 0.18, content: "desc" as const },
  { delay: 0.26, content: "link" as const },
]

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      {/* Chalkboard */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_OUT, delay: items[0].delay }}
        className="relative flex flex-col items-center justify-center rounded-2xl border-4 border-border bg-card px-12 py-10 shadow-md"
        style={{ minWidth: 280 }}
      >
        {/* Chalk tray decoration */}
        <div className="absolute right-6 bottom-0 left-6 h-1 rounded-full bg-border opacity-60" />

        {/* Eraser smudge */}
        <div className="absolute top-5 right-6 h-5 w-10 rounded-sm bg-muted opacity-40 blur-sm" />

        {/* "Written on board" 404 */}
        <span
          className="font-mono text-[7rem] leading-none font-bold tracking-tight text-primary opacity-90 select-none"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          404
        </span>
      </motion.div>

      {/* Label */}
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE_OUT, delay: items[1].delay }}
        className="text-2xl font-semibold tracking-tight"
      >
        This page skipped class
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE_OUT, delay: items[2].delay }}
        className="max-w-xs text-center text-sm text-muted-foreground"
      >
        The page you&apos;re looking for has been marked absent. It may have
        been moved, deleted, or never existed.
      </motion.p>

      {/* Back link */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE_OUT, delay: items[3].delay }}
      >
        <Link
          href="/"
          className="text-sm underline underline-offset-4 transition-colors hover:text-muted-foreground"
        >
          Return to class
        </Link>
      </motion.div>
    </div>
  )
}
