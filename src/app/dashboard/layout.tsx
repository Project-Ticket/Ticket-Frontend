"use client";
import { AppSidebar } from "@/components/app-sidebar";
import AppTitle from "@/components/app-title";
import { NavUser } from "@/components/nav-user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Grid } from "@radix-ui/themes";
import { Bell, TrendingUp } from "lucide-react";
import { useCallback, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useIsMobile();

  useCallback(() => {
    setSidebarOpen(!sidebarOpen ? true : !isMobile);
  }, [isMobile]);

  return (
    <SidebarProvider className="bg-[#f6f8fd]">
      <header className="bg-white border-b px-6 py-4 flex gap-10 fixed top-0 z-10 w-full">
        <div className="max-w-[215px] w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              </div>
            </div>
            <span className="font-bold text-lg text-gray-900">Eventio</span>
          </div>
          <SidebarTrigger onClick={() => setSidebarOpen(!sidebarOpen)} />
        </div>
        <div className="flex items-center justify-end w-full">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <Bell className="w-5 h-5" />
            </Button>
            <NavUser
              user={{
                email: "F7oFt@example.com",
                name: "John Doe",
                avatar: "https://github.com/shadcn.png",
              }}
            />
          </div>
        </div>
      </header>
      <AppSidebar className="top-[95px] bg-white ml-3.5" />
      <SidebarInset
        className={cn(
          "p-4 pt-24 bg-[#f6f8fd]",
          !isMobile && sidebarOpen ? "pl-[286px]" : "md:pl-[77px]"
        )}
      >
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
