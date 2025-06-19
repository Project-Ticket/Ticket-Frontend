"use server";

import { TOKEN_SETTING } from "@/constants";
import { API_LINK } from "@/constants/api_constant";
import { serverFetcher } from "@/lib/server-fetcher";
import { showMessageError, showMessageSuccess } from "@/lib/utils";
import { cookies } from "next/headers";

export const handleRegister = async (formData: FormData) => {
  try {
    const response = await serverFetcher(API_LINK.AUTH.REGISTER, {
      method: "POST",
      body: formData,
    });

    return showMessageSuccess(response.message);
  } catch (error: any) {
    return showMessageError(error);
  }
};

export const handleLogin = async (formData: FormData) => {
  const cookieStore = await cookies();

  try {
    const response = await serverFetcher(API_LINK.AUTH.LOGIN, {
      method: "POST",
      body: formData,
    });

    cookieStore.set(TOKEN_SETTING.TOKEN, response.data.token);

    return showMessageSuccess(response.message);
  } catch (error: any) {
    return showMessageError(error);
  }
};
