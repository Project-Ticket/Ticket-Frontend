"use client";

import { Suspense } from "react";

export default function EventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense>{children}</Suspense>;
}
