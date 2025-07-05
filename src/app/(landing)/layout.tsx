"use client";

import LandingLayoutComp from "@/components/layout/landing";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LandingLayoutComp>{children}</LandingLayoutComp>;
}
