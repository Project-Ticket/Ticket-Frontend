"use client";

import { handleCreate, handleGetCategory } from "@/actions/event";
import AppTitle from "@/components/app-title";
import TagsInput from "@/components/tags-input";
import TipTapEditor from "@/components/tiptapEditor";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { EVENT_TYPE_ARRAY } from "@/constants";
import { APP_LINK } from "@/constants/link_constant";
import { CategoryInterface } from "@/interfaces";
import { toastError, toastSuccess } from "@/lib/toast";
import { toTitleCase } from "@/lib/utils";
import {
  createEventGeneral,
  CreateEventGeneral,
} from "@/validations/event_validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Grid, Heading } from "@radix-ui/themes";
import { CalendarIcon, ChevronDownIcon, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";

export default function Page() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<CreateEventGeneral>({
    resolver: zodResolver(createEventGeneral),
    mode: "onTouched",
    defaultValues: {
      category: 1,
      title: "Title",
      description: "Description",
      terms_conditions: "Terms and conditions",
      type: "online",
      registration_start: new Date(),
      registration_end: new Date(),
      is_featured: false,
      tags: [],
      start_datetime: new Date(),
      end_datetime: new Date(),
    },
  });

  const onGetCategories = async () => {
    try {
      const response = await handleGetCategory();
      setCategories(response);
    } catch (error) {}
  };

  const onSubmit = form.handleSubmit(async (data) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("category", data.category.toString());
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("terms_conditions", data.terms_conditions);
    formData.append("type", data.type);
    formData.append("registration_start", data.registration_start.toString());
    formData.append("registration_end", data.registration_end.toString());
    formData.append("is_featured", data.is_featured.toString());
    for (let index = 0; index < data.tags.length; index++) {
      formData.append(`tags[${index}]`, data.tags[index]);
    }
    formData.append("start_datetime", data.start_datetime.toString());
    formData.append("end_datetime", data.end_datetime.toString());

    if (data.type === "offline") {
      formData.append("venue_name", data.venue_name!);
      formData.append("venue_address", data.venue_address!);
      formData.append("venue_latitude", data.venue_latitude!.toString());
      formData.append("venue_longitude", data.venue_longitude!.toString());
      formData.append("venue_city", data.venue_city!.toString());
      formData.append("venue_province", data.venue_province!.toString());
      formData.append("min_age", data.min_age!.toString());
      formData.append("max_age", data.max_age!.toString());
    }

    if (data.type === "online") {
      formData.append("link", data.link!);
      formData.append("platform", data.platform!);
    }

    try {
      const response = await handleCreate(formData);
      console.log(response);

      if (response.success?.status) {
        toastSuccess(response.success.message);
        form.reset();
        router.push(APP_LINK.DASHBOARD.EVENT.DEFAULT);
      }

      if (response.error) {
        if (response.error.data) {
          Object.entries(response.error.data).forEach(([key, messages]) => {
            form.setError(key as keyof CreateEventGeneral, {
              type: "server",
              message: (messages as string[])[0],
            });
          });
        }
        toastError(response.error.message);
      }
    } catch (error) {
      toastError(error);
    } finally {
      setIsLoading(false);
    }
  });

  const eventType = form.watch("type");

  useEffect(() => {
    if (eventType) {
      form.trigger();
    }
  }, [eventType, form]);

  useEffect(() => {
    onGetCategories();
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <AppTitle title="Create new event">
          <Link
            href={APP_LINK.DASHBOARD.EVENT.DEFAULT}
            className={buttonVariants({ variant: "outline" })}
          >
            <ChevronLeft /> Back
          </Link>
        </AppTitle>

        <DetailEventForm categories={categories} />

        {["offline", "hybrid"].includes(form.watch("type")) && (
          <EventOfflineForm />
        )}
        {["online", "hybrid"].includes(form.watch("type")) && (
          <EventOnlineForm />
        )}

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

function DetailEventForm({ categories }: { categories: CategoryInterface[] }) {
  const form = useFormContext<CreateEventGeneral>();

  return (
    <Grid columns={"12"} className="mb-5">
      <Box className="col-span-12 md:col-span-3 md:!block !hidden">
        <Heading size={"4"} weight={"medium"}>
          Detail Event
        </Heading>
      </Box>
      <Card className="col-span-12 md:col-span-9">
        <CardHeader className="md:hidden block">
          <CardTitle>Detail Event</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <Box>
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{toTitleCase(field.name)}</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        // Clear conditional fields when type changes
                        const currentType = form.getValues("type");
                        if (currentType !== value) {
                          // Clear offline fields if switching away from offline/hybrid
                          if (!["offline", "hybrid"].includes(value)) {
                            form.setValue("venue_name", undefined);
                            form.setValue("venue_address", undefined);
                            form.setValue("venue_city", undefined);
                            form.setValue("venue_province", undefined);
                            form.setValue("venue_latitude", undefined);
                            form.setValue("venue_longitude", undefined);
                            form.setValue("min_age", undefined);
                            form.setValue("max_age", undefined);
                            form.setValue("galleries", undefined);
                          }
                          // Clear online fields if switching away from online/hybrid
                          if (!["online", "hybrid"].includes(value)) {
                            form.setValue("platform", undefined);
                            form.setValue("link", undefined);
                          }
                        }
                      }}
                      value={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {EVENT_TYPE_ARRAY.map((type, index) => (
                          <SelectItem value={type.key} key={index}>
                            {type.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Box>
          <Box>
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{toTitleCase(field.name)}</FormLabel>
                  <FormControl>
                    <Select onValueChange={(e) => field.onChange(Number(e))}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category, index) => (
                          <SelectItem
                            value={category.id.toString()}
                            key={index}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Box>
          <Box>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{toTitleCase(field.name)}</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full shadow-none"
                      placeholder="Title of the event"
                      {...field}
                      autoComplete={field.name}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Box>
          <Box>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{toTitleCase(field.name)}</FormLabel>
                  <FormControl>
                    <Textarea
                      className="w-full shadow-none"
                      placeholder="Description of the event"
                      {...field}
                      autoComplete={field.name}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Box>
          <Box>
            <FormField
              control={form.control}
              name="terms_conditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{toTitleCase(field.name)}</FormLabel>
                  <FormControl>
                    <TipTapEditor setContent={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Box>
          <Box>
            <FormField
              control={form.control}
              name="banner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{toTitleCase(field.name)}</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      className="w-full shadow-none"
                      onChange={(e) => field.onChange(e.target.files![0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Box>
          <Box>
            <FormField
              control={form.control}
              name="registration_start"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{toTitleCase(field.name)}</FormLabel>
                  <FormControl>
                    <div className="flex gap-4">
                      <div className="flex flex-col gap-3 w-full">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              id="date-picker"
                              className="justify-between font-normal"
                            >
                              {field.value
                                ? field.value.toLocaleDateString()
                                : "Select date"}
                              <ChevronDownIcon />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto overflow-hidden p-0"
                            align="start"
                          >
                            <Calendar
                              mode="single"
                              selected={field.value}
                              captionLayout="dropdown"
                              onSelect={field.onChange}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="flex flex-col gap-3 w-full">
                        <Input
                          type="time"
                          id="time-picker"
                          step="1"
                          defaultValue="10:30:00"
                          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Box>
          <Box>
            <FormField
              control={form.control}
              name="registration_end"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{toTitleCase(field.name)}</FormLabel>
                  <FormControl>
                    <div className="flex gap-4">
                      <div className="flex flex-col gap-3 w-full">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              id="date-picker"
                              className="justify-between font-normal"
                            >
                              {field.value
                                ? field.value.toLocaleDateString()
                                : "Select date"}
                              <ChevronDownIcon />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto overflow-hidden p-0"
                            align="start"
                          >
                            <Calendar
                              mode="single"
                              selected={field.value}
                              captionLayout="dropdown"
                              onSelect={field.onChange}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="flex flex-col gap-3 w-full">
                        <Input
                          type="time"
                          id="time-picker"
                          step="1"
                          defaultValue="10:30:00"
                          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Box>

          <Box>
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{toTitleCase(field.name)}</FormLabel>
                  <FormControl>
                    <TagsInput initialTags={[]} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Box>

          <Box>
            <FormField
              control={form.control}
              name="start_datetime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{toTitleCase(field.name)}</FormLabel>
                  <FormControl>
                    <div className="flex gap-4">
                      <div className="flex flex-col gap-3 w-full">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              id="date-picker"
                              className="justify-between font-normal"
                            >
                              {field.value
                                ? field.value.toLocaleDateString()
                                : "Select date"}
                              <ChevronDownIcon />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto overflow-hidden p-0"
                            align="start"
                          >
                            <Calendar
                              mode="single"
                              selected={field.value}
                              captionLayout="dropdown"
                              onSelect={field.onChange}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="flex flex-col gap-3 w-full">
                        <Input
                          type="time"
                          id="time-picker"
                          step="1"
                          defaultValue="10:30:00"
                          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Box>

          <Box>
            <FormField
              control={form.control}
              name="end_datetime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{toTitleCase(field.name)}</FormLabel>
                  <FormControl>
                    <div className="flex gap-4">
                      <div className="flex flex-col gap-3 w-full">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              id="date-picker"
                              className="justify-between font-normal"
                            >
                              {field.value
                                ? field.value.toLocaleDateString()
                                : "Select date"}
                              <ChevronDownIcon />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto overflow-hidden p-0"
                            align="start"
                          >
                            <Calendar
                              mode="single"
                              selected={field.value}
                              captionLayout="dropdown"
                              onSelect={field.onChange}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="flex flex-col gap-3 w-full">
                        <Input
                          type="time"
                          id="time-picker"
                          step="1"
                          defaultValue="10:30:00"
                          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
}

function EventOfflineForm() {
  const form = useFormContext<CreateEventGeneral>();

  return (
    <Grid columns={"12"} className="mb-5">
      <Box className="col-span-12 md:col-span-3 md:!block !hidden">
        <Heading size={"4"} weight={"medium"}>
          Offline Event
        </Heading>
      </Box>
      <Card className="col-span-12 md:col-span-9">
        <CardHeader className="md:hidden block">
          <CardTitle>Offline Event</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <Box>
            <FormField
              control={form.control}
              name="venue_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{toTitleCase(field.name)}</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full shadow-none"
                      {...field}
                      autoComplete={field.name}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Box>
          <Box>
            <FormField
              control={form.control}
              name="venue_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{toTitleCase(field.name)}</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full shadow-none"
                      {...field}
                      autoComplete={field.name}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Box>
          <Box>
            <FormField
              control={form.control}
              name="venue_province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{toTitleCase(field.name)}</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full shadow-none"
                      {...field}
                      autoComplete={field.name}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Box>
          <Box>
            <FormField
              control={form.control}
              name="venue_city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{toTitleCase(field.name)}</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full shadow-none"
                      {...field}
                      autoComplete={field.name}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Box>
          <Box>
            <FormField
              control={form.control}
              name="venue_latitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{toTitleCase(field.name)}</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full shadow-none"
                      {...field}
                      autoComplete={field.name}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Box>
          <Box>
            <FormField
              control={form.control}
              name="venue_longitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{toTitleCase(field.name)}</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full shadow-none"
                      {...field}
                      autoComplete={field.name}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Box>
          <Box>
            <FormField
              control={form.control}
              name="min_age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{toTitleCase(field.name)}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      className="w-full shadow-none"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      autoComplete={field.name}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Box>
          <Box>
            <FormField
              control={form.control}
              name="max_age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{toTitleCase(field.name)}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      className="w-full shadow-none"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      autoComplete={field.name}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Box>
          <Box>
            <FormField
              control={form.control}
              name="galleries"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{toTitleCase(field.name)}</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      multiple
                      className="w-full shadow-none"
                      onChange={(e) =>
                        field.onChange(Array.from(e.target.files || []))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
}

function EventOnlineForm() {
  const form = useFormContext<CreateEventGeneral>();

  return (
    <Grid columns={"12"} className="mb-5">
      <Box className="col-span-12 md:col-span-3 md:!block !hidden">
        <Heading size={"4"} weight={"medium"}>
          Online Event
        </Heading>
      </Box>
      <Card className="col-span-12 md:col-span-9">
        <CardHeader className="md:hidden block">
          <CardTitle>Online Event</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <Box>
            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{toTitleCase(field.name)}</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full shadow-none"
                      {...field}
                      autoComplete={field.name}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Box>
          <Box>
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{toTitleCase(field.name)}</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full shadow-none"
                      {...field}
                      autoComplete={field.name}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
}
