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
import { OrganizerInterface, UserInterface } from "@/interfaces";
import { toastError, toastSuccess } from "@/lib/toast";
import { toTitleCase } from "@/lib/utils";
import {
  createAddressOrganizer,
  CreateAddressOrganizer,
} from "@/validations/organizer_validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Grid } from "@radix-ui/themes";
import { Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [organizer, setOrganizer] = useState<OrganizerInterface>();
  const form = useForm<CreateAddressOrganizer>({
    resolver: zodResolver(createAddressOrganizer),
    defaultValues: {
      address: "",
      city: "",
      postal_code: "",
      province: "",
    },
  });

  const getUser = async () => {
    setIsLoading(true);

    try {
      const user = (await handleGetProfile()) as UserInterface;
      const organizer = user.event_organizer!;

      form.setValue("postal_code", organizer.postal_code);
      form.setValue("address", organizer.address);
      form.setValue("city", organizer.city);
      form.setValue("province", organizer.province);

      setOrganizer(organizer);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: CreateAddressOrganizer) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("province", data?.province || "");
    formData.append("city", data?.city || "");
    formData.append("postal_code", data?.postal_code || "");
    formData.append("address", data?.address || "");

    try {
      const response = await handleUpdate(formData, organizer?.uuid!);

      if (response.success?.status) {
        setOrganizer(response.success?.data);
        toastSuccess(response.success.message);
      }

      if (response.error) {
        if (response.error.data) {
          Object.entries(response.error.data).forEach(([key, messages]) => {
            form.setError(key as keyof CreateAddressOrganizer, {
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
                name="province"
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
                name="city"
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
                name="postal_code"
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
                name="address"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>{toTitleCase(field.name)}</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
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
