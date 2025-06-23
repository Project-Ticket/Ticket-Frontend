import { Box, Flex, Heading, Text } from "@radix-ui/themes";
import { ChevronUp, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { usePathname } from "next/navigation";

export default function MenuPage({
  menuItems,
  currentTab,
}: {
  menuItems: any;
  currentTab: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const $pathname = usePathname();

  return (
    <>
      <Accordion
        type="single"
        collapsible
        className="rounded-lg lg:block hidden bg-white px-3 py-1 shadow-xs"
      >
        {menuItems.map((item: any, i: number) => {
          return (
            <AccordionItem key={i} value={`item-${item.path}`} className="py-2">
              <Link
                href={item.path}
                className={cn(
                  "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-2 px-3 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180",
                  $pathname == item.path &&
                    "bg-indigo-100  text-indigo-800 font-bold"
                )}
              >
                <Flex gap={"3"}>
                  <item.icon className="h-5 w-5" />
                  <Text>{item.title}</Text>
                </Flex>
              </Link>
            </AccordionItem>
          );
        })}
      </Accordion>

      <Box className={"p-3 !flex lg:!hidden justify-between items-center"}>
        <Heading className="!text-xl">
          {menuItems.find(
            (item: any) => item.path.split("/").pop() == currentTab
          )?.title || "Account Settings"}
        </Heading>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={"cursor-pointer text-indigo-800"}
        >
          {isOpen ? (
            <ChevronUp className={"h-6 w-6"} />
          ) : (
            <Menu className={"h-6 w-6"} />
          )}
        </button>
      </Box>
      <Box
        className={cn(
          "bg-white w-full sm:w-auto sm:min-w-[240px] shadow-sm rounded-lg"
        )}
        display={{ initial: isOpen ? "block" : "none" }}
        overflow={"hidden"}
      >
        <ul>
          {menuItems.map((item: any, i: number) => {
            return (
              <li key={i}>
                <Link
                  href={item.path}
                  className={cn(
                    "w-full flex items-center py-2 px-3 hover:bg-gray-50 transition-colors cursor-pointer",
                    currentTab == item.path.split("/").pop()
                      ? "bg-indigo-100 text-indigo-800 font-medium"
                      : ""
                  )}
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <Box className={"mr-3"}>
                    <item.icon className="h-5 w-5" />
                  </Box>
                  <Text>{item.title}</Text>
                </Link>
              </li>
            );
          })}
        </ul>
      </Box>
    </>
  );
}
