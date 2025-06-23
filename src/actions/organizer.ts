"use server";

import { API_LINK } from "@/constants/api_constant";
import { serverFetcher } from "@/lib/server-fetcher";
import { showMessageError, showMessageSuccess } from "@/lib/utils";

export const handleRegister = async (formData: FormData) => {
  console.log(formData);

  try {
    const response = await serverFetcher(API_LINK.ORGANIZER.STORE, {
      method: "POST",
      body: formData,
    });

    return showMessageSuccess(response.message);
  } catch (error: any) {
    console.log(error);

    return showMessageError(error);
  }
};
