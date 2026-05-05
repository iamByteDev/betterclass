"use client"

import { EnsureNoSession } from "@/components/auth/ensure-no-session"
import { motion } from "motion/react"
import Link from "next/link"

export default function Home() {
  const words = ["Hello.", "Welcome", "to", "BetterClass."]

  return (
    <EnsureNoSession allowAuthenticatedWithParam={["from", "dashboard"]}>
      <div className="flex min-h-screen flex-col items-center justify-center gap-8">
        <div className="flex flex-wrap items-center justify-center gap-3 text-5xl font-semibold tracking-tight md:text-6xl lg:text-7xl">
          {words.map((word, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.3,
                ease: "easeOut",
              }}
              className={word === "BetterClass." ? "text-primary" : ""}
            >
              {word}
            </motion.span>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: words.length * 0.3 + 0.2,
            ease: "easeOut",
          }}
        >
          <Link
            href="/app"
            className="text-xl underline underline-offset-4 transition-colors hover:text-muted-foreground"
          >
            Go to Dashboard
          </Link>
        </motion.div>
      </div>
    </EnsureNoSession>
  )
}
