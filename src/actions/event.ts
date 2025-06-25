"use server";

import { API_LINK } from "@/constants/api_constant";
import { serverFetcher } from "@/lib/server-fetcher";
import { showMessageError, showMessageSuccess } from "@/lib/utils";
import { cookies } from "next/headers";

export const handleGetCategory = async () => {
  try {
    const response = await serverFetcher(API_LINK.EVENT.CATEGORY, {
      method: "GET",
    });

    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const handleCreate = async (formData: FormData) => {
  try {
    const response = await serverFetcher(API_LINK.EVENT.STORE, {
      method: "POST",
      body: formData,
    });

    return showMessageSuccess(response.message);
  } catch (error: any) {
    return showMessageError(error);
  }
};
