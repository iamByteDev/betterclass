"use client"

import { AppSidebar } from "@/components/app-sidebar"
import {
  SIDEBAR_COOKIE_NAME,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import * as React from "react"

const NO_SIDEBAR_PATHS = ["/app/classroom"]

function getSidebarDefaultOpen() {
  if (typeof document === "undefined") {
    return true
  }

  const sidebarCookie = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${SIDEBAR_COOKIE_NAME}=`))

  if (!sidebarCookie) {
    return true
  }

  return sidebarCookie.split("=")[1] === "true"
}

function InternalSidebarWrapper({ children }: { children: React.ReactNode }) {
  const [defaultOpen] = React.useState(getSidebarDefaultOpen)

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}

export function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const shouldShowSidebar = !NO_SIDEBAR_PATHS.some((path) =>
    pathname.toLowerCase().startsWith(path.toLowerCase())
  )

  if (!shouldShowSidebar) {
    return children
  }
  return <InternalSidebarWrapper>{children}</InternalSidebarWrapper>
}
