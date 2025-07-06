"use client";

import {
  handleGetApplicationStatus,
  handleResubmit,
} from "@/actions/organizer";
import { handleGetPaymentMethod } from "@/actions/payment";
import LandingLayout from "@/app/(landing)/layout";
import AppTitle from "@/components/app-title";
import { MultiSelect } from "@/components/multi-select";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { REJECTED } from "@/constants";
import { APP_LINK } from "@/constants/link_constant";
import { OrganizerInterface, PaymentMethodInterface } from "@/interfaces";
import { toastError, toastSuccess } from "@/lib/toast";
import { toTitleCase } from "@/lib/utils";
import {
  UpdateOrganizer,
  updateOrganizer,
} from "@/validations/organizer_validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Callout, Container, Flex, Grid } from "@radix-ui/themes";
import { Info, Loader, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type ApplicationInterface = {
  has_application: boolean;
  organizer: OrganizerInterface;
};

export default function Page() {
  const documentTypes = [
    { value: "KTP", label: "KTP" },
    { value: "NPWP", label: "NPWP" },
  ];
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [application, setApplication] = useState<ApplicationInterface>();
  const [paymentMethods, setPaymentMethods] = useState<
    PaymentMethodInterface[]
  >([]);
  const handleSelectedTypesChange = (types: string[]) => {
    form.setValue("required_documents", types);
    form.setValue(
      "uploaded_documents",
      types.map(() => ({ file: {} as File })) as any
    );
  };

  const form = useForm<UpdateOrganizer>({
    resolver: zodResolver(updateOrganizer),
    defaultValues: {
      organizer_name: "",
      description: "",
      website: "",
      instagram: "",
      twitter: "",
      facebook: "",
      address: "",
      city: "",
      province: "",
      postal_code: "",
      contact_person: "",
      contact_phone: "",
      contact_email: "",
      required_documents: [],
      uploaded_documents: [],
    },
  });

  const onGetApplicationStatus = async () => {
    setIsLoading(true);

    try {
      const response =
        (await handleGetApplicationStatus()) as ApplicationInterface;
      console.log(response);

      if (!response.has_application) {
        router.push(APP_LINK.VENDOR.REGISTER);
        return;
      }

      if (!response.organizer.paid_at) {
        router.push(APP_LINK.VENDOR.REQUEST);
        return;
      }

      if (
        response.organizer.application_status !== REJECTED ||
        response.organizer.verification_status !== REJECTED
      ) {
        router.push(APP_LINK.VENDOR.REQUEST);
        return;
      }

      form.setValue("organizer_name", response.organizer.organization_name);
      form.setValue("description", response.organizer.description);
      form.setValue("contact_person", response.organizer.contact_person);
      form.setValue("contact_phone", response.organizer.contact_phone);
      form.setValue("contact_email", response.organizer.contact_email);
      form.setValue("website", response.organizer.website);
      form.setValue("instagram", response.organizer.instagram);
      form.setValue("twitter", response.organizer.twitter);
      form.setValue("facebook", response.organizer.facebook);
      form.setValue("address", response.organizer.address);
      form.setValue("city", response.organizer.city);
      form.setValue("province", response.organizer.province);
      form.setValue("postal_code", response.organizer.postal_code);

      form.setValue(
        "required_documents",
        JSON.parse(response.organizer.required_documents)
      );

      setApplication(response);
    } catch (error) {
      router.push(APP_LINK.VENDOR.REGISTER);
    } finally {
      setIsLoading(false);
    }
  };

  const onGetPaymentMethod = async () => {
    try {
      const response = await handleGetPaymentMethod();

      setPaymentMethods(response);
    } catch (error) {}
  };

  const onHandleSubmit = async (data: UpdateOrganizer) => {
    console.log(data);

    setIsLoading(true);

    const formData = new FormData();
    formData.append("organization_name", data.organizer_name);
    formData.append("description", data.description);
    formData.append("website", data.website);
    formData.append("instagram", data.instagram);
    formData.append("twitter", data.twitter);
    formData.append("facebook", data.facebook);
    formData.append("address", data.address);
    formData.append("city", data.city);
    formData.append("province", data.province);
    formData.append("postal_code", data.postal_code);
    formData.append("contact_person", data.contact_person);
    formData.append("contact_phone", data.contact_phone);
    formData.append("contact_email", data.contact_email);

    data.required_documents?.map((item: any, index) => {
      formData.append(`required_documents[${index}]`, item);
    });

    data.uploaded_documents?.map((item: any, index) => {
      formData.append(`uploaded_documents[${index}]`, item.file);
    });

    try {
      const response = await handleResubmit(
        formData,
        application?.organizer.uuid as string
      );
      console.log(response);

      if (response.success?.status) {
        form.reset();
        toastSuccess(response.success.message);
        router.push(APP_LINK.VENDOR.REQUEST);
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
    onGetApplicationStatus();
    onGetPaymentMethod();
  }, []);

  if (!application) {
    return (
      <LandingLayout>
        <Container px={"4"} py={"9"}>
          <AppTitle
            title="Edit Application Request"
            description="Edit your application request here."
          />
        </Container>
      </LandingLayout>
    );
  }

  return (
    <LandingLayout>
      <Container px={"4"} py={"9"}>
        <AppTitle
          title="Edit Application Request"
          description="Edit your application request here."
        />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onHandleSubmit)}
            className="space-y-5"
          >
            <Callout.Root color="yellow">
              <Callout.Icon>
                <Info />
              </Callout.Icon>
              <Callout.Text>
                <strong>Rejection Reason:</strong>{" "}
                {application?.organizer.rejection_reason}
              </Callout.Text>
            </Callout.Root>

            <Card className="overflow-hidden shadow-none">
              <CardHeader>
                <CardTitle>Profile Organizer</CardTitle>
              </CardHeader>
              <CardContent className="">
                <Grid columns={{ initial: "1", md: "2" }} gap={"5"}>
                  <FormField
                    control={form.control}
                    name="organizer_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{toTitleCase(field.name)}</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            id={field.name}
                            {...form.register(field.name)}
                            disabled={isLoading}
                          />
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
                          <Input
                            id={field.name}
                            {...form.register(field.name)}
                            disabled={isLoading}
                          />
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
                          <Input
                            id={field.name}
                            {...form.register(field.name)}
                            disabled={isLoading}
                          />
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
                          <Input
                            id={field.name}
                            {...form.register(field.name)}
                            disabled={isLoading}
                          />
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
                          <Input
                            type="file"
                            onChange={(e) => field.onChange(e.target.files![0])}
                            disabled={isLoading}
                          />
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
                          <Input
                            type="file"
                            onChange={(e) => field.onChange(e.target.files![0])}
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
                      <FormItem className="md:col-span-2 col-span-1">
                        <FormLabel>{toTitleCase(field.name)}</FormLabel>
                        <FormControl>
                          <Textarea
                            id={field.name}
                            {...form.register(field.name)}
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

            <Card className="overflow-hidden shadow-none">
              <CardHeader>
                <CardTitle>Address of Organizer</CardTitle>
              </CardHeader>
              <CardContent className="">
                <Grid columns={{ initial: "1", md: "2" }} gap={"5"}>
                  <FormField
                    control={form.control}
                    name="province"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{toTitleCase(field.name)}</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            id={field.name}
                            {...form.register(field.name)}
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
                        <FormLabel>{toTitleCase(field.name)}</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            id={field.name}
                            {...form.register(field.name)}
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
                        <FormLabel>{toTitleCase(field.name)}</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            id={field.name}
                            {...form.register(field.name)}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{toTitleCase(field.name)}</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            id={field.name}
                            {...form.register(field.name)}
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

            <Card className="overflow-hidden shadow-none">
              <CardHeader>
                <CardTitle>Portfolio Organizer</CardTitle>
              </CardHeader>
              <CardContent className="">
                <Grid columns={{ initial: "1", md: "2" }} gap={"5"}>
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{toTitleCase(field.name)}</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            id={field.name}
                            {...form.register(field.name)}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="instagram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{toTitleCase(field.name)}</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            id={field.name}
                            {...form.register(field.name)}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="facebook"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{toTitleCase(field.name)}</FormLabel>
                        <FormControl>
                          <Input
                            id={field.name}
                            {...form.register(field.name)}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="twitter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{toTitleCase(field.name)}</FormLabel>
                        <FormControl>
                          <Input
                            id={field.name}
                            {...form.register(field.name)}
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

            <Card className="overflow-hidden shadow-none">
              <CardHeader>
                <CardTitle>Portfolio Organizer</CardTitle>
              </CardHeader>
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
                            defaultValue={
                              form.watch("required_documents") ?? []
                            }
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
                              {form.getValues("required_documents")![index]}
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

            <Flex justify={"end"}>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader className="animate-spin" /> : <Send />}
                Resubmit
              </Button>
            </Flex>
          </form>
        </Form>
      </Container>
    </LandingLayout>
  );
}
