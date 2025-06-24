import AppTitle from "@/components/app-title";
import { Button, buttonVariants } from "@/components/ui/button";
import { APP_LINK } from "@/constants/link_constant";
import { Grid } from "@radix-ui/themes";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div>
      <AppTitle title="All Events">
        <Link
          href={APP_LINK.DASHBOARD.EVENT.CREATE}
          className={buttonVariants({ variant: "primary" })}
        >
          <Plus /> Add new event
        </Link>
      </AppTitle>
      <Grid columns={"4"} gap={"4"}></Grid>
    </div>
  );
}
