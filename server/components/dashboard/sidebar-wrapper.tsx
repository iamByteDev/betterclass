"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"

const NO_SIDEBAR_PATHS = ["/app/classroom"]

export function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const shouldShowSidebar = !NO_SIDEBAR_PATHS.some((path) =>
    pathname.toLowerCase().startsWith(path.toLowerCase())
  )

  return (
    <SidebarProvider>
      {shouldShowSidebar && <AppSidebar />}
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
