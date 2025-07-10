"use client";

import {
  handleDelete,
  handleGetEvent,
  handleUpdateStatus,
} from "@/actions/event";
import AppTitle from "@/components/app-title";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  CANCELLED,
  COMPLETED,
  DRAFT,
  EVENT_STATUS_ARRAY,
  EVENT_TYPE_OBJECT,
  PUBLISHED,
} from "@/constants";
import { APP_LINK } from "@/constants/link_constant";
import { EventInterface, TicketTypeInterface } from "@/interfaces";
import { cn, confirmDelete, formatRupiah, getImageUrl } from "@/lib/utils";
import { Box, Flex, Grid, Heading, Text } from "@radix-ui/themes";
import { format } from "date-fns";
import {
  BarChart4,
  Calendar,
  ChartLine,
  Check,
  CheckCircle,
  ChevronLeft,
  Edit,
  Info,
  MapPin,
  MoreVerticalIcon,
  Plus,
  Ticket,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toastError, toastSuccess } from "@/lib/toast";
import { handleGetTickets } from "@/actions/ticket";

export default function Page() {
  const router = useRouter();
  const { uid } = useParams();
  const [event, setEvent] = useState<EventInterface>();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTicket, setIsLoadingTicket] = useState(false);
  const [location, setLocation] = useState("");
  const [tickets, setTickets] = useState<TicketTypeInterface[]>([]);

  const getStatusInfo = (status: number) => {
    return (
      EVENT_STATUS_ARRAY.find((s) => s.key === status) || EVENT_STATUS_ARRAY[0]
    );
  };

  const onGetEvent = async () => {
    setIsLoading(true);

    try {
      const response = (await handleGetEvent(uid as string)) as EventInterface;

      setEvent(response);
      setLocation(
        response.type === EVENT_TYPE_OBJECT.HYBRID
          ? `${response.venue_name} and Virtual Event`
          : response.type === EVENT_TYPE_OBJECT.OFFLINE
          ? response.venue_name
          : "Virtual Event"
      );
    } catch (error) {
      router.back();
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
        toastSuccess(response.success.message);
        router.push(APP_LINK.DASHBOARD.EVENT.DEFAULT);
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

  const onGetEventTicket = async () => {
    setIsLoadingTicket(true);

    try {
      const response = await handleGetTickets({
        event_id: event?.id || "",
      });

      setTickets(response);
    } catch (error: any) {
    } finally {
      setIsLoadingTicket(false);
    }
  };

  const onUpdateStatus = async (status: number) => {
    const formData = new FormData();
    formData.append("status", status.toString());

    try {
      const response = await handleUpdateStatus(formData, event?.slug!);

      if (response.success?.status) {
        toastSuccess(response.success.message);
        onGetEvent();
      }

      if (response.error) {
        toastError(response.error.message);
      }
    } catch (error: any) {
    } finally {
    }
  };

  useEffect(() => {
    onGetEvent();
  }, []);

  useEffect(() => {
    onGetEventTicket();
  }, [event]);

  return (
    <div>
      <AppTitle
        title={event?.title!}
        description="Event Details & Ticket Management"
      >
        <Link
          className={buttonVariants({ size: "sm", variant: "outline" })}
          href={APP_LINK.DASHBOARD.EVENT.DEFAULT}
        >
          <ChevronLeft /> Back
        </Link>
      </AppTitle>

      <Grid columns={"3"} gap={"3"}>
        <Box className="col-span-3 lg:col-span-2 space-y-3">
          <Card className="shadow-xs">
            <CardHeader>
              <Flex gap={"3"}>
                <Flex gap={"3"} className="w-full">
                  <Box>
                    <img
                      src={getImageUrl(event?.banner_image!)}
                      className="rounded-lg object-cover aspect-square max-w-16 max-h-16 bg-accent"
                    />
                  </Box>
                  <Grid gap={"2"}>
                    <Heading
                      className="leading-none font-semibold line-clamp-1"
                      size={"4"}
                    >
                      {event?.title}
                    </Heading>
                    <Flex align={"center"} gap={"2"}>
                      <Badge variant={"default"} className="capitalize">
                        {event?.type}
                      </Badge>
                      <Badge variant={"secondary"}>100 Attendees</Badge>
                    </Flex>
                  </Grid>
                </Flex>
                <Flex align={"center"} gap={"2"}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className={cn(getStatusInfo(event?.status!).color)}
                        disabled={[COMPLETED, CANCELLED].includes(
                          event?.status!
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
                          onClick={() => onUpdateStatus(status.key)}
                          disabled={event?.total_order! > 0 && status.key === 1}
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
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      <MoreVerticalIcon />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {COMPLETED !== event?.status! && (
                        <>
                          <DropdownMenuItem asChild>
                            <Link
                              href={APP_LINK.DASHBOARD.EVENT.EDIT.replace(
                                ":uid",
                                event?.slug!
                              )}
                            >
                              <Edit /> Edit Event
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDelete(event?.slug || "")}
                          >
                            <Trash /> Delete
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuItem>
                        <CheckCircle /> Mark as Completed
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Flex>
              </Flex>
            </CardHeader>
            <CardContent className="space-y-5">
              <Grid columns={{ initial: "1", lg: "2" }} gap={"3"}>
                <Flex align={"center"} gap={"3"}>
                  <Calendar size={20} />
                  <Grid>
                    <Label className="font-light">Event Date</Label>
                    <Tooltip>
                      <TooltipTrigger className="line-clamp-1 font-bold text-left">
                        {format(event?.start_datetime || new Date(), "PPP")} -{" "}
                        {format(event?.end_datetime || new Date(), "PPP")}
                      </TooltipTrigger>
                      <TooltipContent>
                        {format(event?.start_datetime || new Date(), "PPP")} -{" "}
                        {format(event?.end_datetime || new Date(), "PPP")}
                      </TooltipContent>
                    </Tooltip>
                  </Grid>
                </Flex>
                <Flex align={"center"} gap={"3"}>
                  <MapPin size={20} />
                  <Grid>
                    <Label className="font-light">Event Location</Label>
                    <Tooltip>
                      <TooltipTrigger className="line-clamp-1 font-bold text-left capitalize">
                        {location}
                      </TooltipTrigger>
                      <TooltipContent>{location}</TooltipContent>
                    </Tooltip>
                  </Grid>
                </Flex>
              </Grid>

              {event?.tags && event.tags.length > 0 && (
                <Grid gap={"3"}>
                  <Label>Tags</Label>
                  <Flex wrap={"wrap"} gap={"2"}>
                    {event?.tags?.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant={"secondary"}
                        className="capitalize"
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </Flex>
                </Grid>
              )}

              <Grid gap={"1"}>
                <Label>Description</Label>
                <Text>{event?.description}</Text>
              </Grid>
            </CardContent>
          </Card>
          <Card className="shadow-xs">
            <CardContent>
              <Flex align={"center"} justify={"between"} gap={"3"}>
                <Flex align={"center"} gap={"3"}>
                  <Ticket className="text-indigo-500" />
                  <CardTitle>Ticket Management</CardTitle>
                </Flex>
                <Box>
                  {[DRAFT, PUBLISHED].includes(event?.status!) && (
                    <Link
                      className={buttonVariants({
                        size: "sm",
                        variant: "primary",
                      })}
                      href={APP_LINK.DASHBOARD.EVENT.TICKET.CREATE.replace(
                        ":uid",
                        event?.slug!
                      )}
                    >
                      <Plus /> Add Ticket
                    </Link>
                  )}
                </Box>
              </Flex>
            </CardContent>
          </Card>

          {tickets.map((ticket) => (
            <TicketType
              key={ticket.id}
              ticket={ticket}
              status={event?.status!}
            />
          ))}
        </Box>
        <Box className="col-span-3 lg:col-span-1 space-y-3">
          <Card className="shadow-xs">
            <CardHeader>
              <Flex align={"center"} gap={"3"}>
                <Info className="text-indigo-500" />
                <CardTitle>Other Informations</CardTitle>
              </Flex>
            </CardHeader>

            {[EVENT_TYPE_OBJECT.ONLINE, EVENT_TYPE_OBJECT.HYBRID].includes(
              event?.type!
            ) && <OnlineInformation event={event!} />}
            {[EVENT_TYPE_OBJECT.OFFLINE, EVENT_TYPE_OBJECT.HYBRID].includes(
              event?.type!
            ) && <OfflineInformation event={event!} />}
            <CardFooter className="flex-col items-start">
              <Box className="mb-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl w-full">
                <Flex align={"center"} gap={"3"} className="mb-2">
                  {React.createElement(getStatusInfo(event?.status || 0).icon, {
                    className: "w-5 h-5 text-gray-600",
                  })}
                  <Text className="font-semibold text-gray-900">
                    Current: {getStatusInfo(event?.status || 0).value}
                  </Text>
                </Flex>
                <Text className="text-sm text-gray-600">
                  {getStatusInfo(event?.status || 0).description}
                </Text>
              </Box>
            </CardFooter>
          </Card>

          <Card className="shadow-xs">
            <CardHeader>
              <Flex align={"center"} gap={"3"}>
                <BarChart4 className="text-indigo-500" />
                <CardTitle>Quick Stats</CardTitle>
              </Flex>
            </CardHeader>
            <CardContent className="space-y-5">
              <Grid>
                <Label className="font-light">Total Tickets</Label>
                <Text weight={"bold"} className="capitalize">
                  {tickets.reduce((sum, ticket) => sum + ticket.quantity, 0)}
                </Text>
              </Grid>
              <Grid>
                <Label className="font-light">Active Tickets</Label>
                <Text weight={"bold"} className="capitalize">
                  {tickets.filter((ticket) => ticket.is_active).length}
                </Text>
              </Grid>
              <Grid>
                <Label className="font-light">Sold Ticket</Label>
                <Text weight={"bold"} className="capitalize">
                  {tickets.reduce(
                    (sum, ticket) => sum + ticket.sold_quantity,
                    0
                  )}
                </Text>
              </Grid>
              <Grid>
                <Label className="font-light">Price Range</Label>
                <Text weight={"bold"} className="capitalize">
                  {formatRupiah(
                    Math.min(...tickets.map((t) => parseInt(t.price)))
                  )}{" "}
                  -{" "}
                  {formatRupiah(
                    Math.max(...tickets.map((t) => parseInt(t.price)))
                  )}
                </Text>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Grid>
    </div>
  );
}

function OnlineInformation({ event }: { event: EventInterface }) {
  return (
    <CardContent className="space-y-5">
      <Grid>
        <Label className="font-light">Platform</Label>
        <Text weight={"bold"} className="capitalize">
          {event.online_platform}
        </Text>
      </Grid>
      <Grid>
        <Label className="font-light">Meeting Link</Label>
        <Text weight={"bold"} className="capitalize">
          <Link href={event.online_link} target="_blank">
            {event.online_link}
          </Link>
        </Text>
      </Grid>
    </CardContent>
  );
}

function OfflineInformation({ event }: { event: EventInterface }) {
  return (
    <CardContent className="space-y-5">
      <Grid>
        <Label className="font-light">Venue Province</Label>
        <Text weight={"bold"} className="capitalize">
          {event.venue_province}
        </Text>
      </Grid>
      <Grid>
        <Label className="font-light">Venue City</Label>
        <Text weight={"bold"} className="capitalize">
          {event.venue_city}
        </Text>
      </Grid>
      <Grid>
        <Label className="font-light">Venue Address</Label>
        <Text weight={"bold"} className="capitalize">
          {event.venue_address}
        </Text>
      </Grid>
    </CardContent>
  );
}

function TicketType({
  ticket,
  status,
}: {
  ticket: TicketTypeInterface;
  status: number;
}) {
  return (
    <Card className="shadow-xs group">
      <CardHeader>
        <Flex align={{ initial: "start", md: "center" }} justify={"between"}>
          <Grid gap={"3"}>
            <Flex gap={"3"} direction={{ initial: "column", md: "row" }}>
              <Flex gap={"3"} align={"center"}>
                <CardTitle>{ticket.name}</CardTitle>
                <Badge variant={ticket.is_active ? "green" : "destructive"}>
                  {ticket.is_active ? "Active" : "Inactive"}
                </Badge>
              </Flex>
              <Heading className="text-indigo-600" size={"5"}>
                {formatRupiah(parseInt(ticket.price))}
              </Heading>
            </Flex>
          </Grid>
          <Box>
            {[PUBLISHED, DRAFT].includes(status) &&
              ticket.sold_quantity < 1 && (
                <Link
                  href={APP_LINK.DASHBOARD.EVENT.TICKET.EDIT.replace(
                    ":uid",
                    ticket.event.slug
                  ).replace(":ticket_uid", ticket.id.toString())}
                  className={cn(
                    buttonVariants({
                      variant: "ghost",
                    }),
                    "opacity-100 md:opacity-0 group-hover:opacity-100"
                  )}
                >
                  <Edit />
                </Link>
              )}
          </Box>
        </Flex>
      </CardHeader>
      <CardContent className="space-y-5">
        <CardDescription>{ticket.description}</CardDescription>
        <Grid columns={{ initial: "2", md: "4" }} gap={"3"}>
          <Grid>
            <Label className="font-light">Quantity</Label>
            <Text weight={"bold"} className="capitalize">
              {ticket.quantity}
            </Text>
          </Grid>
          <Grid>
            <Label className="font-light">Min Purchase</Label>
            <Text weight={"bold"} className="capitalize">
              {ticket.min_purchase}
            </Text>
          </Grid>
          <Grid>
            <Label className="font-light">Max Purchase</Label>
            <Text weight={"bold"} className="capitalize">
              {ticket.max_purchase}
            </Text>
          </Grid>
          <Grid>
            <Label className="font-light">Sale</Label>
            <Text weight={"bold"} className="capitalize">
              {ticket.sold_quantity}
            </Text>
          </Grid>
        </Grid>

        <Grid columns={{ initial: "1", md: "2" }} gap={"3"}>
          <Grid>
            <Label className="font-light">Sale Start</Label>
            <Text weight={"bold"} className="capitalize">
              {format(ticket.sale_start, "d MMM y HH:mm")}
            </Text>
          </Grid>
          <Grid>
            <Label className="font-light">Sale End</Label>
            <Text weight={"bold"} className="capitalize">
              {format(ticket.sale_end, "d MMM y HH:mm")}
            </Text>
          </Grid>
        </Grid>
      </CardContent>
      <CardFooter>
        <Grid gap={"1"}>
          <Label className="font-light">Benefits</Label>
          <Flex gap={"2"}>
            {JSON.parse(ticket.benefits).map(
              (benefit: string, index: number) => (
                <Badge key={index}>{benefit}</Badge>
              )
            )}
          </Flex>
        </Grid>
      </CardFooter>
    </Card>
  );
}
