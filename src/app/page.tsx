"use client";

import Header from "@/components/header";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  Users,
  Ticket,
  Gift,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import Footer from "@/components/footer";
import Banner from "@/components/landing/banner";
import Stats from "@/components/landing/stats";
import Featured from "@/components/landing/featured";
import Cta from "@/components/landing/cta";
import Lorem from "@/components/lorem";
import LandingLayout from "@/components/layout/landing";

export default function Home() {
  return (
    <LandingLayout>
      <Banner />

      <Featured />

      <Cta />
    </LandingLayout>
  );
}
