"use client";

import { handleUpdate } from "@/actions/organizer";
import { handleGetProfile } from "@/actions/user";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { OrganizerInterface, UserInterface } from "@/interfaces";
import { imageFetch } from "@/lib/client-fetcher";
import { toastError, toastSuccess } from "@/lib/toast";
import { toTitleCase } from "@/lib/utils";
import {
  updateProfileOrganizer,
  UpdateProfileOrganizer,
} from "@/validations/organizer_validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Grid } from "@radix-ui/themes";
import { Loader2, Save } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [organizer, setOrganizer] = useState<OrganizerInterface>();
  const form = useForm<UpdateProfileOrganizer>({
    resolver: zodResolver(updateProfileOrganizer),
    defaultValues: {
      organizer_name: "",
      description: "",
      contact_person: "",
      contact_phone: "",
      contact_email: "",
    },
  });

  const onSubmit = async (data: UpdateProfileOrganizer) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("organization_name", data?.organizer_name || "");
    formData.append("description", data?.description || "");
    formData.append("contact_person", data?.contact_person || "");
    formData.append("contact_phone", data?.contact_phone || "");
    formData.append("contact_email", data?.contact_email || "");
    if (data.logo) {
      formData.append("logo", data.logo);
    }
    if (data.banner) {
      formData.append("banner", data.banner);
    }

    try {
      const response = await handleUpdate(formData, organizer?.uuid!);

      if (response.success?.status) {
        setOrganizer(response.success?.data);
        toastSuccess(response.success.message);
      }

      if (response.error) {
        if (response.error.data) {
          Object.entries(response.error.data).forEach(([key, messages]) => {
            form.setError(key as keyof UpdateProfileOrganizer, {
              type: "server",
              message: (messages as string[])[0],
            });
          });
        }

        toastError(response.error.message);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const getUser = async () => {
    setIsLoading(true);

    try {
      const user = (await handleGetProfile()) as UserInterface;

      const organizer = user.event_organizer!;

      form.setValue("organizer_name", organizer.organization_name);
      form.setValue("description", organizer.description);
      form.setValue("contact_person", organizer.contact_person);
      form.setValue("contact_phone", organizer.contact_phone);
      form.setValue("contact_email", organizer.contact_email);
      setOrganizer(organizer);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  if (!organizer) {
    return null;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="shadow-xs border-0">
          <CardContent>
            <Grid columns={{ initial: "1", md: "2" }} gap={"5"}>
              <FormField
                control={form.control}
                name="organizer_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{toTitleCase(field.name)}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact_person"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{toTitleCase(field.name)}</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{toTitleCase(field.name)}</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{toTitleCase(field.name)}</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{toTitleCase(field.name)}</FormLabel>
                    <FormControl>
                      <div className="space-y-5">
                        <Input
                          type="file"
                          onChange={(e) => field.onChange(e.target.files![0])}
                          disabled={isLoading}
                        />
                        <Image
                          src={imageFetch(organizer?.logo!)}
                          alt={organizer?.organization_name!}
                          height={100}
                          width={100}
                          className="h-32 w-32 object-cover"
                          quality={100}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="banner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{toTitleCase(field.name)}</FormLabel>
                    <FormControl>
                      <div className="space-y-5">
                        <Input
                          type="file"
                          onChange={(e) => field.onChange(e.target.files![0])}
                          disabled={isLoading}
                        />
                        <Image
                          src={imageFetch(organizer?.banner!)}
                          alt={organizer?.organization_name!}
                          height={100}
                          width={100}
                          className="h-32 w-32 object-cover"
                          quality={100}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2 col-span-1">
                    <FormLabel>{toTitleCase(field.name)}</FormLabel>
                    <FormControl>
                      <Textarea {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Grid>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              type="submit"
              variant={"primary"}
              size={"sm"}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <Save />} Save
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
