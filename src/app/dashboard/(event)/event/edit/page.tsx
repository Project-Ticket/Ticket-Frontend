"use client";

import {
  handleGetCategory,
  handleGetEvent,
  handleUpdate,
} from "@/actions/event";
import AppTitle from "@/components/app-title";
import DateTimePicker from "@/components/datetime-picker";
import TagsInput from "@/components/tags-input";
import TipTapEditor from "@/components/tiptapEditor";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { EVENT_TYPE_ARRAY, EVENT_TYPE_OBJECT } from "@/constants";
import { APP_LINK } from "@/constants/link_constant";
import { CategoryInterface, EventInterface } from "@/interfaces";
import { toastError, toastSuccess } from "@/lib/toast";
import { getImageUrl, toTitleCase } from "@/lib/utils";
import {
  updateEventGeneral,
  UpdateEventGeneral,
} from "@/validations/event_validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Flex, Grid } from "@radix-ui/themes";
import { format } from "date-fns";
import {
  ChevronDownIcon,
  ChevronLeft,
  Clock,
  Globe,
  ImageIcon,
  InfoIcon,
  Loader,
  MapPin,
  Save,
  Settings,
  Upload,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [event, setEvent] = useState<EventInterface>();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const form = useForm<UpdateEventGeneral>({
    resolver: zodResolver(updateEventGeneral),
    defaultValues: {
      category: 0,
      title: "",
      description: "",
      terms_conditions: "",
      type: "online",
      registration_start: undefined,
      registration_end: undefined,
      is_featured: false,
      tags: [],
      start_datetime: undefined,
      end_datetime: undefined,
    },
  });

  const onGetEvent = async () => {
    setIsLoading(true);

    try {
      const response = (await handleGetEvent(
        searchParams.get("uid")!
      )) as EventInterface;

      setEvent(response);
    } catch (error) {
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const onGetCategories = async () => {
    try {
      const response = await handleGetCategory();
      setCategories(response);
    } catch (error) {
      console.error("Failed to get categories:", error);
    }
  };

  const handleBannerUpload = (file: File) => {
    form.setValue("banner", file);
    const reader = new FileReader();
    reader.onload = (e) => setBannerPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const onHandleUpdate = async (data: UpdateEventGeneral) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("category_id", data.category.toString());
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("terms_conditions", data.terms_conditions);
    formData.append("type", data.type);
    formData.append(
      "registration_start",
      data.registration_start.toISOString()
    );
    formData.append("registration_end", data.registration_end.toISOString());
    formData.append("start_datetime", data.start_datetime.toISOString());
    formData.append("end_datetime", data.end_datetime.toISOString());

    if (data.tags && data.tags.length > 0) {
      data.tags.forEach((tag: string, index: number) => {
        formData.append(`tags[${index}]`, tag);
      });
    }

    if (data.banner) {
      formData.append("banner_image", data.banner);
    }

    // Handle conditional fields based on event type
    if (["offline", "hybrid"].includes(data.type)) {
      const offlineData = data as any;
      if (offlineData.venue_name)
        formData.append("venue_name", offlineData.venue_name);
      if (offlineData.venue_address)
        formData.append("venue_address", offlineData.venue_address);
      if (offlineData.venue_city)
        formData.append("venue_city", offlineData.venue_city);
      if (offlineData.venue_province)
        formData.append("venue_province", offlineData.venue_province);
      if (offlineData.venue_latitude)
        formData.append("venue_latitude", offlineData.venue_latitude);
      if (offlineData.venue_longitude)
        formData.append("venue_longitude", offlineData.venue_longitude);
      if (offlineData.min_age !== undefined)
        formData.append("min_age", offlineData.min_age.toString());
      if (offlineData.max_age !== undefined)
        formData.append("max_age", offlineData.max_age.toString());

      if (offlineData.galleries && offlineData.galleries.length > 0) {
        offlineData.galleries.forEach((file: File, index: number) => {
          formData.append(`galleries[${index}]`, file);
        });
      }
    }

    if (["online", "hybrid"].includes(data.type)) {
      const onlineData = data as any;
      if (onlineData.platform)
        formData.append("online_platform", onlineData.platform);
      if (onlineData.link) formData.append("online_link", onlineData.link);
    }

    try {
      const response = await handleUpdate(
        formData,
        String(searchParams.get("uid"))
      );

      if (response.success.status) {
        toastSuccess(response.success.message);
        router.push(APP_LINK.DASHBOARD.EVENT.DEFAULT);
      }

      if (response.error) {
        toastError(response.error.message);
      }
    } catch (error) {
      toastError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    onGetEvent();
    onGetCategories();
  }, []);

  useEffect(() => {
    if (event && categories.length > 0) {
      const formData = {
        category: event.category.id,
        type: event.type,
        title: event.title,
        description: event.description,
        terms_conditions: event.terms_conditions,
        registration_start: new Date(event.registration_start),
        registration_end: new Date(event.registration_end),
        is_featured: event.is_featured,
        tags: event.tags?.map((tag) => tag.name),
        start_datetime: new Date(event.start_datetime),
        end_datetime: new Date(event.end_datetime),
      } as UpdateEventGeneral;

      if (
        [EVENT_TYPE_OBJECT.ONLINE, EVENT_TYPE_OBJECT.HYBRID].includes(
          event.type
        )
      ) {
        formData.link = event.online_link;
        formData.platform = event.online_platform;
      }

      if (
        [EVENT_TYPE_OBJECT.OFFLINE, EVENT_TYPE_OBJECT.HYBRID].includes(
          event.type
        )
      ) {
        formData.venue_address = event.venue_address;
        formData.venue_city = event.venue_city;
        formData.venue_latitude = event.venue_latitude;
        formData.venue_longitude = event.venue_longitude;
        formData.venue_name = event.venue_name;
        formData.venue_province = event.venue_province;
        formData.min_age = event.min_age;
        formData.max_age = event.max_age;
      }

      form.reset(formData);
      setBannerPreview(getImageUrl(event.banner_image));
    }
  }, [event, categories]);

  return (
    <div>
      <AppTitle title="Edit Event">
        <Button onClick={() => router.back()} variant={"outline"} size="sm">
          <ChevronLeft /> Back
        </Button>
      </AppTitle>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onHandleUpdate)}
          className="space-y-6"
        >
          <Card className="shadow-xs">
            <CardHeader className="flex items-center gap-4">
              <InfoIcon />
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Grid columns={{ initial: "1", sm: "2" }} gap={"4"}>
                <div className="space-y-6">
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
                              const currentType = form.getValues("type");
                              if (currentType !== value) {
                                if (!["offline", "hybrid"].includes(value)) {
                                  form.setValue("venue_name" as any, undefined);
                                  form.setValue(
                                    "venue_address" as any,
                                    undefined
                                  );
                                  form.setValue("venue_city" as any, undefined);
                                  form.setValue(
                                    "venue_province" as any,
                                    undefined
                                  );
                                  form.setValue(
                                    "venue_latitude" as any,
                                    undefined
                                  );
                                  form.setValue(
                                    "venue_longitude" as any,
                                    undefined
                                  );
                                  form.setValue("min_age" as any, undefined);
                                  form.setValue("max_age" as any, undefined);
                                  form.setValue("galleries" as any, undefined);
                                }
                                if (!["online", "hybrid"].includes(value)) {
                                  form.setValue("platform" as any, undefined);
                                  form.setValue("link" as any, undefined);
                                }
                              }
                            }}
                            value={form.watch("type")}
                            defaultValue={form.watch("type")}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select event type" />
                            </SelectTrigger>
                            <SelectContent>
                              {EVENT_TYPE_ARRAY.map((type, index) => (
                                <SelectItem value={type.key} key={index}>
                                  <div className="flex items-center space-x-2">
                                    {type.key === "online" && (
                                      <Globe className="h-4 w-4" />
                                    )}
                                    {type.key === "offline" && (
                                      <MapPin className="h-4 w-4" />
                                    )}
                                    {type.key === "hybrid" && (
                                      <Users className="h-4 w-4" />
                                    )}
                                    <span>{type.value}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{toTitleCase(field.name)}</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(e) => field.onChange(Number(e))}
                            value={form.watch("category").toString()}
                            defaultValue={form.watch("category").toString()}
                          >
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

                  <FormField
                    control={form.control}
                    name="is_featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Featured Event</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Mark this event as featured to highlight it
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={(e) => field.onChange(e)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{toTitleCase(field.name)}</FormLabel>
                        <FormControl>
                          <Input
                            className="h-12 text-lg"
                            placeholder="Enter event title"
                            {...field}
                            autoComplete={field.name}
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
                        <FormLabel>{toTitleCase(field.name)}</FormLabel>
                        <FormControl>
                          <Textarea
                            className="min-h-[120px] resize-none"
                            placeholder="Describe your event in detail..."
                            {...field}
                            autoComplete={field.name}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Grid>
            </CardContent>
          </Card>

          <Card className="shadow-xs">
            <CardHeader className="flex items-center gap-4">
              <ImageIcon />
              <CardTitle>Media & Content</CardTitle>
            </CardHeader>
            <CardContent>
              <Grid columns={{ initial: "1", sm: "2" }} gap={"5"}>
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="banner"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{toTitleCase(field.name)}</FormLabel>
                        <FormControl>
                          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors">
                            {bannerPreview ? (
                              <div className="relative">
                                <img
                                  src={bannerPreview}
                                  alt="Banner preview"
                                  className="max-h-64 mx-auto rounded-lg shadow-lg"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="mt-4"
                                  onClick={() => {
                                    form.setValue("banner", undefined as any);
                                  }}
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  Remove
                                </Button>
                              </div>
                            ) : (
                              <div>
                                <Upload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                                <p className="text-gray-600 mb-2 text-lg">
                                  Upload event banner
                                </p>
                                <p className="text-sm text-gray-500">
                                  PNG, JPG up to 10MB
                                </p>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleBannerUpload(file);
                                  }}
                                  className="hidden"
                                  id="banner-upload"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="mt-4"
                                  asChild
                                >
                                  <label
                                    htmlFor="banner-upload"
                                    className="cursor-pointer"
                                  >
                                    Choose File
                                  </label>
                                </Button>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{toTitleCase(field.name)}</FormLabel>
                        <FormControl>
                          <TagsInput
                            initialTags={field.value || []}
                            onTagsChange={field.onChange}
                            placeholder="Add event tags..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="terms_conditions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{toTitleCase(field.name)}</FormLabel>
                        <FormControl>
                          <TipTapEditor
                            setContent={field.onChange}
                            content={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Grid>
            </CardContent>
          </Card>

          <Card className="shadow-xs">
            <CardHeader className="flex items-center gap-4">
              <Clock />
              <CardTitle>Schedule & Registration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="registration_start"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{toTitleCase(field.name)}</FormLabel>
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
                  name="registration_end"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{toTitleCase(field.name)}</FormLabel>
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
                  name="start_datetime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{toTitleCase(field.name)}</FormLabel>
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
                  name="end_datetime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{toTitleCase(field.name)}</FormLabel>
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
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xs">
            <CardHeader className="flex items-center gap-4">
              <Settings />
              <CardTitle>Platform Details</CardTitle>
            </CardHeader>
            <CardContent>
              {["online", "hybrid"].includes(form.watch("type")) && (
                <EventOnlineForm />
              )}
              {["offline", "hybrid"].includes(form.watch("type")) && (
                <EventOfflineForm
                  galleryPreviews={galleryPreviews}
                  onGalleryUpload={(e: any) => {
                    const file = e.target.files?.[0];
                    if (file) handleBannerUpload(file);
                  }}
                />
              )}
            </CardContent>
          </Card>

          <Flex justify={"end"}>
            <Button type="submit" variant={"primary"} disabled={isLoading}>
              {isLoading ? <Loader className=" animate-spin" /> : <Save />} Save
            </Button>
          </Flex>
        </form>
      </Form>
    </div>
  );
}

function EventOnlineForm() {
  const form = useFormContext<UpdateEventGeneral>();

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="platform"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{toTitleCase(field.name || "")}</FormLabel>
            <FormControl>
              <Input
                className="h-12"
                placeholder="e.g., Zoom, Google Meet, Teams"
                {...field}
                autoComplete={field.name}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="link"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Meeting {toTitleCase(field.name || "")}</FormLabel>
            <FormControl>
              <Input
                className="h-12"
                type="url"
                placeholder="https://example.com/meeting"
                {...field}
                autoComplete={field.name}
              />
            </FormControl>
            <p className="text-sm text-muted-foreground mt-2">
              Link will be shared with registered attendees
            </p>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function EventOfflineForm({
  galleryPreviews,
  onGalleryUpload,
}: {
  galleryPreviews: string[];
  onGalleryUpload: (files: FileList) => void;
}) {
  const form = useFormContext<UpdateEventGeneral>();

  return (
    <>
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="venue_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{toTitleCase(field.name || "")}</FormLabel>
              <FormControl>
                <Input
                  className="h-12"
                  placeholder="Enter venue name"
                  {...field}
                  autoComplete={field.name}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="venue_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{toTitleCase(field.name || "")}</FormLabel>
              <FormControl>
                <Input
                  className="h-12"
                  placeholder="Enter venue address"
                  {...field}
                  autoComplete={field.name}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="venue_city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{toTitleCase(field.name || "")}</FormLabel>
                <FormControl>
                  <Input
                    className="h-12"
                    placeholder="City"
                    {...field}
                    autoComplete={field.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="venue_province"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{toTitleCase(field.name || "")}</FormLabel>
                <FormControl>
                  <Input
                    className="h-12"
                    placeholder="Province"
                    {...field}
                    autoComplete={field.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="venue_latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{toTitleCase(field.name || "")}</FormLabel>
                <FormControl>
                  <Input
                    className="h-12"
                    placeholder="Latitude"
                    {...field}
                    autoComplete={field.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="venue_longitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{toTitleCase(field.name || "")}</FormLabel>
                <FormControl>
                  <Input
                    className="h-12"
                    placeholder="Longitude"
                    {...field}
                    autoComplete={field.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="min_age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{toTitleCase(field.name || "")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    className="h-12"
                    placeholder="Min age"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    autoComplete={field.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="max_age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{toTitleCase(field.name || "")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    className="h-12"
                    placeholder="Max age"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    autoComplete={field.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </>
  );
}
