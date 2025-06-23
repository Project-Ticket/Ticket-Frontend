import { Heading, Text } from "@radix-ui/themes";
import { cn } from "@/lib/utils";

export default function AppTitle({
  title = "Dashboard",
  description,
  className,
  children,
}: {
  title: string;
  description?: any;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <header
      className={cn(
        "mt-1 mb-7 flex items-center justify-between space-y-2",
        className
      )}
    >
      <div>
        <Heading className="!text-2xl font-bold !tracking-tight">
          {title}
        </Heading>
        {description && (
          <Text className="text-gray-600 mt-2">{description}</Text>
        )}
      </div>
      {children}
    </header>
  );
}
