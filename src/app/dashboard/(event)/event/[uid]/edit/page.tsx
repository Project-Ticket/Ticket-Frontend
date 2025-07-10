"use client";

import { handleGetEvent } from "@/actions/event";
import { handleCreate, handleGetTicket, handleUpdate } from "@/actions/ticket";
import AppTitle from "@/components/app-title";
import DateTimePicker from "@/components/datetime-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { APP_LINK } from "@/constants/link_constant";
import { EventInterface, TicketTypeInterface } from "@/interfaces";
import { toastError, toastSuccess } from "@/lib/toast";
import { formatRupiah } from "@/lib/utils";
import {
  ticketTypeSchema,
  TicketTypeSchema,
} from "@/validations/ticket_validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Flex, Grid } from "@radix-ui/themes";
import { format } from "date-fns";
import {
  Calendar,
  ChevronLeft,
  DollarSign,
  InfoIcon,
  Loader,
  Minus,
  Plus,
  Send,
  Settings,
  Users,
} from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

export default function Page() {
  const router = useRouter();
  const { uid } = useParams();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [event, setEvent] = useState<EventInterface>();
  const [ticket, setTicket] = useState<TicketTypeInterface>();

  const form = useForm<TicketTypeSchema>({
    resolver: zodResolver(ticketTypeSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      quantity: 1,
      min_purchase: 1,
      max_purchase: 1,
      sale_start: new Date(),
      sale_end: new Date(),
      is_active: true,
      benefits: [],
    },
  });

  const { control } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "benefits",
  });

  const onHandleSubmit = async (data: TicketTypeSchema) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("quantity", data.quantity.toString());
    formData.append("min_purchase", data.min_purchase.toString());
    formData.append("max_purchase", data.max_purchase.toString());
    formData.append(
      "sale_start",
      format(data.sale_start, "yyyy-MM-dd HH:mm:ss")
    );
    formData.append("sale_end", format(data.sale_end, "yyyy-MM-dd HH:mm:ss"));
    formData.append("is_active", data.is_active ? "1" : "0");

    if (data.benefits && data.benefits.length > 0) {
      data.benefits.forEach((benefit: any, index: number) => {
        formData.append(`benefits[${index}]`, benefit.value);
      });
    }

    formData.append("event_id", event?.id.toString() || "");

    try {
      const response = await handleUpdate(ticket?.id || 0, formData);

      if (response.success?.status) {
        router.push(
          APP_LINK.DASHBOARD.EVENT.SHOW.replace(":uid", uid as string)
        );
        toastSuccess(response.success.message);
      }

      if (response.error) {
        toastError(response.error.message);

        if (response.error.data) {
          Object.entries(response.error.data).forEach(([key, messages]) => {
            form.setError(key as keyof TicketTypeSchema, {
              type: "server",
              message: (messages as string[])[0],
            });
          });
        }
      }
    } catch (error) {
      toastError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onGetTicket = async () => {
    setIsLoading(true);

    try {
      const response = await handleGetTicket(
        parseInt(searchParams.get("ticket_uid") as string)
      );

      setTicket(response);

      form.setValue("name", response.name);
      form.setValue("description", response.description);
      form.setValue("price", parseInt(response.price).toString());
      form.setValue("quantity", response.quantity);
      form.setValue("min_purchase", response.min_purchase);
      form.setValue("max_purchase", response.max_purchase);
      form.setValue("sale_start", new Date(response.sale_start));
      form.setValue("sale_end", new Date(response.sale_end));
      form.setValue("is_active", response.is_active === 1 ? true : false);

      JSON.parse(response.benefits).forEach((benefit: any) => {
        append({ value: benefit });
      });
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const onGetEvent = async () => {
    setIsLoading(true);

    try {
      const response = (await handleGetEvent(uid as string)) as EventInterface;

      setEvent(response);
    } catch (error) {
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    onGetEvent();
  }, []);

  useEffect(() => {
    if (event) {
      onGetTicket();
    }
  }, [event]);

  return (
    <Box>
      <AppTitle
        title="Edit Ticket"
        description="Configure ticket pricing and availability"
      >
        <Button size={"sm"} variant={"outline"} onClick={() => router.back()}>
          <ChevronLeft /> Back
        </Button>
      </AppTitle>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onHandleSubmit)}>
          <Grid gap={"5"}>
            <Card className="shadow-xs">
              <CardHeader>
                <Flex gap={"3"} align={"center"}>
                  <InfoIcon className="text-indigo-500" />
                  <CardTitle>Basic Information</CardTitle>
                </Flex>
              </CardHeader>
              <CardContent>
                <Grid gap={"4"}>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ticket Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., VIP Pass, Regular Ticket"
                            {...field}
                            autoComplete={field.name}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Describe what's included with this ticket type..."
                            autoComplete={field.name}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Grid>
              </CardContent>
            </Card>

            <Card className="shadow-xs">
              <CardHeader>
                <Flex gap={"3"} align={"center"}>
                  <DollarSign className="text-indigo-500" />
                  <CardTitle>Pricing & Quantity</CardTitle>
                </Flex>
              </CardHeader>
              <CardContent>
                <Grid gap={"4"} columns={{ initial: "1", sm: "2", md: "4" }}>
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            pattern="[0-9]*"
                            {...field}
                            autoComplete={field.name}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            autoComplete={field.name}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="min_purchase"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min. Purchase</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            autoComplete={field.name}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="max_purchase"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max. Purchase</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            autoComplete={field.name}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Grid>
              </CardContent>
            </Card>

            <Card className="shadow-xs">
              <CardHeader>
                <Flex gap={"3"} align={"center"}>
                  <Calendar className="text-indigo-500" />
                  <CardTitle>Sale Period</CardTitle>
                </Flex>
              </CardHeader>
              <CardContent>
                <Grid gap={"4"}>
                  <FormField
                    control={form.control}
                    name="sale_start"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sale Start</FormLabel>
                        <FormControl>
                          <DateTimePicker
                            disabled={isLoading}
                            value={field.value || new Date()}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sale_end"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sale End</FormLabel>
                        <FormControl>
                          <DateTimePicker
                            disabled={isLoading}
                            value={field.value || new Date()}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Grid>
              </CardContent>
            </Card>

            <Card className="shadow-xs">
              <CardHeader>
                <Flex gap={"3"} align={"center"}>
                  <Users className="text-indigo-500" />
                  <CardTitle>Benefits</CardTitle>
                </Flex>
              </CardHeader>
              <CardContent>
                <Grid gap={"4"}>
                  {fields.map((field, index) => (
                    <FormItem key={field.id}>
                      <Flex gap={"3"}>
                        <FormControl>
                          <Controller
                            control={control}
                            name={`benefits.${index}.value`}
                            render={({ field }) => (
                              <Input
                                type="text"
                                {...field}
                                autoComplete="off"
                                placeholder="Enter a benefit"
                                disabled={isLoading}
                              />
                            )}
                          />
                        </FormControl>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => remove(index)}
                            variant={"destructive"}
                            disabled={isLoading}
                          >
                            <Minus />
                          </Button>
                        )}
                      </Flex>
                      <FormMessage />
                    </FormItem>
                  ))}
                </Grid>
                <Button
                  type="button"
                  onClick={() => append({ value: "" })}
                  className="mt-4"
                  disabled={isLoading}
                >
                  <Plus /> Add Benefit
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-xs">
              <CardHeader>
                <Flex gap={"3"} align={"center"}>
                  <Settings className="text-indigo-500" />
                  <CardTitle>Settings</CardTitle>
                </Flex>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex items-center ">
                      <FormControl>
                        <Checkbox
                          id={field.name}
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            return field.onChange(!!checked);
                          }}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormLabel htmlFor={field.name}>
                        Active (ticket is available for purchase)
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Flex justify={"end"}>
              <Button disabled={isLoading} variant={"primary"}>
                {isLoading ? <Loader className="animate-spin" /> : <Send />}
                Send
              </Button>
            </Flex>
          </Grid>
        </form>
      </Form>
    </Box>
  );
}
