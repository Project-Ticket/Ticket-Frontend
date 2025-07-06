"use client";

import { handleGetApplicationStatus } from "@/actions/organizer";
import LandingLayout from "@/components/layout/landing";
import { APP_LINK } from "@/constants/link_constant";
import { OrganizerInterface } from "@/interfaces";
import { useEffect, useState } from "react";
import Payment from "./payment";
import { useRouter } from "next/navigation";
import Invoice from "./invoice";
import { Container, Flex } from "@radix-ui/themes";
import AppTitle from "@/components/app-title";
import { Separator } from "@/components/ui/separator";

type ApplicationInterface = {
  has_application: boolean;
  organizer: OrganizerInterface;
};

export default function Page() {
  const router = useRouter();
  const [application, setApplication] = useState<ApplicationInterface>();

  const onGetApplicationStatus = async () => {
    try {
      const response =
        (await handleGetApplicationStatus()) as ApplicationInterface;

      if (!response.has_application) {
        router.push(APP_LINK.VENDOR.REGISTER);
        return;
      }

      setApplication(response);
    } catch (error) {
      router.push(APP_LINK.VENDOR.REGISTER);
    }
  };

  useEffect(() => {
    onGetApplicationStatus();
  }, []);

  if (!application) {
    return (
      <LandingLayout>
        <Container px={"4"} py={"9"}>
          <AppTitle
            title="Event Organizer Application"
            description="Payment Status & Application Details"
          />
        </Container>
      </LandingLayout>
    );
  }

  return (
    <LandingLayout>
      <Payment application={application} />
      {application && application.organizer.paid_at && (
        <>
          <Flex justify={"center"}>
            <Separator className="max-w-sm" />
          </Flex>
          <Invoice application={application} />
        </>
      )}
    </LandingLayout>
  );
}
