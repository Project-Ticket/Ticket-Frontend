"use client";

import AppTitle from "@/components/app-title";
import MenuPage from "@/components/menu-page";
import { APP_LINK } from "@/constants/link_constant";
import { Box, Grid } from "@radix-ui/themes";
import { File, GitBranch, Image, Map, Send } from "lucide-react";
import { usePathname } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export default function DashboardOrganizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentTab = pathname || APP_LINK.DASHBOARD.ORGANIZER.DEFAULT;
  const menuItems = [
    {
      icon: GitBranch,
      title: "Profile Organizer",
      path: APP_LINK.DASHBOARD.ORGANIZER.DEFAULT,
    },
    {
      icon: Map,
      title: "Address of Organizer",
      path: APP_LINK.DASHBOARD.ORGANIZER.ADDRESS,
    },
    {
      icon: Image,
      title: "Portfolio Organizer",
      path: APP_LINK.DASHBOARD.ORGANIZER.PORTFOLIO,
    },
    // {
    //   icon: File,
    //   title: "Document Organizer",
    //   path: APP_LINK.DASHBOARD.ORGANIZER.DOCUMENT,
    // },
  ];

  return (
    <Box>
      <AppTitle
        title={
          menuItems.find((item) => item.path == currentTab)?.title ||
          menuItems[0].title
        }
        className={"lg:block hidden"}
      />

      <Tabs defaultValue={currentTab}>
        <TabsList className="mb-3 overflow-x-auto max-w-sm md:max-w-full">
          {menuItems.map((item, i) => (
            <TabsTrigger value={item.path} key={i} asChild>
              <Link href={item.path}>
                {item.icon && <item.icon />}
                {item.title}
              </Link>
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={currentTab}>
          <Box>{children}</Box>
        </TabsContent>
      </Tabs>
    </Box>
  );
}
