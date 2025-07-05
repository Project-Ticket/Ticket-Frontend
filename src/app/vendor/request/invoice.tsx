import AppTitle from "@/components/app-title";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { OrganizerInterface } from "@/interfaces";
import { formatRupiah } from "@/lib/utils";
import { Box, Container, Flex, Grid, Heading, Text } from "@radix-ui/themes";
import { format } from "date-fns";
import {
  Building2,
  CheckCircle,
  FileText,
  Mail,
  Phone,
  Timer,
} from "lucide-react";

type ApplicationInterface = {
  has_application: boolean;
  organizer: OrganizerInterface;
};

export default function Invoice({
  application,
}: {
  application: ApplicationInterface;
}) {
  const tax = parseInt(application?.organizer?.application_fee) * 0.11;

  return (
    <Container px={"4"} py={"9"}>
      <Card className="shadow-xs pt-0">
        <CardHeader className="bg-gradient-to-br from-indigo-500  to-indigo-800 pt-6 pb-3 rounded-t-xl text-white">
          <Flex align={"center"} justify={"between"}>
            <Grid>
              <CardTitle className="text-2xl">Invoice</CardTitle>
              <CardDescription className="text-white">
                Event Organizer Application Fee
              </CardDescription>
            </Grid>
            <Grid className="text-end">
              <CardTitle>Event.io</CardTitle>
              <CardDescription className="text-white">
                Professional Event Platform
              </CardDescription>
            </Grid>
          </Flex>
        </CardHeader>
        <CardContent className="space-y-5">
          <Grid columns={{ initial: "1", md: "2" }} gap={"5"}>
            <Box className="space-y-3">
              <CardTitle>Bill To:</CardTitle>
              <Card className="bg-muted shadow-xs">
                <CardContent className="space-y-3 lg:space-y-2">
                  <Flex gap={"3"} align={"center"}>
                    <Avatar className="size-12">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl">
                        {application?.organizer.organization_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <Grid gap={"2"}>
                      <CardTitle className="text-xl line-clamp-1">
                        {application?.organizer.organization_name}
                      </CardTitle>
                      <Text className="line-clamp-1">
                        Contact: {application.organizer.contact_person}
                      </Text>
                    </Grid>
                  </Flex>
                  <Flex
                    gap={"2"}
                    align={{ initial: "start", md: "center" }}
                    direction={{ initial: "column", md: "row" }}
                  >
                    <Mail size={16} />
                    <Text>{application?.organizer.contact_email}</Text>
                  </Flex>
                  <Flex
                    gap={"2"}
                    align={{ initial: "start", md: "center" }}
                    direction={{ initial: "column", md: "row" }}
                  >
                    <Phone size={16} />
                    <Text>{application?.organizer.contact_phone}</Text>
                  </Flex>
                  <Flex
                    gap={"2"}
                    align={{ initial: "start", md: "center" }}
                    direction={{ initial: "column", md: "row" }}
                  >
                    <Building2 size={16} />
                    <Text>{`${application?.organizer.address}, ${application?.organizer.city}, ${application?.organizer.province}, ${application?.organizer.postal_code}`}</Text>
                  </Flex>
                </CardContent>
              </Card>
            </Box>
            <Box className="space-y-5">
              <CardTitle>Invoice Details:</CardTitle>
              <Box className="space-y-3">
                <Flex align={"center"} justify={"between"}>
                  <Label className="font-normal">Invoice Reference:</Label>
                  <Text weight={"bold"} className="capitalize">
                    {application.organizer.payment_reference}
                  </Text>
                </Flex>
                <Flex align={"center"} justify={"between"}>
                  <Label className="font-normal">Issue Date:</Label>
                  <Text weight={"bold"} className="capitalize">
                    {format(application.organizer.created_at || "", "PPP")}
                  </Text>
                </Flex>
                <Flex align={"center"} justify={"between"}>
                  <Label className="font-normal">Payment Method:</Label>
                  <Text weight={"bold"} className="capitalize">
                    {application.organizer.payment_method}
                  </Text>
                </Flex>
                <Card className="bg-green-50 border-green-400 shadow-none p-4">
                  <CardContent className="space-y-3 px-0">
                    <Flex align={"center"} gap={"2"}>
                      <CheckCircle size={16} className="text-green-700" />
                      <CardTitle className="capitalize text-green-700">
                        Payment Completed
                      </CardTitle>
                    </Flex>
                    <CardDescription className="text-green-600">
                      Paid on{" "}
                      {format(application.organizer.paid_at || "", "PPP")}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Grid>

          <Box className="mb-8">
            <Heading size={"4"} mb={"3"}>
              Invoice Items:
            </Heading>
            <Box overflowX={"auto"}>
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit Price
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-500" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            Event Organizer Application Fee
                          </div>
                          <div className="text-sm text-gray-500">
                            Registration and verification process
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-900">
                      1
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-900">
                      {formatRupiah(
                        parseInt(application.organizer.application_fee)
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                      {formatRupiah(
                        parseInt(application.organizer.application_fee)
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Box>
          </Box>

          <Flex justify={"end"}>
            <Box className="w-full max-w-sm">
              <Box className="bg-gray-50 rounded-lg p-6">
                <Box className="space-y-3">
                  <Flex justify={"between"} className="text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">
                      {formatRupiah(
                        parseInt(application.organizer.application_fee)
                      )}
                    </span>
                  </Flex>
                  <Flex justify={"between"} className="text-sm">
                    <span className="text-gray-600">PPN (11%):</span>
                    <span className="font-medium">{formatRupiah(tax)}</span>
                  </Flex>
                  <Box className="border-t pt-3">
                    <Flex justify={"between"}>
                      <span className="text-lg font-semibold text-gray-900">
                        Total:
                      </span>
                      <span className="text-lg font-bold text-blue-600">
                        {formatRupiah(
                          parseInt(application.organizer.application_fee) + tax
                        )}
                      </span>
                    </Flex>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Flex>
        </CardContent>
      </Card>
    </Container>
  );
}
