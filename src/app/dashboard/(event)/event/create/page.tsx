"use client";

import { handleGetCategory } from "@/actions/event";
import AppTitle from "@/components/app-title";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { API_LINK } from "@/constants/api_constant";
import { APP_LINK } from "@/constants/link_constant";
import { CategoryInterface } from "@/interfaces";
import {
  createEventGeneral,
  CreateEventGeneral,
} from "@/validations/event_validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Grid, Heading } from "@radix-ui/themes";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function Page() {
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const form = useForm<CreateEventGeneral>({
    resolver: zodResolver(createEventGeneral),
    mode: "onTouched",
  });

  const onGetCategories = async () => {
    try {
      const response = await handleGetCategory();
      console.log(response);

      setCategories(response);
    } catch (error) {}
  };

  useEffect(() => {
    onGetCategories();
  }, []);

  return (
    <div>
      <AppTitle title="Create new event">
        <Link
          href={APP_LINK.DASHBOARD.EVENT.DEFAULT}
          className={buttonVariants({ variant: "outline" })}
        >
          <ChevronLeft /> Back
        </Link>
      </AppTitle>

      <Grid columns={"12"} className="mb-5">
        <Box className="col-span-12 md:col-span-3 md:!block !hidden">
          <Heading size={"4"} weight={"medium"}>
            Target Campaign
          </Heading>
        </Box>
        <Card className="col-span-12 md:col-span-9">
          <CardHeader className="md:hidden block">
            <CardTitle>Target Campaign</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <Box>
              {/* <FormField
                  control={state.formCampaign.control}
                  name="donation_target_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="donation_target_amount">
                        Target Donation
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="donation_target_amount"
                          className="w-full shadow-none"
                          {...field}
                          value={field.value ?? ""}
                          disabled={state.isLoading}
                          autoComplete="donation_target_amount"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </div>
  );
}
