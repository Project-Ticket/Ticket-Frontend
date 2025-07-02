import { Flex, Text } from "@radix-ui/themes";

export default function DataNotFound({
  message = "No data found",
}: {
  message?: string;
}) {
  return (
    <Flex
      direction={"column"}
      align={"center"}
      justify={"center"}
      className="py-10"
    >
      <Text>{message}</Text>
    </Flex>
  );
}
