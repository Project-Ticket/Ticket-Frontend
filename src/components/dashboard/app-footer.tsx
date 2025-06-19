import { Flex, Text } from "@radix-ui/themes";
import Link from "next/link";

export default function AppFooter({}: {}) {
  return (
    <footer className="flex-1">
      <div className="max-w-8xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <Flex
          direction={{ initial: "column", md: "row" }}
          justify={{ md: "between" }}
          align={"center"}
        >
          <Text className="text-gray-400 text-sm">
            © {new Date().getFullYear()}{" "}
            <Text className="font-semibold">Sawer</Text>. All rights reserved.
          </Text>
          <Flex className="space-x-6 mt-4 md:mt-0">
            <Link
              href="/terms"
              className="text-gray-400 text-sm hover:text-teal-400 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="text-gray-400 text-sm hover:text-teal-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/cookies"
              className="text-gray-400 text-sm hover:text-teal-400 transition-colors"
            >
              Cookie Policy
            </Link>
          </Flex>
        </Flex>
      </div>
    </footer>
  );
}
