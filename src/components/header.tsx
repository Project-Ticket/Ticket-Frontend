"use client";

import { useEffect, useState } from "react";
import { APP_LINK } from "@/constants/link_constant";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import SearchBar from "./search-bar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Box, Container, Flex } from "@radix-ui/themes";
import { deleteCookie, getCookie } from "cookies-next";
import { APPROVED, TOKEN_SETTING, VERIFIED } from "@/constants";
import {
  BadgeDollarSign,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  Ticket,
  X,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MENU_NAV_LANDING } from "./navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { sidebarMenuButtonVariants } from "./ui/sidebar";
import { UserInterface } from "@/interfaces";
import { handleLogout } from "@/actions/auth";

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const isMobile = useIsMobile();
  const [user, setUser] = useState<UserInterface>();

  const onLogout = async () => {
    await handleLogout();
    deleteCookie(TOKEN_SETTING.USER);
    setIsAuthenticated(false);
    window.location.reload();
  };

  useEffect(() => {
    if (getCookie(TOKEN_SETTING.USER)) {
      setIsAuthenticated(true);

      const userCookie = JSON.parse(getCookie(TOKEN_SETTING.USER) as string);
      setUser(userCookie);

      setIsOrganizer(
        userCookie?.event_organizer_details &&
          userCookie?.event_organizer_details.application_status_organizer ===
            APPROVED &&
          userCookie?.event_organizer_details.verification_status_organizer ===
            VERIFIED
      );
    }
  }, []);

  return (
    <header className="bg-white py-4 px-4 md:px-6 lg:px-8 shadow-xs sticky top-0 z-10">
      <Container>
        <Flex
          direction={{ initial: "row" }}
          align={"center"}
          justify={"between"}
          gap={"4"}
          className="mx-auto"
        >
          <Flex align={"center"} gap={"4"}>
            <Link
              href={APP_LINK.HOME}
              className="text-3xl font-serif font-bold text-indigo-600 hover:text-indigo-700 transition-colors duration-300"
            >
              Event.io
            </Link>
            <Button variant={"secondary"} className="lg:hidden block">
              <Search />
            </Button>
          </Flex>

          {!isMobile && (
            <>
              <Box className="w-full md:w-auto flex-1 max-w-xl">
                <SearchBar placeholder="Cari vendor pernikahan..." />
              </Box>
              <div className="md:flex hidden items-center gap-4">
                <AuthMenu
                  onLogout={onLogout}
                  isAuthenticated={isAuthenticated}
                  isMobile={isMobile}
                  user={user}
                  isOrganizer={isOrganizer}
                />
              </div>
            </>
          )}

          <Flex align={"center"} display={{ initial: "flex", sm: "none" }}>
            <Button variant={"secondary"} onClick={() => setIsOpen(!isOpen)}>
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </Flex>
        </Flex>
      </Container>

      {isOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {MENU_NAV_LANDING.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block hover:pl-3 py-2 border-l-4 border-transparent text-base font-medium text-gray-700 hover:bg-gray-50 hover:border-rose-300 hover:text-rose-600 transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href={"item.href"}
              className="block hover:pl-3 py-2 border-l-4 border-transparent text-base font-medium text-gray-700 hover:bg-gray-50 hover:border-rose-300 hover:text-rose-600 transition-colors duration-200"
            >
              Are you event organizer?
            </Link>

            <AuthMenu
              onLogout={onLogout}
              isAuthenticated={isAuthenticated}
              isMobile={isMobile}
              user={user}
            />
          </div>
        </div>
      )}
    </header>
  );
}

function AuthMenu({
  isAuthenticated,
  isMobile,
  user,
  onLogout,
  isOrganizer,
}: {
  isAuthenticated: boolean;
  isMobile: boolean;
  user?: UserInterface;
  onLogout?: () => void;
  isOrganizer?: boolean;
}) {
  const menu = [
    {
      title: "My Dashboard",
      href: APP_LINK.DASHBOARD.DEFAULT,
      icon: LayoutDashboard,
      type: "link",
      show: isOrganizer,
    },
    {
      title: "My Transactions",
      href: "/dashboard",
      icon: BadgeDollarSign,
      type: "link",
      show: true,
    },
    {
      title: "My Tickets",
      href: "/dashboard",
      icon: Ticket,
      type: "link",
      show: true,
    },
    {
      title: "My Settings",
      href: APP_LINK.SETTINGS.DEFAULT,
      icon: Settings,
      type: "link",
      show: true,
    },
  ];

  return (
    <>
      {isAuthenticated ? (
        <>
          {!isMobile && !isOrganizer && (
            <Link
              href={APP_LINK.VENDOR.REGISTER}
              className="text-sm font-medium text-gray-700"
            >
              Are you event organizer?
            </Link>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={sidebarMenuButtonVariants({
                  size: "sm",
                  className: "cursor-pointer",
                })}
              >
                <Avatar className="h-7 w-7 rounded-lg">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.name}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={"bottom"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user?.address} alt={user?.name} />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user?.name}</span>
                    <span className="truncate text-xs">{user?.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {menu.map(
                  (item, index) =>
                    item.show && (
                      <DropdownMenuItem key={index} asChild>
                        <Link href={item.href}>
                          <item.icon />
                          {item.title}
                        </Link>
                      </DropdownMenuItem>
                    )
                )}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout}>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <Flex
          gap="2"
          align={{ sm: "center" }}
          direction={{ initial: "column", sm: "row" }}
        >
          {!isMobile && isAuthenticated && !isOrganizer && (
            <Link
              href={APP_LINK.VENDOR.REGISTER}
              className="text-sm font-medium text-gray-700"
            >
              Are you event organizer?
            </Link>
          )}
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
        </Flex>
      )}
    </>
  );
}
