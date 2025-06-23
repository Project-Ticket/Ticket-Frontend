import { useIsMobile } from "@/hooks/use-mobile";
import { Container, Flex } from "@radix-ui/themes";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export const MENU_NAV_LANDING = [
  { name: "Home", href: "/" },
  { name: "All Events", href: "/vendor" },
  { name: "All Merchandise", href: "/vendor" },
];

export default function Navigation() {
  const isMobile = useIsMobile();

  return (
    !isMobile && (
      <nav className="bg-white border-b border-gray-200 hidden md:block">
        <Container className="mx-auto px-4 sm:px-6 lg:px-8">
          <Flex justify={"between"} className="h-14">
            <Flex
              display={{ initial: "none", sm: "flex" }}
              className="space-x-8"
            >
              {MENU_NAV_LANDING.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="inline-flex items-center h-full px-1 pt-1 text-sm font-medium text-gray-700 hover:text-rose-600 hover:border-b-2 hover:border-rose-500 transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ))}
            </Flex>
          </Flex>
        </Container>
      </nav>
    )
  );
}
