"use server";

import { API_LINK } from "@/constants/api_constant";
import { serverFetcher } from "@/lib/server-fetcher";
import { showMessageError, showMessageSuccess } from "@/lib/utils";
import { cookies } from "next/headers";

export const handleGetProfile = async () => {
  try {
    const response = await serverFetcher(API_LINK.AUTH.PROFILE, {
      method: "GET",
    });

    return response.data;
  } catch (error: any) {
    throw error;
  }
};
