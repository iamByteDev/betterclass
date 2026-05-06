"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const TABS = [
  { label: "General", segment: "general" },
  { label: "Members", segment: "members" },
  { label: "Invitations", segment: "invitations" },
] as const

export function SchoolTabs({ baseHref }: { baseHref: string }) {
  const pathname = usePathname()

  return (
    <div className="border-b border-border">
      <nav className="flex">
        {TABS.map(({ label, segment }) => {
          const href = `${baseHref}/${segment}`
          const isActive = pathname.startsWith(href)

          return (
            <Link
              key={segment}
              href={href}
              className={cn(
                "relative flex items-center px-3 py-2.5 text-xs font-medium",
                "transition-colors duration-150",
                "after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:rounded-t-full",
                "after:bg-foreground after:transition-opacity after:duration-200",
                isActive
                  ? "text-foreground after:opacity-100"
                  : "text-muted-foreground after:opacity-0 hover:text-foreground/80"
              )}
            >
              {label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
