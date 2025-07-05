"use client";

import AppTitle from "@/components/app-title";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  userUpdateSchema,
  UserUpdateSchema,
} from "@/validations/user_validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Container, Flex, Grid, Heading } from "@radix-ui/themes";
import { CalendarIcon, Camera, Loader, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GENDER, TOKEN_SETTING } from "@/constants";
import { Textarea } from "@/components/ui/textarea";
import { getCookie } from "cookies-next";
import { UserInterface } from "@/interfaces";
import { handleGetProfile, handleUpdateProfile } from "@/actions/user";
import { toastError, toastSuccess } from "@/lib/toast";

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>(
    "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop"
  );
  const [user, setUser] = useState<UserInterface>();

  const form = useForm<UserUpdateSchema>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      birth_date: undefined,
      gender: "",
      address: "",
      city: "",
      province: "",
      postal_code: "",
    },
  });

  const onHandleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("avatar", file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onHandleSubmit = async (data: UserUpdateSchema) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone || "");
    formData.append("birth_date", data.birth_date?.toISOString() || "");
    formData.append("gender", data.gender || "");
    formData.append("address", data.address || "");
    formData.append("city", data.city || "");
    formData.append("province", data.province || "");
    formData.append("postal_code", data.postal_code || "");
    formData.append("avatar", data.avatar || "");

    try {
      const response = await handleUpdateProfile(formData);

      if (response.success.status) {
        toastSuccess(response.success.message);
        getUser(true);
      }

      if (response.error) {
        toastError(response.error.message);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const getUser = async (isNew: boolean = false) => {
    let user;

    try {
      if (isNew) {
        user = await handleGetProfile();
      } else {
        user = JSON.parse(
          getCookie(TOKEN_SETTING.USER) as string
        ) as UserInterface;
      }

      setUser(user);

      form.setValue("name", user.name);
      form.setValue("email", user.email);
      form.setValue("phone", user.phone || "");
      form.setValue("birth_date", new Date(user.birth_date!));
      form.setValue("gender", user.gender || "");
      form.setValue("address", user.address || "");
      form.setValue("city", user.city || "");
      form.setValue("province", user.province || "");
      form.setValue("postal_code", user.postal_code || "");
    } catch (error) {}
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      form.setValue("name", user.name);
      form.setValue("email", user.email);
      form.setValue("phone", user.phone || "");
      form.setValue("birth_date", new Date(user.birth_date!));
      form.setValue("gender", user.gender || "");
      form.setValue("address", user.address || "");
      form.setValue("city", user.city || "");
      form.setValue("province", user.province || "");
      form.setValue("postal_code", user.postal_code || "");
    }
  }, [user]);

  return (
    <Container px={"4"} py={"9"}>
      <AppTitle
        title="Edit Profile"
        description="Update your personal information and preferences"
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onHandleSubmit)}>
          <Grid columns={{ initial: "1", sm: "3" }} gap={"4"}>
            <Box className="col-span-3 md:col-span-1">
              <Card className="shadow-xs">
                <CardContent>
                  <Flex direction={"column"} align={"center"} className="mb-8">
                    <Box position={"relative"}>
                      <img
                        src={avatarPreview}
                        alt="Profile Avatar"
                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                      <label
                        htmlFor="avatar-upload"
                        className="absolute bottom-0 right-0 bg-blue-600 text-white p-3 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg"
                      >
                        <Camera className="w-5 h-5" />
                      </label>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={onHandleAvatar}
                        className="hidden"
                      />
                    </Box>
                    <p className="text-sm text-gray-500 mt-3">
                      Click the camera icon to change your avatar
                    </p>
                  </Flex>
                </CardContent>
              </Card>
            </Box>
            <Box className="col-span-3 md:col-span-2">
              <Card className="shadow-xs">
                <CardContent>
                  <Grid columns={{ initial: "1", sm: "2" }} gap={"4"}>
                    <Box>
                      <Heading size={"4"}>Personal Information</Heading>
                      <Separator className="my-4" />

                      <Grid gap={"4"}>
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  id={field.name}
                                  {...field}
                                  disabled={isLoading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  id={field.name}
                                  {...field}
                                  disabled={isLoading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  id={field.name}
                                  {...field}
                                  disabled={isLoading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="birth_date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date of Birth</FormLabel>
                              <FormControl>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal"
                                    >
                                      <CalendarIcon />
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0">
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                    />
                                  </PopoverContent>
                                </Popover>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Gender</FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={(e) => {
                                    field.onChange(e);
                                  }}
                                  defaultValue={field.value}
                                  value={field.value}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a gender" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {GENDER.map((gender) => (
                                      <SelectItem
                                        value={gender.key}
                                        key={gender.key}
                                      >
                                        {gender.value}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </Grid>
                    </Box>
                    <Box>
                      <Heading size={"4"}>Address Information</Heading>
                      <Separator className="my-4" />

                      <Grid gap={"4"}>
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Textarea
                                  id={field.name}
                                  {...field}
                                  disabled={isLoading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  id={field.name}
                                  {...field}
                                  disabled={isLoading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="province"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Province</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  id={field.name}
                                  {...field}
                                  disabled={isLoading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="postal_code"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Postal Code</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  id={field.name}
                                  {...field}
                                  disabled={isLoading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </Grid>
                    </Box>
                  </Grid>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button disabled={isLoading}>
                    {isLoading ? <Loader className="animate-spin" /> : <Save />}{" "}
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </Box>
          </Grid>
        </form>
      </Form>
    </Container>
  );
}
