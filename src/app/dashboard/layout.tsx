import AppFooter from "@/components/dashboard/app-footer";
import AppHeader from "@/components/dashboard/app-header";
import { Box } from "@radix-ui/themes";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box className="min-h-screen bg-gray-50 flex">
      <Box className="flex-1 min-h-[93vh]">
        <AppHeader />
        <Box className="p-4 lg:p-8">{children}</Box>
      </Box>
      <AppFooter />
    </Box>
  );
}
