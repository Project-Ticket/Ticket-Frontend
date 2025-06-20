"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { NavUser } from "@/components/nav-user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Bell } from "lucide-react";
import { useCallback, useState } from "react";

export default function Page() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useIsMobile();

  useCallback(() => {
    setSidebarOpen(!sidebarOpen ? true : !isMobile);
  }, [isMobile]);

  return (
    <SidebarProvider>
      <header className="bg-white border-b px-6 py-4 flex gap-10">
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
      <AppSidebar className="mt-[73px] bg-white border-r" />
      <SidebarInset
        className={cn(
          "p-4",
          !isMobile && sidebarOpen ? "pl-[272px]" : "md:pl-[63px]"
        )}
      >
        <div className="flex flex-1 flex-col gap-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
