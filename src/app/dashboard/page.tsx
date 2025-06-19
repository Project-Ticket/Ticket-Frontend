import { Flex } from "@radix-ui/themes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function DashboardPage() {
  return (
    <Flex gap={"4"}>
      <div>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Impedit
        nesciunt officia quibusdam explicabo in facilis non perspiciatis
        praesentium, qui assumenda autem distinctio tempora debitis. Eligendi
        quam repellat velit vero maxime.
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <div>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Impedit
        nesciunt officia quibusdam explicabo in facilis non perspiciatis
        praesentium, qui assumenda autem distinctio tempora debitis. Eligendi
        quam repellat velit vero maxime.
      </div>
    </Flex>
  );
}
