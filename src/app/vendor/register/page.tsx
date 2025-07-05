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
  Info,
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
import { useEffect, useState } from "react";
import { toastError, toastSuccess } from "@/lib/toast";
import LandingLayout from "@/components/layout/landing";
import { Callout, Container, Grid } from "@radix-ui/themes";
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
import {
  handleGetApplicationStatus,
  handleRegister,
} from "@/actions/organizer";
import { defineStepper } from "@/components/stepper";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect } from "@/components/multi-select";
import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";
import { PaymentMethodInterface, UserInterface } from "@/interfaces";
import { getCookie } from "cookies-next";
import { TOKEN_SETTING } from "@/constants";
import { handleGetPaymentMethod } from "@/actions/payment";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

const {
  StepperProvider,
  StepperControls,
  StepperNavigation,
  StepperStep,
  StepperTitle,
  useStepper,
} = defineStepper(
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
  },
  {
    id: "document",
    title: "Document Organizer",
    schema: createDocumentOrganizer,
    Component: DocumentForm,
    icon: <File />,
  }
);

export default function VendorRegisterPage() {
  const isMobile = useIsMobile();
  const router = useRouter();
  const [user, setUser] = useState<UserInterface>();

  const onGetMyApplicationStatus = async () => {
    try {
      const response = (await handleGetApplicationStatus()) as {
        has_application: boolean;
      };

      if (response.has_application) {
        router.push(APP_LINK.VENDOR.REQUEST);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (getCookie(TOKEN_SETTING.USER)) {
      setUser(JSON.parse(getCookie(TOKEN_SETTING.USER) as string));
    }

    onGetMyApplicationStatus();
  }, []);

  return (
    <LandingLayout>
      <Container px={"4"} py={"9"}>
        {user && !user.phone && (
          <Callout.Root className="mb-10" color="yellow">
            <Callout.Icon>
              <Info />
            </Callout.Icon>
            <Callout.Text>
              <strong>Please!!!</strong> complete your profile before
              registering as an Event Organizer in{" "}
              <Link
                href={APP_LINK.SETTINGS.DEFAULT}
                className="cursor-pointer underline"
              >
                here
              </Link>
            </Callout.Text>
          </Callout.Root>
        )}
        <StepperProvider variant={isMobile ? "vertical" : "horizontal"}>
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
  const [paymentMethods, setPaymentMethods] = useState<
    PaymentMethodInterface[]
  >([]);

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

    data?.required_documents?.map((item: any, index) => {
      formData.append(`required_documents[${index}]`, item.file);
    });
    data?.uploaded_documents?.map((item: any, index) => {
      formData.append(`uploaded_documents[${index}]`, item.file);
    });

    formData.append("payment_method", data?.payment_method || "");

    try {
      const response = await handleRegister(formData);

      // const response = {
      //   success: {
      //     status: true,
      //     message: "success",
      //     data: {
      //       event_organizer: {
      //         user_id: 4,
      //         organization_name: "Tech Event Solutions",
      //         organization_slug: "tech-event-solutions",
      //         description:
      //           "We are a professional event organizer specializing in technology conferences, workshops, and corporate events. With over 5 years of experience, we deliver exceptional experiences.",
      //         logo: "event-organizers/logos/fqePSMpIHi7pNVvhPzF57cbHZdj9Er3XOcTQTErv.jpg",
      //         banner:
      //           "event-organizers/banners/u3GY5T0wAwJLX3ymCzYEKWUKsT05BRHxY82IqrBt.jpg",
      //         website: "https://www.techevent.com",
      //         instagram: "https://www.instagram.com/techevent",
      //         twitter: "https://www.twitter.com/techevent",
      //         facebook: "https://www.facebook.com/techevent",
      //         address: "Jl. Sudirman No. 123, Kav. 45-46",
      //         city: "Jakarta Selatan",
      //         province: "DKI Jakarta",
      //         postal_code: "12190",
      //         contact_person: "John Doe",
      //         contact_phone: "+62-21-12345678",
      //         contact_email: "contact@techevent.com",
      //         application_fee: 100000,
      //         security_deposit: null,
      //         required_documents: '["Business License"]',
      //         uploaded_documents:
      //           '["event-organizers\\/documents\\/1574329091_E_KTP_thumb_organizer_20250705231918.jpg"]',
      //         application_submitted_at: "2025-07-05T16:19:18.000000Z",
      //         verification_status: "pending",
      //         application_status: "pending",
      //         status: 1,
      //         uuid: "b9e18807-befc-41b9-9204-8c410df72c71",
      //         updated_at: "2025-07-05T16:19:20.000000Z",
      //         created_at: "2025-07-05T16:19:18.000000Z",
      //         id: 1,
      //         payment_reference: "686950872bb5274445bebb31",
      //         payment_method: "QRIS",
      //         user: {
      //           id: 4,
      //           name: "John Doe",
      //           email: "organizer@mailinator.com",
      //         },
      //       },
      //       payment_url:
      //         "https://checkout-staging.xendit.co/web/686950872bb5274445bebb31",
      //       invoice_id: "686950872bb5274445bebb31",
      //       total_amount: 100700,
      //       payment_method: "QRIS",
      //     },
      //   },
      //   error: {
      //     message: "error",
      //   },
      // };

      if (response.success?.status) {
        form.reset();
        toastSuccess(response.success.message);
        window.open(response.success.data.payment_url, "_blank");
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

  const onGetPaymentMethod = async () => {
    try {
      const response = await handleGetPaymentMethod();

      setPaymentMethods(response);
    } catch (error) {}
  };

  useEffect(() => {
    onGetPaymentMethod();
  }, []);

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
          profile: ({ Component }) => <Component isLoading={isLoading} />,
          address: ({ Component }) => <Component isLoading={isLoading} />,
          bank: ({ Component }) => (
            <Component isLoading={isLoading} paymentMethods={paymentMethods} />
          ),
          portfolio: ({ Component }) => <Component isLoading={isLoading} />,
          document: ({ Component }) => (
            <Component isLoading={isLoading} paymentMethods={paymentMethods} />
          ),
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

function BankForm({
  isLoading,
  paymentMethods,
}: {
  isLoading: boolean;
  paymentMethods: PaymentMethodInterface[];
}) {
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
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map((paymentMethod) => (
                          <SelectItem
                            key={paymentMethod.id}
                            value={paymentMethod.name}
                          >
                            {paymentMethod.name}
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

function DocumentForm({
  isLoading,
  paymentMethods,
}: {
  isLoading: boolean;
  paymentMethods: PaymentMethodInterface[];
}) {
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

            <FormField
              control={form.control}
              name="payment_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{toTitleCase(field.name)}</FormLabel>
                  <FormControl>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map((paymentMethod) => (
                          <SelectItem
                            key={paymentMethod.id}
                            value={paymentMethod.code}
                          >
                            {paymentMethod.name}
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
        </CardContent>
      </Card>
    </div>
  );
}
