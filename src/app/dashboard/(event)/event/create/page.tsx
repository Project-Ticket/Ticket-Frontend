"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  CalendarIcon,
  Clock,
  Upload,
  X,
  Plus,
  MapPin,
  Globe,
  Users,
  FileText,
  Settings,
  Camera,
  Tag,
  ChevronLeft,
  ChevronDownIcon,
} from "lucide-react";
import { format } from "date-fns";
import { useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EVENT_TYPE_ARRAY } from "@/constants";
import { CategoryInterface } from "@/interfaces";
import { toTitleCase } from "@/lib/utils";
import {
  createEventGeneral,
  CreateEventGeneral,
} from "@/validations/event_validation";
import { toastError, toastSuccess } from "@/lib/toast";
import TagsInput from "@/components/tags-input";
import TipTapEditor from "@/components/tiptapEditor";
import { handleCreate, handleGetCategory } from "@/actions/event";

export default function Page() {
  const [currentStep, setCurrentStep] = useState(1);
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const form = useForm<CreateEventGeneral>({
    resolver: zodResolver(createEventGeneral),
    mode: "onTouched",
    defaultValues: {
      category: 1,
      title: "",
      description: "",
      terms_conditions: "",
      type: "online",
      registration_start: new Date(),
      registration_end: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      is_featured: false,
      tags: [],
      start_datetime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
      end_datetime: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000
      ), // 2 hours later
    },
  });

  const eventType = form.watch("type");

  const onGetCategories = async () => {
    try {
      const response = await handleGetCategory();
      setCategories(response);
    } catch (error) {
      console.error("Failed to get categories:", error);
    }
  };

  const onSubmit = form.handleSubmit(async (data) => {
    setIsLoading(true);

    try {
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

      const response = await handleCreate(formData);
      console.log(response);

      if (response.success.status) {
        toastSuccess("Event created successfully");
        form.reset();
        setCurrentStep(1);
        setBannerPreview(null);
        setGalleryPreviews([]);
      }

      if (response.error) {
        toastError(response.error.message);
      }
    } catch (error) {
      toastError(error);
    } finally {
      setIsLoading(false);
    }
  });

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fieldsToValidate);

    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getFieldsForStep = (step: number): (keyof CreateEventGeneral)[] => {
    switch (step) {
      case 1:
        return ["type", "category", "title", "description"];
      case 2:
        return ["terms_conditions", "tags"];
      case 3:
        return [
          "registration_start",
          "registration_end",
          "start_datetime",
          "end_datetime",
        ];
      case 4:
        const fields: (keyof CreateEventGeneral)[] = [];
        const type = form.getValues("type");
        if (["offline", "hybrid"].includes(type)) {
          fields.push(
            "venue_name",
            "venue_address",
            "venue_city",
            "venue_province",
            "venue_latitude",
            "venue_longitude",
            "min_age",
            "max_age"
          );
        }
        if (["online", "hybrid"].includes(type)) {
          fields.push("platform", "link");
        }
        return fields;
      default:
        return [];
    }
  };

  const handleBannerUpload = (file: File) => {
    form.setValue("banner", file);
    const reader = new FileReader();
    reader.onload = (e) => setBannerPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleGalleryUpload = (files: FileList) => {
    const fileArray = Array.from(files);
    form.setValue("galleries" as any, fileArray);

    const previews: string[] = [];
    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        previews.push(e.target?.result as string);
        if (previews.length === fileArray.length) {
          setGalleryPreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    if (eventType) {
      // Clear conditional fields when type changes
      const currentValues = form.getValues();
      if (currentValues.type !== eventType) {
        if (!["offline", "hybrid"].includes(eventType)) {
          form.setValue("venue_name" as any, "");
          form.setValue("venue_address" as any, "");
          form.setValue("venue_city" as any, "");
          form.setValue("venue_province" as any, "");
          form.setValue("venue_latitude" as any, "");
          form.setValue("venue_longitude" as any, "");
          form.setValue("min_age" as any, undefined);
          form.setValue("max_age" as any, undefined);
          form.setValue("galleries" as any, undefined);
          setGalleryPreviews([]);
        }
        if (!["online", "hybrid"].includes(eventType)) {
          form.setValue("platform" as any, "");
          form.setValue("link" as any, "");
        }
      }
    }
  }, [eventType, form]);

  useEffect(() => {
    onGetCategories();
  }, []);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <DetailEventForm categories={categories} />;
      case 2:
        return (
          <MediaContentForm
            bannerPreview={bannerPreview}
            onBannerUpload={handleBannerUpload}
          />
        );
      case 3:
        return <ScheduleForm />;
      case 4:
        return (
          <PlatformDetailsForm
            galleryPreviews={galleryPreviews}
            onGalleryUpload={handleGalleryUpload}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div className="px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Create New Event
            </h1>
            <p className="text-lg text-muted-foreground">
              Build engaging events that bring people together
            </p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-sm font-medium text-gray-700">
                {progress.toFixed(0)}% Complete
              </span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          <Card>
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Event Details</CardTitle>
                  <CardDescription className="text-base mt-2">
                    Step {currentStep}:{" "}
                    {currentStep === 1
                      ? "Basic Information"
                      : currentStep === 2
                      ? "Media & Content"
                      : currentStep === 3
                      ? "Schedule & Registration"
                      : "Platform Details"}
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  {Array.from({ length: totalSteps }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-4 h-4 rounded-full transition-all duration-300 ${
                        i + 1 <= currentStep
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              {renderStepContent()}

              <div className="flex justify-between mt-10 pt-8 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="min-w-32 h-12"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                {currentStep === totalSteps ? (
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="min-w-40 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold"
                  >
                    {isLoading ? "Creating..." : "Create Event"}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="min-w-32 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                  >
                    Next
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </Form>
  );
}

function DetailEventForm({ categories }: { categories: CategoryInterface[] }) {
  const form = useFormContext<CreateEventGeneral>();

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <FileText className="mx-auto h-16 w-16 text-blue-500 mb-4" />
        <h3 className="text-2xl font-semibold mb-2">Basic Information</h3>
        <p className="text-muted-foreground text-lg">
          Tell us about your event
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  {toTitleCase(field.name)}
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      const currentType = form.getValues("type");
                      if (currentType !== value) {
                        if (!["offline", "hybrid"].includes(value)) {
                          form.setValue("venue_name" as any, undefined);
                          form.setValue("venue_address" as any, undefined);
                          form.setValue("venue_city" as any, undefined);
                          form.setValue("venue_province" as any, undefined);
                          form.setValue("venue_latitude" as any, undefined);
                          form.setValue("venue_longitude" as any, undefined);
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
                    value={field.value}
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
                <FormLabel className="text-base font-semibold">
                  {toTitleCase(field.name)}
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(e) => field.onChange(Number(e))}
                    value={field.value?.toString()}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category, index) => (
                        <SelectItem value={category.id.toString()} key={index}>
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
                  <FormLabel className="text-base font-semibold">
                    Featured Event
                  </FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Mark this event as featured to highlight it
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
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
                <FormLabel className="text-base font-semibold">
                  {toTitleCase(field.name)}
                </FormLabel>
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
                <FormLabel className="text-base font-semibold">
                  {toTitleCase(field.name)}
                </FormLabel>
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
      </div>
    </div>
  );
}

function MediaContentForm({
  bannerPreview,
  onBannerUpload,
}: {
  bannerPreview: string | null;
  onBannerUpload: (file: File) => void;
}) {
  const form = useFormContext<CreateEventGeneral>();

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <Camera className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-2xl font-semibold mb-2">Media & Content</h3>
        <p className="text-muted-foreground text-lg">
          Add visual elements and terms
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="banner"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  {toTitleCase(field.name)}
                </FormLabel>
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
                            if (file) onBannerUpload(file);
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
                <FormLabel className="text-base font-semibold">
                  {toTitleCase(field.name)}
                </FormLabel>
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
                <FormLabel className="text-base font-semibold">
                  {toTitleCase(field.name)}
                </FormLabel>
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
      </div>
    </div>
  );
}

function ScheduleForm() {
  const form = useFormContext<CreateEventGeneral>();

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <Clock className="mx-auto h-16 w-16 text-amber-500 mb-4" />
        <h3 className="text-2xl font-semibold mb-2">Schedule & Registration</h3>
        <p className="text-muted-foreground text-lg">Set dates and times</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="registration_start"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  {toTitleCase(field.name)}
                </FormLabel>
                <FormControl>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between h-12 font-normal"
                          >
                            {field.value
                              ? format(field.value, "PPP")
                              : "Select date"}
                            <ChevronDownIcon className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            captionLayout="dropdown"
                            onSelect={field.onChange}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex-1">
                      <Input
                        type="time"
                        step="1"
                        defaultValue="10:30:00"
                        className="h-12"
                      />
                    </div>
                  </div>
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
                <FormLabel className="text-base font-semibold">
                  {toTitleCase(field.name)}
                </FormLabel>
                <FormControl>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between h-12 font-normal"
                          >
                            {field.value
                              ? format(field.value, "PPP")
                              : "Select date"}
                            <ChevronDownIcon className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            captionLayout="dropdown"
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex-1">
                      <Input
                        type="time"
                        step="1"
                        defaultValue="10:30:00"
                        className="h-12"
                      />
                    </div>
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
            name="registration_end"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  {toTitleCase(field.name)}
                </FormLabel>
                <FormControl>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between h-12 font-normal"
                          >
                            {field.value
                              ? format(field.value, "PPP")
                              : "Select date"}
                            <ChevronDownIcon className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            captionLayout="dropdown"
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex-1">
                      <Input
                        type="time"
                        step="1"
                        defaultValue="10:30:00"
                        className="h-12"
                      />
                    </div>
                  </div>
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
                <FormLabel className="text-base font-semibold">
                  {toTitleCase(field.name)}
                </FormLabel>
                <FormControl>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between h-12 font-normal"
                          >
                            {field.value
                              ? format(field.value, "PPP")
                              : "Select date"}
                            <ChevronDownIcon className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            captionLayout="dropdown"
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex-1">
                      <Input
                        type="time"
                        step="1"
                        defaultValue="10:30:00"
                        className="h-12"
                      />
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}

function PlatformDetailsForm({
  galleryPreviews,
  onGalleryUpload,
}: {
  galleryPreviews: string[];
  onGalleryUpload: (files: FileList) => void;
}) {
  const form = useFormContext<CreateEventGeneral>();
  const eventType = form.watch("type");

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <Settings className="mx-auto h-16 w-16 text-purple-500 mb-4" />
        <h3 className="text-2xl font-semibold mb-2">Platform Details</h3>
        <p className="text-muted-foreground text-lg">
          Configure event location and settings
        </p>
      </div>

      {["online", "hybrid"].includes(eventType) && <EventOnlineForm />}
      {["offline", "hybrid"].includes(eventType) && (
        <EventOfflineForm
          galleryPreviews={galleryPreviews}
          onGalleryUpload={onGalleryUpload}
        />
      )}

      <Separator />

      <div className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <h4 className="font-semibold text-xl mb-6 flex items-center text-blue-900">
          <Users className="h-6 w-6 mr-3" />
          Event Summary
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between py-2 border-b border-blue-100">
            <span className="text-blue-700 font-medium">Type:</span>
            <span className="font-semibold text-blue-900">
              {EVENT_TYPE_ARRAY.find((t) => t.key === eventType)?.value ||
                "Not specified"}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-blue-100">
            <span className="text-blue-700 font-medium">Category:</span>
            <span className="font-semibold text-blue-900">"Not specified"</span>
          </div>
          <div className="flex justify-between py-2 border-b border-blue-100">
            <span className="text-blue-700 font-medium">Title:</span>
            <span className="font-semibold text-blue-900">
              {form.watch("title") || "Untitled Event"}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-blue-100">
            <span className="text-blue-700 font-medium">Tags:</span>
            <span className="font-semibold text-blue-900">
              {form.watch("tags")?.length || 0} tags
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventOnlineForm() {
  const form = useFormContext<CreateEventGeneral>();

  return (
    <div className="space-y-6">
      <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="flex items-center mb-3">
          <Globe className="h-6 w-6 text-blue-500 mr-3" />
          <span className="font-semibold text-blue-900 text-lg">
            Online Event Configuration
          </span>
        </div>
        <p className="text-blue-700">
          Platform and meeting link are required for online events
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="platform"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                {toTitleCase(field.name || "")}
              </FormLabel>
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
              <FormLabel className="text-base font-semibold">
                Meeting {toTitleCase(field.name || "")}
              </FormLabel>
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
  const form = useFormContext<CreateEventGeneral>();

  return (
    <div className="space-y-6">
      <div className="p-6 bg-green-50 border border-green-200 rounded-xl">
        <div className="flex items-center mb-3">
          <MapPin className="h-6 w-6 text-green-500 mr-3" />
          <span className="font-semibold text-green-900 text-lg">
            Offline Event Configuration
          </span>
        </div>
        <p className="text-green-700">
          Provide the physical location details and venue information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="venue_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  {toTitleCase(field.name || "")}
                </FormLabel>
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
                <FormLabel className="text-base font-semibold">
                  {toTitleCase(field.name || "")}
                </FormLabel>
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
                  <FormLabel className="text-base font-semibold">
                    {toTitleCase(field.name || "")}
                  </FormLabel>
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
                  <FormLabel className="text-base font-semibold">
                    {toTitleCase(field.name || "")}
                  </FormLabel>
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="venue_latitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    {toTitleCase(field.name || "")}
                  </FormLabel>
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
                  <FormLabel className="text-base font-semibold">
                    {toTitleCase(field.name || "")}
                  </FormLabel>
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
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="min_age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    {toTitleCase(field.name || "")}
                  </FormLabel>
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
                  <FormLabel className="text-base font-semibold">
                    {toTitleCase(field.name || "")}
                  </FormLabel>
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

          <FormField
            control={form.control}
            name="galleries"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  {toTitleCase(field.name || "")}
                </FormLabel>
                <FormControl>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 transition-colors">
                    {galleryPreviews.length > 0 ? (
                      <div className="grid grid-cols-2 gap-4">
                        {galleryPreviews.map((preview, index) => (
                          <img
                            key={index}
                            src={preview}
                            alt={`Gallery ${index + 1}`}
                            className="h-24 w-full object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    ) : (
                      <div>
                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                        <p className="text-gray-600 mb-2">
                          Upload venue galleries
                        </p>
                        <p className="text-sm text-gray-500">
                          Multiple images allowed
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files) onGalleryUpload(e.target.files);
                      }}
                      className="hidden"
                      id="gallery-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-4"
                      asChild
                    >
                      <label
                        htmlFor="gallery-upload"
                        className="cursor-pointer"
                      >
                        Choose Files
                      </label>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
