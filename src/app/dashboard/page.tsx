"use client";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, Envelope, User } from "phosphor-react";
import {
  Bell,
  DownloadCloud,
  Grid,
  Menu,
  PanelLeftClose,
  Search,
} from "lucide-react";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const sidebarItems = [
    { icon: User, label: "My Profile", section: "GENERAL" },
    { icon: BookOpen, label: "Classroom", section: "GENERAL" },
    {
      icon: Envelope,
      label: "Transactions",
      section: "GENERAL",
      active: true,
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      PENDING: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      PAID: "bg-green-100 text-green-800 hover:bg-green-100",
    };
    return variants[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <>
      <header className="bg-white border-b px-6 py-4 flex">
        <div className="max-w-[255px] w-full">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2"
          >
            {sidebarOpen ? (
              <PanelLeftClose className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </Button>
          <Envelope size={24} weight="duotone" />
        </div>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search your subject or student"
                  className="pl-10 w-80 bg-gray-50 border-0"
                />
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <span>GO</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <Grid className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <Bell className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className="text-sm font-medium">Shen Waaini</div>
                <div className="text-xs text-gray-500">Student</div>
              </div>
              <Avatar className="w-8 h-8">
                <AvatarImage src="/api/placeholder/32/32" />
                <AvatarFallback>SW</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>
      <div className="min-h-screen bg-gray-50 flex">
        <div
          className={cn(
            "transition-all duration-300 overflow-hidden bg-white shadow-sm border-r flex flex-col",
            sidebarOpen ? "w-64" : "w-0"
          )}
        >
          <div className="flex-1 p-4 space-y-6">
            <div>
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                GENERAL
              </h3>
              <div className="space-y-1">
                {sidebarItems
                  .filter((item) => item.section === "GENERAL")
                  .map((item: any, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                        item.active
                          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <item.icon className="w-5 h-5" weight="duotone" />
                      <span className="text-sm font-medium">{item.label}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <main className="flex-1 p-6">
            <div className="max-w-6xl mx-auto">
              {/* Page Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    My Tuition Transactions
                  </h1>
                  <p className="text-gray-600 mt-1">
                    View Your Transactions Details
                  </p>
                </div>
                <Button variant="outline" className="gap-2">
                  <DownloadCloud className="w-4 h-4" />
                  Import .CSV
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
