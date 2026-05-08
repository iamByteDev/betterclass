import { DashboardHeader } from "@/components/dashboard/header"
import { SchoolSelected } from "@/components/dashboard/school-selected"
import { SidebarWrapper } from "@/components/dashboard/sidebar-wrapper"

export default function Page() {
  return (
    <SidebarWrapper>
      <DashboardHeader breadcrumbs={[{ label: "Classes" }]} />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <SchoolSelected>
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </SchoolSelected>
      </div>
    </SidebarWrapper>
  )
}
