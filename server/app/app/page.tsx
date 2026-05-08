import { DashboardHeader } from "@/components/dashboard/header"
import { SchoolSelected } from "@/components/dashboard/school-selected"
import { SidebarWrapper } from "@/components/dashboard/sidebar-wrapper"
import { ClassroomList } from "@/components/dashboard/classroom-list"

export default function Page() {
  return (
    <SidebarWrapper>
      <DashboardHeader breadcrumbs={[{ label: "Classrooms" }]} />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <SchoolSelected>
          <ClassroomList />
        </SchoolSelected>
      </div>
    </SidebarWrapper>
  )
}
