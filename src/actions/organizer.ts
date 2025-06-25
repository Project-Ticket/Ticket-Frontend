"use server";

import { API_LINK } from "@/constants/api_constant";
import { serverFetcher } from "@/lib/server-fetcher";
import { showMessageError, showMessageSuccess } from "@/lib/utils";

export const handleRegister = async (formData: FormData) => {
  try {
    const response = await serverFetcher(API_LINK.ORGANIZER.STORE, {
      method: "POST",
      body: formData,
    });

    return showMessageSuccess(response.message);
  } catch (error: any) {
    return showMessageError(error);
  }
};

export const handleUpdate = async (formData: FormData, uuid: string) => {
  formData.append("_method", "PUT");

  try {
    const response = await serverFetcher(
      API_LINK.ORGANIZER.UPDATE.replace(":id", uuid),
      {
        method: "POST",
        body: formData,
      }
    );

    return showMessageSuccess(response.message, response.data);
  } catch (error: any) {
    return showMessageError(error);
  }
};
