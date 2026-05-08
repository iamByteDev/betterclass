import { DashboardHeader } from "@/components/dashboard/header"
import { SchoolSelected } from "@/components/dashboard/school-selected"
import { SidebarWrapper } from "@/components/dashboard/sidebar-wrapper"
import { ClassList } from "@/components/dashboard/class-list"

export default function Page() {
  return (
    <SidebarWrapper>
      <DashboardHeader breadcrumbs={[{ label: "Classes" }]} />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <SchoolSelected>
          <ClassList />
        </SchoolSelected>
      </div>
    </SidebarWrapper>
  )
}
