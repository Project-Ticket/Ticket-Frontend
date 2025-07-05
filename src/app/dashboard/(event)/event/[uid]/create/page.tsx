"use client";

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
import {
  ticketTypeSchema,
  TicketTypeSchema,
} from "@/validations/ticket_validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Flex, Grid } from "@radix-ui/themes";
import {
  Calendar,
  ChevronLeft,
  DollarSign,
  InfoIcon,
  Minus,
  Plus,
  Settings,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

export default function Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<TicketTypeSchema>({
    resolver: zodResolver(ticketTypeSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      quantity: 1,
      min_purchase: 1,
      max_purchase: 1,
      sale_start: undefined,
      sale_end: undefined,
      is_active: true,
      benefits: [{ value: "" }],
    },
  });

  const { control } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "benefits",
  });

  const onHandleSubmit = async (data: TicketTypeSchema) => {};

  return (
    <Box>
      <AppTitle
        title="Create Ticket"
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
                              />
                            )}
                          />
                        </FormControl>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => remove(index)}
                            variant={"destructive"}
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
          </Grid>
        </form>
      </Form>
    </Box>
  );
}
