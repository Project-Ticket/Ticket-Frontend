"use server";

import { API_LINK } from "@/constants/api_constant";
import { serverFetcher } from "@/lib/server-fetcher";
import { showMessageError, showMessageSuccess } from "@/lib/utils";
import { cookies } from "next/headers";

export const handleGetProfile = async () => {
  try {
    const response = await serverFetcher(API_LINK.USER.PROFILE, {
      method: "GET",
    });

    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const handleUpdateProfile = async (formData: FormData) => {
  formData.append("_method", "PUT");

  try {
    const response = await serverFetcher(API_LINK.USER.UPDATE_PROFILE, {
      method: "POST",
      body: formData,
    });

    return showMessageSuccess(response.message);
  } catch (error: any) {
    return showMessageError(error);
  }
};
