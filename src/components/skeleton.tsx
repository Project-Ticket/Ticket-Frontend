import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Flex, Grid } from "@radix-ui/themes";

export default function SkeletonTable() {
  return (
    <Flex direction={"column"} className="space-y-3">
      <Grid columns={"12"} className="space-x-3 space-y-3">
        <Skeleton className="h-9 col-span-12 w-full" />
        <Skeleton className="h-9 col-span-3" />
        <Skeleton className="h-9 col-span-3" />
        <Skeleton className="h-9 col-span-3" />
        <Skeleton className="h-9 col-span-3 w-full" />
        <Skeleton className="h-9 col-span-3" />
        <Skeleton className="h-9 col-span-3" />
        <Skeleton className="h-9 col-span-3" />
        <Skeleton className="h-9 col-span-3 w-full" />
        <Skeleton className="h-9 col-span-3" />
        <Skeleton className="h-9 col-span-3" />
        <Skeleton className="h-9 col-span-3" />
        <Skeleton className="h-9 col-span-3 w-full" />
      </Grid>
    </Flex>
  );
}

export function SkeletonCard({ color }: { color?: string }) {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className={cn("h-[150px] w-full rounded-xl", color)} />
      <div className="space-y-2">
        <Skeleton className={cn("h-7 w-full", color)} />
        <Skeleton className={cn("h-7 w-full", color)} />
        <Skeleton className={cn("h-7 w-full", color)} />
      </div>
    </div>
  );
}

export function LoaderCard({ count }: { count?: number }) {
  let totalCount = count ? count - 1 : 0;

  return (
    <Grid columns={{ initial: "1", sm: "2", md: String(count) }} gap={"5"}>
      <SkeletonCard color="bg-gray-400" />
      {totalCount > 0
        ? Array.from({ length: totalCount }).map((_, i) => (
            <SkeletonCard color="bg-gray-400" key={i} />
          ))
        : null}
    </Grid>
  );
}
