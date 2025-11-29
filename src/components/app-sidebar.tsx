"use client"

import * as React from "react"
import {
  LayoutPanelLeft,
  LayoutDashboard,
  Mail,
  CheckSquare,
  MessageCircle,
  Calendar,
  Shield,
  AlertTriangle,
  Settings,
  HelpCircle,
  CreditCard,
  LayoutTemplate,
  Users,
  Search,
} from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { Atom } from 'lucide-react';
import { SidebarNotification } from "@/components/sidebar-notification"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Admin User",
    email: "user@admin.com",
    avatar: "",
  },
  navGroups: [
    {
      label: "Overviews",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard-2",
          icon: LayoutPanelLeft,
        },
        {
          title: "Live Dashboard",
          url: "/dashboard",
          icon: Users,
        },
      ],
    },
    {
      label: "Analysis",
      items: [
        {
          title: "Heatmap",
          url: "/heatmap",
          icon: LayoutTemplate,
        },
        {
          title: "Settings",
          url: "#",
          icon: Settings,
          items: [
            {
              title: "Notifications",
              url: "/settings/notifications",
            },
            {
              title: "Connections & API",
              url: "/settings/connections",
            },
          ],
        }
      ],
    },
    {
      label: "Support Pages",
      items: [
        {
          title: "Help Desk",
          url: "/faqs",
          icon: HelpCircle,
        },
        {
          title: "Search",
          url: "/pricing",
          icon: Search,
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
            <Link href="/dashboard-2">
            <Atom className="ml-2 !h-10 !w-10 text-white" /> {/* This replaces the text div with the icon */}
            <h1 className="text-2xl font-bold tracking-tight">JetBeat.io</h1>
          </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
  {data.navGroups
    .filter(group => group.label !== "Support Pages")
    .map(group => (
      <NavMain key={group.label} label={group.label} items={group.items} />
    ))}
</SidebarContent>
<SidebarFooter>
  {data.navGroups
    .filter(group => group.label === "Support Pages")
    .map(group => (
      <NavMain key={group.label} label={group.label} items={group.items} />
    ))}

  <NavUser user={data.user} />
</SidebarFooter>
    </Sidebar>
  )
}
