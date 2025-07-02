"use client";

import { EventInterface } from "@/interfaces";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreVertical, Trash } from "lucide-react";
import { cn, toTitleCase } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Box, Heading, Text } from "@radix-ui/themes";
import { Badge } from "@/components/ui/badge";

export const columns = (): ColumnDef<EventInterface>[] => {
  return [
    {
      accessorKey: "title",
      header: "Event Title",
      cell: ({ row }) => {
        return (
          <Box>
            <Heading as="h1" size={"3"}>
              (<Text>{toTitleCase(row.original.type)}</Text>) -{" "}
              {row.original.title}
            </Heading>
            <Badge>{row.original.status}</Badge>
          </Box>
        );
      },
    },
    {
      accessorKey: "category.name",
      header: "Category Type",
    },
    {
      accessorKey: "start_datetime",
      header: "Date Time",
      cell: ({ row }) => {
        const { start_datetime, end_datetime } = row.original;
        return `${format(start_datetime, "d MMM y HH:mm")} - ${format(
          end_datetime,
          "d MMM y HH:mm"
        )}`;
      },
    },
    {
      accessorKey: "registration_start",
      header: "Register Time",
      cell: ({ row }) => {
        const { registration_start, registration_end } = row.original;
        return `${format(registration_start, "d MMM y HH:mm")} - ${format(
          registration_end,
          "d MMM y HH:mm"
        )}`;
      },
    },
    {
      accessorKey: "id",
      header: "",
      cell: ({ row }) => {
        const { id } = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(buttonVariants({ variant: "ghost" }))}
            >
              <MoreVertical />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Edit />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Trash />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
