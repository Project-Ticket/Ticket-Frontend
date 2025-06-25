"use client";

import { cn, toTitleCase } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { APP_LINK } from "@/constants/link_constant";
import {
  BadgeDollarSign,
  ChevronLeft,
  ChevronRight,
  File,
  GitBranch,
  Map,
  Send,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext } from "react-hook-form";
import { useState } from "react";
import { toastError, toastSuccess } from "@/lib/toast";
import LandingLayout from "@/components/layout/landing";
import { Container, Grid } from "@radix-ui/themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  createAddressOrganizer,
  CreateAddressOrganizer,
  createBankOrganizer,
  CreateBankOrganizer,
  CreateDocumentOrganizer,
  createDocumentOrganizer,
  CreateOrganizer,
  createPortfolioOrganizer,
  CreatePortfolioOrganizer,
  createProfileOrganizer,
  CreateProfileOrganizer,
} from "@/validations/organizer_validation";
import { handleRegister } from "@/actions/organizer";
import { defineStepper } from "@/components/stepper";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect } from "@/components/multi-select";
import { useIsMobile } from "@/hooks/use-mobile";

const {
  StepperProvider,
  StepperControls,
  StepperNavigation,
  StepperStep,
  StepperTitle,
  useStepper,
} = defineStepper(
  {
    id: "document",
    title: "Document Organizer",
    schema: createDocumentOrganizer,
    Component: DocumentForm,
    icon: <File />,
  },
  {
    id: "profile",
    title: "Profile Organizer",
    schema: createProfileOrganizer,
    Component: ProfileForm,
    icon: <GitBranch />,
  },
  {
    id: "address",
    title: "Address of Organizer",
    schema: createAddressOrganizer,
    Component: AddressForm,
    icon: <Map />,
  },
  {
    id: "bank",
    title: "Bank Account",
    schema: createBankOrganizer,
    Component: BankForm,
    icon: <BadgeDollarSign />,
  },

  {
    id: "portfolio",
    title: "Portfolio Organizer",
    schema: createPortfolioOrganizer,
    Component: PortfolioForm,
    icon: <Send />,
  }
);

export default function VendorRegisterPage() {
  const isMobile = useIsMobile();
  return (
    <LandingLayout>
      <Container px={"4"} py={"9"}>
        <StepperProvider variant={cn(isMobile ? "vertical" : "horizontal")}>
          <FormStepperComponent />
        </StepperProvider>
      </Container>
    </LandingLayout>
  );
}

function FormStepperComponent() {
  const methods = useStepper();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<CreateOrganizer>();

  const form = useForm({
    mode: "onTouched",
    resolver: zodResolver(methods.current.schema as any),
  });

  const onSubmit = async () => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("organization_name", data?.organizer_name || "");
    formData.append("description", data?.description || "");
    formData.append("logo", data?.logo || "");
    formData.append("banner", data?.banner || "");
    formData.append("website", data?.website || "");
    formData.append("instagram", data?.instagram || "");
    formData.append("twitter", data?.twitter || "");
    formData.append("facebook", data?.facebook || "");
    formData.append("address", data?.address || "");
    formData.append("city", data?.city || "");
    formData.append("province", data?.province || "");
    formData.append("postal_code", data?.postal_code || "");
    formData.append("contact_person", data?.contact_person || "");
    formData.append("contact_phone", data?.contact_phone || "");
    formData.append("contact_email", data?.contact_email || "");
    formData.append("bank_name", data?.bank_name || "");
    formData.append("bank_account_name", data?.bank_account_name || "");
    formData.append("bank_account_number", data?.bank_account_number || "");

    data?.required_documents?.map((item, index) => {
      formData.append(`required_documents[${index}]`, item.file);
    });
    data?.uploaded_documents?.map((item, index) => {
      formData.append(`uploaded_documents[${index}]`, item.file);
    });

    try {
      const response = await handleRegister(formData);

      if (response.success?.status) {
        form.reset();
        toastSuccess(response.success.message);
        window.location.href = APP_LINK.VENDOR.REQUESTS;
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <StepperNavigation className="mb-10">
          {methods.all.map((step) => (
            <StepperStep
              key={step.id}
              of={step.id}
              type={step.id === methods.current.id ? "submit" : "button"}
              onClick={async () => {
                const valid = await form.trigger();
                if (!valid) return;
                methods.goTo(step.id);
              }}
              icon={step.icon}
            >
              <StepperTitle>{step.title}</StepperTitle>
            </StepperStep>
          ))}
        </StepperNavigation>
        {methods.switch({
          document: ({ Component }) => <Component isLoading={isLoading} />,
          profile: ({ Component }) => <Component isLoading={isLoading} />,
          address: ({ Component }) => <Component isLoading={isLoading} />,
          bank: ({ Component }) => <Component isLoading={isLoading} />,
          portfolio: ({ Component }) => <Component isLoading={isLoading} />,
        })}
        <StepperControls>
          {!methods.isLast && (
            <Button
              variant="secondary"
              onClick={methods.prev}
              disabled={methods.isFirst}
            >
              <ChevronLeft /> Previous
            </Button>
          )}
          <Button
            type={"submit"}
            disabled={isLoading}
            onClick={() => {
              if (methods.isLast) {
                setData(form.getValues());
                return;
              }
              methods.beforeNext(async () => {
                const valid = await form.trigger();
                if (!valid) return false;
                setData(form.getValues());
                return true;
              });
            }}
          >
            {methods.isLast ? (
              <>
                <Send /> Send
              </>
            ) : (
              <>
                Next <ChevronRight />
              </>
            )}
          </Button>
        </StepperControls>
      </form>
    </Form>
  );
}

function ProfileForm({ isLoading }: { isLoading: boolean }) {
  const form = useFormContext<CreateProfileOrganizer>();

  return (
    <div className="space-y-10">
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
    </div>
  );
}

function AddressForm({ isLoading }: { isLoading: boolean }) {
  const form = useFormContext<CreateAddressOrganizer>();

  return (
    <div className="space-y-10">
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
    </div>
  );
}

function BankForm({ isLoading }: { isLoading: boolean }) {
  const form = useFormContext<CreateBankOrganizer>();

  return (
    <div className="space-y-10">
      <Card className="overflow-hidden shadow-none">
        <CardHeader>
          <CardTitle>Bank Organizer</CardTitle>
        </CardHeader>
        <CardContent className="">
          <Grid columns={{ initial: "1", md: "2" }} gap={"5"}>
            <FormField
              control={form.control}
              name="bank_name"
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
              name="bank_account_name"
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
              name="bank_account_number"
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
    </div>
  );
}

function PortfolioForm({ isLoading }: { isLoading: boolean }) {
  const form = useFormContext<CreatePortfolioOrganizer>();

  return (
    <div className="space-y-10">
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
    </div>
  );
}

function DocumentForm({ isLoading }: { isLoading: boolean }) {
  const documentTypes = [
    { value: "KTP", label: "KTP" },
    { value: "NPWP", label: "NPWP" },
  ];
  const form = useFormContext<CreateDocumentOrganizer>();

  const handleSelectedTypesChange = (types: string[]) => {
    form.setValue("required_documents", types);
    form.setValue(
      "uploaded_documents",
      types.map(() => ({ file: {} as File }))
    );
  };

  return (
    <div className="space-y-10">
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
                          onChange={(e) => field.onChange(e.target.files?.[0])}
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
    </div>
  );
}
