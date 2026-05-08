import { EnsureSession } from "@/components/auth/ensure-session"
import { SidebarWrapper } from "@/components/dashboard/sidebar-wrapper"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <EnsureSession>
      <SidebarWrapper>{children}</SidebarWrapper>
    </EnsureSession>
  )
}
