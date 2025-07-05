"use client";

import { handleRegeneratePayment } from "@/actions/organizer";
import { handleGetPaymentMethod } from "@/actions/payment";
import AppTitle from "@/components/app-title";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { OrganizerInterface, PaymentMethodInterface } from "@/interfaces";
import { toastError, toastSuccess } from "@/lib/toast";
import { formatRupiah } from "@/lib/utils";
import { Box, Container, Flex, Grid, Text } from "@radix-ui/themes";
import { format } from "date-fns";
import {
  CheckCircle,
  Clock,
  ExternalLink,
  FileText,
  Loader,
  Mail,
  MapPin,
  Phone,
  RefreshCcw,
  Save,
  Timer,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ApplicationInterface = {
  has_application: boolean;
  organizer: OrganizerInterface;
};

export default function Payment({
  application,
}: {
  application: ApplicationInterface;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<string>(
    application.organizer.payment_method || ""
  );
  const [paymentMethods, setPaymentMethods] = useState<
    PaymentMethodInterface[]
  >([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const onHandleRegenerate = async () => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append(
      "payment_method",
      paymentMethod || application?.organizer.payment_method || ""
    );

    try {
      const response = await handleRegeneratePayment(
        application?.organizer.uuid || "",
        formData
      );

      if (response.success?.status) {
        setIsDialogOpen(false);
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

  useEffect(() => {
    if (paymentMethods.length > 0 && application) {
      setPaymentMethod(application.organizer.payment_method || "");
    }
  }, [paymentMethods, application]);

  return (
    <>
      <Container px={"4"} py={"9"}>
        <AppTitle
          title="Event Organizer Application"
          description="Payment Status & Application Details"
        />

        <Card className="shadow-xs">
          <CardContent className="space-y-5">
            <Grid columns={"3"} gap={"4"}>
              <Grid gap={"4"} className="col-span-3 lg:col-span-2">
                <Flex gap={"3"} align={"center"}>
                  <Avatar className="size-12">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl">
                      {application?.organizer.organization_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Grid gap={"2"}>
                    <CardTitle className="text-xl">
                      {application?.organizer.organization_name}
                    </CardTitle>
                    <Badge className="capitalize">
                      <Timer />
                      {application?.organizer.application_status}
                    </Badge>
                  </Grid>
                </Flex>
                <Text size={"3"}>{application?.organizer.description}</Text>
                <Grid columns={{ initial: "1", sm: "2" }} gap={"4"}>
                  <Flex align={"center"} gap={"3"}>
                    <Phone size={"16"} />
                    <Text size={"2"}>
                      {application?.organizer.contact_phone}
                    </Text>
                  </Flex>
                  <Flex align={"center"} gap={"3"}>
                    <Mail size={"16"} />
                    <Text size={"2"}>
                      {application?.organizer.contact_email}
                    </Text>
                  </Flex>
                  <Flex align={"center"} gap={"3"}>
                    <MapPin size={"16"} />
                    <Text size={"2"}>
                      {application?.organizer.city},{" "}
                      {application?.organizer.province}
                    </Text>
                  </Flex>
                  <Flex
                    align={"center"}
                    gap={"3"}
                    className="cursor-pointer text-indigo-500"
                  >
                    <ExternalLink size={"16"} />
                    <Text size={"2"} asChild>
                      <Link
                        target="_blank"
                        href={application?.organizer.website || ""}
                      >
                        Website
                      </Link>
                    </Text>
                  </Flex>
                </Grid>
              </Grid>
              <Box className="col-span-3 lg:col-span-1">
                <Card className="shadow-xs bg-muted">
                  <CardHeader>
                    <CardTitle>Application Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <Flex
                      align={{ initial: "start", lg: "center" }}
                      justify={"between"}
                      direction={{ initial: "column", lg: "row" }}
                    >
                      <Label className="font-light">Application Fee :</Label>
                      <Text weight={"bold"} className="capitalize">
                        {formatRupiah(
                          parseInt(
                            application?.organizer.application_fee || "0"
                          )
                        )}
                      </Text>
                    </Flex>
                    <Flex
                      align={{ initial: "start", lg: "center" }}
                      justify={"between"}
                      direction={{ initial: "column", lg: "row" }}
                    >
                      <Label className="font-light">Payment Method :</Label>
                      <Text weight={"bold"} className="capitalize">
                        {application?.organizer.payment_method}
                      </Text>
                    </Flex>
                    <Flex
                      align={{ initial: "start", lg: "center" }}
                      justify={"between"}
                      direction={{ initial: "column", lg: "row" }}
                    >
                      <Label className="font-light">Reference :</Label>
                      <Text weight={"bold"} className="capitalize">
                        {application?.organizer.payment_reference}
                      </Text>
                    </Flex>
                    <Flex
                      align={{ initial: "start", lg: "center" }}
                      justify={"between"}
                      direction={{ initial: "column", lg: "row" }}
                    >
                      <Label className="font-light">Submitted :</Label>
                      <Text weight={"bold"} className="capitalize">
                        {format(application?.organizer.created_at || "", "PPP")}
                      </Text>
                    </Flex>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
            <Card className="bg-yellow-50 border-yellow-200">
              <CardHeader>
                <Flex
                  align={{ initial: "start", md: "center" }}
                  justify={"between"}
                  gap={"3"}
                  direction={{ initial: "column", md: "row" }}
                >
                  <Flex align={{ initial: "start", md: "center" }} gap={"3"}>
                    <Clock className="text-yellow-700" />
                    <Grid gap={"1"}>
                      <CardTitle className="text-yellow-900">
                        Payment Pending
                      </CardTitle>
                      <CardDescription className="text-yellow-700">
                        Complete your payment to activate your organizer account
                      </CardDescription>
                    </Grid>
                  </Flex>

                  <Box>
                    <Button
                      variant={"warning"}
                      onClick={() => setIsDialogOpen(true)}
                    >
                      <RefreshCcw /> Regenerate Payment Link
                    </Button>
                  </Box>
                </Flex>
              </CardHeader>
              <CardContent>
                <Grid columns={{ initial: "1", sm: "2" }} gap={"3"}>
                  <Grid>
                    <Label className="text-yellow-700">Amount Due:</Label>
                    <Text
                      weight={"bold"}
                      className="capitalize text-yellow-900"
                    >
                      {formatRupiah(
                        parseInt(application?.organizer.application_fee || "0")
                      )}
                    </Text>
                  </Grid>
                  <Grid>
                    <Label className="text-yellow-700">Payment Method:</Label>
                    <Text
                      weight={"bold"}
                      className="capitalize text-yellow-900"
                    >
                      {application?.organizer.payment_method}
                    </Text>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card className="shadow-xs bg-muted">
              <CardHeader>
                <Flex align={"center"} gap={"3"}>
                  <FileText className="text-indigo-500" />
                  <CardTitle>Required Documents</CardTitle>
                </Flex>
              </CardHeader>
              <CardContent className="space-y-5">
                <Grid columns={{ initial: "1", sm: "2" }} gap={"3"}>
                  <Grid>
                    <Label>Required:</Label>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {JSON.parse(
                        application?.organizer.required_documents || ""
                      ).map((doc: string, index: number) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 capitalize"
                        >
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </Grid>
                  <Grid>
                    <Label>Uploaded:</Label>
                    {JSON.parse(application?.organizer.uploaded_documents || "")
                      .length > 0 ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        {
                          JSON.parse(
                            application?.organizer.uploaded_documents || ""
                          ).length
                        }{" "}
                        document(s) uploaded
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-yellow-600">
                        <Clock className="w-4 h-4" />
                        No documents uploaded
                      </div>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </Container>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="flex gap-3 items-center">
              <RefreshCcw /> Regenerate Payment Link
            </DialogTitle>
          </DialogHeader>
          <form
            className="mt-5 space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              onHandleRegenerate();
            }}
          >
            <Grid>
              <Label className="mb-2">Payment Method</Label>
              <Select
                defaultValue={paymentMethod}
                onValueChange={setPaymentMethod}
                value={paymentMethod}
                required
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
            </Grid>

            <CardFooter className="px-0 justify-end gap-3">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader className="animate-spin" /> : <Save />}
                Regenerate Payment Link
              </Button>
            </CardFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
