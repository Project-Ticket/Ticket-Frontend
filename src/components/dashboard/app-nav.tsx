"use client";

import { Box, Flex, Text } from "@radix-ui/themes";
import { menuItems } from "./app-menu";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export default function AppNav({
  mobileMenuOpen,
  onMobileMenuOpen,
  className,
}: {
  mobileMenuOpen: boolean;
  onMobileMenuOpen: (mobileMenuOpen: boolean) => void;
  className?: string;
}) {
  const $pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <>
      <nav className={cn("hidden lg:block px-4 sm:px-6 lg:px-8", className)}>
        <Box className="mx-auto ">
          <Flex align={"center"} className="h-12 space-x-4">
            {menuItems().map((item: any) => (
              <Box
                position={"relative"}
                key={item.id}
                onClick={() =>
                  setActiveDropdown(activeDropdown === item.id ? null : item.id)
                }
              >
                {item.path ? (
                  <Link
                    href={item.path}
                    className={cn(
                      "flex items-center text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors p-2 rounded-lg",
                      item.path == $pathname
                        ? "bg-indigo-100 text-indigo-800 font-bold"
                        : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-800 font-normal"
                    )}
                  >
                    <Text className="flex-shrink-0 !mr-2">{item.icon}</Text>
                    {item.label}
                  </Link>
                ) : (
                  <button className="flex items-center pe-3 py-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors cursor-pointer">
                    <Text className="flex-shrink-0 !mr-2">{item.icon}</Text>
                    {item.label}
                    <ChevronDown size={16} className="ml-1" />
                  </button>
                )}

                {item.children && activeDropdown === item.id && (
                  <Box
                    position={"absolute"}
                    left={"0"}
                    className="mt-1 w-48 rounded-md bg-white py-1 shadow-lg ring-black/5 ring-1"
                  >
                    {item.children.map((child: any) => (
                      <Link
                        key={child.id}
                        href={child.path}
                        className="block px-4 py-2 text-sm text-gray-600 hover:bg-indigo-100 hover:text-indigo-800"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </Box>
                )}
              </Box>
            ))}
          </Flex>
        </Box>
      </nav>

      {mobileMenuOpen && (
        <Box display={{ lg: "none" }} className={className}>
          <Box className="border-b bg-white">
            <Box className="mx-auto px-4 sm:px-6">
              <Box className="space-y-1 py-2">
                {menuItems().map((item: any) => (
                  <Box key={item.id}>
                    {item.path ? (
                      <Link
                        href={item.path}
                        className="flex items-center px-3 py-2 text-base font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-md"
                        onClick={() => onMobileMenuOpen(false)}
                      >
                        <span className="flex-shrink-0 mr-3">{item.icon}</span>
                        {item.label}
                      </Link>
                    ) : (
                      <>
                        <button
                          className="flex items-center justify-between w-full px-3 py-2 text-base font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-md"
                          onClick={() =>
                            setActiveDropdown(
                              activeDropdown === item.id ? null : item.id
                            )
                          }
                        >
                          <Flex align={"center"} gap={"3"}>
                            <Text className="flex-shrink-0 mr-3">
                              {item.icon}
                            </Text>
                            {item.label}
                          </Flex>
                          <ChevronDown
                            size={16}
                            className={`transform transition-transform ${
                              activeDropdown === item.id ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {item.children && activeDropdown === item.id && (
                          <Box className="mt-1 space-y-1 pl-10">
                            {item.children.map((child: any) => (
                              <Link
                                key={child.id}
                                href={child.path}
                                className="block py-2 text-sm text-gray-500 hover:text-indigo-600"
                                onClick={() => onMobileMenuOpen(false)}
                              >
                                {child.label}
                              </Link>
                            ))}
                          </Box>
                        )}
                      </>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}
