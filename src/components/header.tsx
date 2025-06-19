"use client";

import { useEffect, useState } from "react";
import { APP_LINK } from "@/constants/link_constant";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import SearchBar from "./search-bar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Box, Container, Flex } from "@radix-ui/themes";
import { getCookie } from "cookies-next";
import { TOKEN_SETTING } from "@/constants";
import { LayoutDashboard, LogOut, User } from "lucide-react";

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (getCookie(TOKEN_SETTING.TOKEN)) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <header className="bg-white py-4 px-4 md:px-6 lg:px-8 shadow-xs sticky top-0 z-10">
      <Container>
        <Flex
          direction={{ initial: "column", md: "row" }}
          align={"center"}
          justify={"between"}
          gap={"4"}
          className="mx-auto"
        >
          <Flex align={"center"}>
            <Link
              href={APP_LINK.HOME}
              className="text-3xl font-serif font-bold text-rose-600 hover:text-rose-700 transition-colors duration-300"
            >
              Vowmate
            </Link>
          </Flex>

          <Box className="w-full md:w-auto flex-1 max-w-xl">
            <SearchBar placeholder="Cari vendor pernikahan..." />
          </Box>

          <Flex align={"center"} gap={"4"}>
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={buttonVariants({ variant: "ghost" })}
                >
                  <Flex gap="2" align={"center"}>
                    <img
                      src="https://images.unsplash.com/photo-1605379399642-870262d3d051?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
                      alt="Asep Saepullah"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="text-sm font-medium text-gray-700">
                      Halo, Asep Saepullah
                    </div>
                  </Flex>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <div className="text-sm font-medium text-gray-700">
                  Are you event organizer?
                </div>
                <Link
                  href={APP_LINK.AUTH.LOGIN}
                  className={buttonVariants({ variant: "primary" })}
                >
                  Login
                </Link>
                <Link
                  href={APP_LINK.AUTH.REGISTER}
                  className={buttonVariants({ variant: "outline" })}
                >
                  Register
                </Link>
              </>
            )}
          </Flex>
        </Flex>
      </Container>
    </header>
  );
}
