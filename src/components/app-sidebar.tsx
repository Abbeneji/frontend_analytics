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

import Image from "next/image"

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
            <Image
  src="/logo.png"        // name of the PNG in /public
  alt="JetBeat Logo"
  width={40}             // adjust size as needed
  height={40}
  className="ml-2 rounded-md"   // optional styling
/>
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
