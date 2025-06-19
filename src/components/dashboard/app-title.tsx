import { Heading, Text } from "@radix-ui/themes";
import { cn } from "@/lib/utils";

export default function AppTitle({
  title = "Dashboard",
  description,
  className,
}: {
  title: string;
  description?: any;
  className?: string;
}) {
  return (
    <header className={cn("mb-8", className)}>
      <Heading className="!text-2xl font-bold">{title}</Heading>
      {description && <Text className="text-gray-600 mt-2">{description}</Text>}
    </header>
  );
}
