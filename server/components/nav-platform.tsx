"use client"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { SchoolIcon, ShapesIcon } from "lucide-react"
import Link from "next/link"

interface NavItem {
  title: string
  url: string
  icon?: React.ReactNode
}

export function NavPlatform() {
  const items: NavItem[] = [
    {
      title: "Classes",
      url: "/app",
      icon: <ShapesIcon />,
    },
    {
      title: "Schools",
      url: "/app/schools",
      icon: <SchoolIcon />,
    },
  ]

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton render={<Link href={item.url} />}>
              {item.icon}
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
