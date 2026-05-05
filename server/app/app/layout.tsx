import { EnsureSession } from "@/components/auth/ensure-session"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <EnsureSession>{children}</EnsureSession>
}
