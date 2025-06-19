import { Container, Flex } from "@radix-ui/themes";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const navItems = [
    { name: "Home", href: "/" },
    { name: "All Events", href: "/vendor" },
    { name: "All Merchandise", href: "/vendor" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <Container className="mx-auto px-4 sm:px-6 lg:px-8">
        <Flex justify={"between"} className="h-14">
          <Flex display={{ initial: "none", md: "flex" }} className="space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="inline-flex items-center h-full px-1 pt-1 text-sm font-medium text-gray-700 hover:text-rose-600 hover:border-b-2 hover:border-rose-500 transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </Flex>

          <Flex align={"center"} display={{ initial: "flex", md: "none" }}>
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rose-500"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </Flex>
        </Flex>
      </Container>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-700 hover:bg-gray-50 hover:border-rose-300 hover:text-rose-600 transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
