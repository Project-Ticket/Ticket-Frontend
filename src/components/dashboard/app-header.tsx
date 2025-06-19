"use client";

import { cn } from "@/lib/utils";
import { Box, Flex, Heading, Text } from "@radix-ui/themes";
import { Bell, LogOut, Menu, Search, User, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AppNav from "./app-nav";

export default function AppHeader() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className={cn("sticky top-0 z-40 bg-white shadow-sm")}>
      <Flex
        flexShrink={"0"}
        align={"center"}
        gapX={{ initial: "4", sm: "6" }}
        className="w-full h-16 border-b px-4 sm:px-6 lg:px-8"
      >
        <Flex gapX={{ initial: "4", lg: "6" }} className="flex-1 self-stretch">
          <Flex align={"center"} gapX={{ initial: "4", lg: "6" }}>
            <Heading>Sawer</Heading>
          </Flex>
        </Flex>

        <Flex align={"center"} gapX={{ initial: "4" }}>
          <button
            type="button"
            className="lg:hidden -m-2.5 p-2.5 text-gray-500 hover:text-gray-600 cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          <button
            type="button"
            className="lg:hidden -m-2.5 p-2.5 text-gray-400 hover:text-gray-500 cursor-pointer"
            onClick={() => router.push("/search")}
          >
            <Search className="h-6 w-6" />
          </button>

          <button
            type="button"
            className="relative -m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
          >
            <Flex
              position={"absolute"}
              align={"center"}
              justify={"center"}
              className="h-5 w-5 -top-1 -left-1 rounded-full bg-red-500 text-[11px] font-medium text-white"
            >
              5
            </Flex>
            <Bell className="h-6 w-6" />
          </button>

          <Box
            display={{ initial: "none", lg: "block" }}
            className="lg:h-6 lg:w-px lg:bg-gray-200"
            aria-hidden="true"
          />

          <Box position={"relative"}>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-x-2 rounded-full bg-white p-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 cursor-pointer">
                <img
                  className="h-8 w-8 rounded-full bg-gray-50"
                  src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auhref=compress&cs=tinysrgb&w=32"
                  alt=""
                />
                <Flex
                  display={{ initial: "none", lg: "flex" }}
                  align={{ lg: "center" }}
                >
                  <Text className="!ml-2 !text-sm !font-medium text-gray-900">
                    John Doe
                  </Text>
                </Flex>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => router.push("/panel/account-settings")}
                >
                  <User /> My Account
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <LogOut /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Box>
        </Flex>
      </Flex>

      <AppNav
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuOpen={(e: boolean) => setMobileMenuOpen(e)}
      />
    </header>
  );
}
