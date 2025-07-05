"use server";

import { API_LINK } from "@/constants/api_constant";
import { serverFetcher } from "@/lib/server-fetcher";

export const handleGetPaymentMethod = async () => {
  try {
    const response = await serverFetcher(API_LINK.PAYMENT_METHOD.INDEX, {
      method: "GET",
    });

    return response.data;
  } catch (error: any) {
    throw error;
  }
};
