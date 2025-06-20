"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  CalendarDays,
  ChartColumnBig,
  Command,
  Frame,
  GalleryVerticalEnd,
  GitBranch,
  Map,
  PieChart,
  Settings2,
  ShoppingBag,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { APP_LINK } from "@/constants/link_constant";

const navMain = [
  {
    title: "",
    items: [
      {
        title: "Dashboard",
        url: APP_LINK.DASHBOARD,
        icon: ChartColumnBig,
        isActive: true,
      },
      {
        title: "My Organizer",
        url: APP_LINK.DASHBOARD,
        icon: GitBranch,
      },
      {
        title: "My Events",
        url: APP_LINK.DASHBOARD,
        icon: CalendarDays,
      },
      {
        title: "My Merchandise",
        url: APP_LINK.DASHBOARD,
        icon: ShoppingBag,
      },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        {navMain.map((section, index) => (
          <NavMain key={index} items={section.items} title={section.title} />
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
