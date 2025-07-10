"use client";

import {
  handleDelete,
  handleGetEvents,
  handleUpdateStatus,
} from "@/actions/event";
import AppTitle from "@/components/app-title";
import { DataTable } from "@/components/data-table";
import { Button, buttonVariants } from "@/components/ui/button";
import { APP_LINK } from "@/constants/link_constant";
import { EventInterface } from "@/interfaces";
import { Box, Flex, Grid, Text } from "@radix-ui/themes";
import {
  Calendar,
  ChartLine,
  Edit,
  Filter,
  MapPin,
  MoreVertical,
  Plus,
  Tag,
  Ticket,
  Trash,
  Users,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, confirmDelete, getImageUrl } from "@/lib/utils";
import { format } from "date-fns";
import {
  CANCELLED,
  COMPLETED,
  EVENT_STATUS_ARRAY,
  EVENT_TYPE_OBJECT,
} from "@/constants";
import { toastError, toastSuccess } from "@/lib/toast";
import { LoaderCard } from "@/components/skeleton";
import DataNotFound from "@/components/data-not-found";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Page() {
  const [events, setEvents] = useState<EventInterface[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const isMobile = useIsMobile();

  const getStatusInfo = (status: number) => {
    return (
      EVENT_STATUS_ARRAY.find((s) => s.key === status) || EVENT_STATUS_ARRAY[0]
    );
  };

  const onGetEvents = async () => {
    setIsLoading(true);

    try {
      const response = await handleGetEvents();

      setEvents(response);
    } catch (error: any) {
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async (slug: string) => {
    const confirmed = await confirmDelete();

    if (!confirmed) return;

    setIsLoading(true);

    try {
      const response = await handleDelete(slug);

      if (response.success.status) {
        onGetEvents();
        toastSuccess(response.success.message);
      }

      if (response.error) {
        toastError(response.error.message);
      }
    } catch (error: any) {
      toastError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onUpdateStatus = async (status: number, event: EventInterface) => {
    const formData = new FormData();
    formData.append("status", status.toString());

    try {
      const response = await handleUpdateStatus(formData, event?.slug!);

      if (response.success?.status) {
        toastSuccess(response.success.message);
        onGetEvents();
      }

      if (response.error) {
        toastError(response.error.message);
      }
    } catch (error: any) {
    } finally {
    }
  };

  useEffect(() => {
    onGetEvents();
  }, []);

  return (
    <div>
      <AppTitle title="All Events">
        <Flex gap={"3"}>
          {!isMobile && (
            <>
              <div>
                <Input
                  placeholder="Search..."
                  className="shadow bg-white dark:bg-background"
                />
              </div>

              <Button
                variant={"outline"}
                className="shadow"
                onClick={() => setShowFilter(true)}
              >
                <Filter />
              </Button>
            </>
          )}

          <Link
            href={APP_LINK.DASHBOARD.EVENT.CREATE}
            className={buttonVariants({
              variant: "primary",
              className: "shadow",
            })}
          >
            <Plus /> Add new event
          </Link>
        </Flex>
      </AppTitle>

      {isMobile && (
        <Flex gap={"3"} justify={"end"} className="mb-7">
          <div className="w-full">
            <Input
              placeholder="Search..."
              className="shadow bg-white dark:bg-background"
            />
          </div>

          <Button
            variant={"outline"}
            className="shadow"
            onClick={() => setShowFilter(true)}
          >
            <Filter />
          </Button>
        </Flex>
      )}

      {isLoading ? (
        <LoaderCard count={4} />
      ) : !isLoading && events.length === 0 ? (
        <DataNotFound />
      ) : (
        <Grid columns={{ initial: "1", md: "2", lg: "3", xl: "4" }} gap={"5"}>
          {events.map((event, index) => (
            <Card key={index}>
              <CardContent>
                <Grid gap={"3"}>
                  <Flex gap={"3"}>
                    <Box>
                      <img
                        src={getImageUrl(event.banner_image)}
                        className="rounded-lg object-cover aspect-square max-w-16 max-h-16 bg-accent"
                      />
                    </Box>
                    <Grid gap={"3"}>
                      <CardTitle className="leading-6 line-clamp-2 capitalize">
                        {event.title}
                      </CardTitle>
                      <Box>
                        <Flex align={"center"} gap={"2"}>
                          <Badge variant={"secondary"} className="capitalize">
                            {event.type}
                          </Badge>
                          <Badge
                            className={cn(getStatusInfo(event?.status!).color)}
                          >
                            {getStatusInfo(event?.status!).value}
                          </Badge>
                        </Flex>
                      </Box>
                    </Grid>
                  </Flex>
                  <Grid gap={"3"}>
                    <Flex align={"center"} gap={"2"}>
                      <Calendar size={"15"} />
                      <Text size={"2"}>
                        {format(event.start_datetime, "PP")} -{" "}
                        {format(event.end_datetime, "PP")}
                      </Text>
                    </Flex>
                    <Flex align={"center"} gap={"2"}>
                      <MapPin size={"15"} />
                      <Text size={"2"} className="line-clamp-1 capitalize">
                        {event.type === EVENT_TYPE_OBJECT.HYBRID
                          ? `${event.venue_name} and Virtual Event`
                          : event.type === EVENT_TYPE_OBJECT.OFFLINE
                          ? event.venue_name
                          : "Virtual Event"}
                      </Text>
                    </Flex>

                    <Flex align={"center"} gap={"2"}>
                      <Tag size={"15"} />
                      <Text size={"2"} className="capitalize">
                        {event.tags?.map((tag) => tag.name).join(", ")}
                      </Text>
                    </Flex>
                    <Flex align={"center"} gap={"2"}>
                      <Users size={"15"} />
                      <Text size={"2"} className="capitalize">
                        100 Attendees
                      </Text>
                    </Flex>
                  </Grid>
                </Grid>
              </CardContent>
              <CardFooter>
                <Flex gap={"3"} className="w-full" justify={"end"}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className={cn(getStatusInfo(event?.status!).color)}
                        disabled={[COMPLETED, CANCELLED].includes(
                          event?.status
                        )}
                      >
                        {React.createElement(
                          getStatusInfo(event?.status!).icon,
                          {
                            className: "w-8 h-8 text-white",
                          }
                        )}
                        {getStatusInfo(event?.status!).value}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {EVENT_STATUS_ARRAY.map((status) => (
                        <DropdownMenuItem
                          key={status.key}
                          onClick={() => onUpdateStatus(status.key, event)}
                          disabled={event.total_order! > 0 && status.key === 1}
                        >
                          {React.createElement(getStatusInfo(status.key).icon, {
                            className: "w-8 h-8",
                          })}
                          {status.value}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className={cn(buttonVariants({ variant: "secondary" }))}
                    >
                      <MoreVertical />
                      Actions
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem asChild>
                        <Link
                          href={APP_LINK.DASHBOARD.EVENT.SHOW.replace(
                            ":uid",
                            event.slug
                          )}
                        >
                          <Ticket /> Detail
                        </Link>
                      </DropdownMenuItem>
                      {COMPLETED !== event?.status! && (
                        <>
                          <DropdownMenuItem asChild>
                            <Link
                              href={APP_LINK.DASHBOARD.EVENT.EDIT.replace(
                                ":uid",
                                event.slug
                              )}
                            >
                              <Edit /> Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDelete(event.slug)}
                          >
                            <Trash /> Delete
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Flex>
              </CardFooter>
            </Card>
          ))}
        </Grid>
      )}

      <Sheet open={showFilter} onOpenChange={setShowFilter}>
        <SheetContent onInteractOutside={(e) => e.preventDefault()}>
          <SheetHeader>
            <SheetTitle>Are you absolutely sure?</SheetTitle>
            <SheetDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}
