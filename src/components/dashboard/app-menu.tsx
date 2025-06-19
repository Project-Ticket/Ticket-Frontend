"use client";

import { APP_LINK } from "@/constants/link_constant";
import { cn } from "@/lib/utils";
import { Box, Flex, Text } from "@radix-ui/themes";
import { ChevronDown, ChartColumnBig } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppMenu({
  collapsed,
  expandedItems,
  handleExpanded,
}: {
  expandedItems: string[];
  collapsed: boolean;
  handleExpanded: (id: string) => void;
}) {
  const $pathname = usePathname();

  return (
    <ul className="space-y-2 px-3">
      {menuItems().map((item: any) => (
        <li key={item.id} className={cn("pb-2", item.separator && "border-b")}>
          {item.path ? (
            <Link
              href={item.path}
              className={cn(
                "flex items-center p-2 rounded-lg transition-all text-[14px]",
                item.path == $pathname
                  ? "bg-teal-100 text-teal-800 font-bold"
                  : "text-gray-600 hover:bg-teal-50 hover:text-teal-800 font-normal"
              )}
            >
              <Text className="flex-shrink-0">{item.icon}</Text>
              <Text
                className={cn(
                  "!ml-3 whitespace-nowrap",
                  collapsed ? "hidden" : "block"
                )}
              >
                {item.label}
              </Text>
            </Link>
          ) : (
            <Box>
              <button
                onClick={() => handleExpanded(item.id)}
                className={cn(
                  "w-full flex items-center justify-between p-2 rounded-lg transition-all",
                  item.id == "dashboard"
                    ? "bg-teal-100 text-teal-800"
                    : "text-gray-600 hover:bg-teal-50 hover:text-teal-800"
                )}
              >
                <Flex align={"center"}>
                  <Text className="flex-shrink-0">{item.icon}</Text>
                  <Text
                    className={cn(
                      "whitespace-nowrap !ml-3",
                      collapsed ? "hidden" : "block"
                    )}
                  >
                    {item.label}
                  </Text>
                </Flex>
                {item.children && item.children.length > 0 && !collapsed && (
                  <ChevronDown
                    size={16}
                    className={cn(
                      "transform transition-transform",
                      expandedItems.includes(item.id) ? "rotate-180" : ""
                    )}
                  />
                )}
              </button>
              {item.children &&
                item.children.length > 0 &&
                expandedItems.includes(item.id) &&
                !collapsed && (
                  <ul className="ml-9 mt-1 space-y-1">
                    {item.children.map((child: any) => (
                      <li key={child.id}>
                        <Link
                          href={child.path || "#"}
                          className={cn(
                            "block py-2 px-3 rounded-lg text-sm transition-all",
                            item.id == "dashboard"
                              ? "text-teal-800 bg-teal-100"
                              : "text-gray-600 hover:text-teal-800 hover:bg-teal-100"
                          )}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
            </Box>
          )}
        </li>
      ))}
    </ul>
  );
}

export const menuItems = () => {
  return [
    {
      id: "dashboard",
      label: "Dashboard",
      separator: false,
      icon: <ChartColumnBig size={20} />,
      path: APP_LINK.DASHBOARD,
    },
    {
      id: "organizer",
      label: "My Organizer",
      separator: false,
      icon: <ChartColumnBig size={20} />,
      path: APP_LINK.DASHBOARD,
    },
    {
      id: "events",
      label: "My Events",
      separator: false,
      icon: <ChartColumnBig size={20} />,
      path: APP_LINK.DASHBOARD,
    },
    {
      id: "events",
      label: "My Merchandising",
      separator: false,
      icon: <ChartColumnBig size={20} />,
      path: APP_LINK.DASHBOARD,
    },
  ];
};
