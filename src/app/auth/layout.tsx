"use client";

import LandingLayout from "@/components/layout/landing";
import { Card, CardContent } from "@/components/ui/card";

export default function SignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LandingLayout>
      <div className="bg-muted flex flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-4xl">
          <div className="flex flex-col gap-6">
            <Card className="overflow-hidden p-0 shadow-none">
              <CardContent className="grid p-0 md:grid-cols-2">
                {children}
                <div className="bg-muted relative hidden md:block">
                  <img
                    src="https://images.unsplash.com/photo-1605379399642-870262d3d051?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </LandingLayout>
  );
}
