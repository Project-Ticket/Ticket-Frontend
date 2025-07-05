"use client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { registerSchema, RegisterSchema } from "@/validations/auth_validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { ChevronRight, Loader } from "lucide-react";
import Link from "next/link";
import { APP_LINK } from "@/constants/link_constant";
import { useState } from "react";
import { Flex } from "@radix-ui/themes";
import { handleRegister } from "@/actions/auth";
import { toastError, toastSuccess } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "Asep Saepullah",
      email: "asep.saepullah@mailinator.com",
      password: "password",
      password_confirmation: "password",
    },
  });

  const onSubmit = async (data: RegisterSchema) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("name", data.name!);
    formData.append("email", data.email!);
    formData.append("password", data.password);
    formData.append("password_confirmation", data.password_confirmation);

    try {
      const response = await handleRegister(formData);

      if (response.success?.status) {
        form.reset();
        toastSuccess(response.success.message);
        router.push(APP_LINK.AUTH.LOGIN);
      }

      if (response.error) {
        if (response.error.data) {
          Object.entries(response.error.data).forEach(([key, messages]) => {
            form.setError(key as keyof RegisterSchema, {
              type: "server",
              message: (messages as string[])[0],
            });
          });
        }
        toastError(response.error.message);
      }
    } catch (error: any) {
      toastError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-xl font-bold">Register an account</h1>
            <p className="text-muted-foreground text-balance">
              Register to your Acme Inc account
            </p>
          </div>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input type="email" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password_confirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password Confirmation</FormLabel>
                <FormControl>
                  <Input type="password" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            variant={"primary"}
            disabled={isLoading}
          >
            Register
            {isLoading ? <Loader className="animate-spin" /> : <ChevronRight />}
          </Button>
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-card text-muted-foreground relative z-10 px-2">
              Or continue with
            </span>
          </div>
          <Flex justify={"center"} gap={"4"}>
            <div>
              <Button
                variant="outline"
                type="button"
                className="w-full"
                disabled={isLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                <span>Register with Google</span>
              </Button>
            </div>
          </Flex>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link
              href={APP_LINK.AUTH.LOGIN}
              className={cn(
                "underline underline-offset-4",
                isLoading && "pointer-events-none"
              )}
            >
              Login
            </Link>
          </div>
        </div>
      </form>
    </Form>
  );
}
