"use client";

import { handleUpdate } from "@/actions/organizer";
import { handleGetProfile } from "@/actions/user";
import { MultiSelect } from "@/components/multi-select";
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
  createDocumentOrganizer,
  CreateDocumentOrganizer,
} from "@/validations/organizer_validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Grid } from "@radix-ui/themes";
import { Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function Page() {
  const documentTypes = [
    { value: "KTP", label: "KTP" },
    { value: "NPWP", label: "NPWP" },
  ];

  const [isLoading, setIsLoading] = useState(false);
  const [organizer, setOrganizer] = useState<OrganizerInterface>();
  const form = useForm<CreateDocumentOrganizer>({
    resolver: zodResolver(createDocumentOrganizer),
    defaultValues: {},
  });

  const getUser = async () => {
    setIsLoading(true);

    try {
      const user = (await handleGetProfile()) as UserInterface;
      const organizer = user.event_organizer!;

      setOrganizer(organizer);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: CreateDocumentOrganizer) => {
    setIsLoading(true);

    const formData = new FormData();

    try {
      const response = await handleUpdate(formData, organizer?.uuid!);

      if (response.success?.status) {
        setOrganizer(response.success?.data);
        toastSuccess(response.success.message);
      }

      if (response.error) {
        if (response.error.data) {
          Object.entries(response.error.data).forEach(([key, messages]) => {
            form.setError(key as keyof CreateDocumentOrganizer, {
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

  const handleSelectedTypesChange = (types: string[]) => {
    form.setValue("required_documents", types);
    form.setValue(
      "uploaded_documents",
      types.map(() => ({ file: {} as File }))
    );
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
            <Grid gap={"5"}>
              <FormField
                control={form.control}
                name="required_documents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{toTitleCase(field.name)}</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={documentTypes}
                        onValueChange={handleSelectedTypesChange}
                        defaultValue={form.watch("required_documents")}
                        placeholder="Select options"
                        variant="default"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("uploaded_documents")?.map((_, index) => (
                <div key={index}>
                  <FormField
                    control={form.control}
                    name={`uploaded_documents.${index}.file`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {form.getValues("required_documents")[index]}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            id={field.name}
                            onChange={(e) =>
                              field.onChange(e.target.files?.[0])
                            }
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
