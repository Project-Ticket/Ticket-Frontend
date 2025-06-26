import { TOKEN_SETTING } from "@/constants";
import { cookies } from "next/headers";
import axios, { AxiosRequestConfig, Method } from "axios";
import { createLogger } from "./logger";

type FetchOptions = {
  method?: Method;
  headers?: Record<string, string>;
  body?: any;
  params?: any;
};

export async function serverFetcher<T = any>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const { method = "GET", headers, body, params } = options;
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_SETTING.TOKEN)?.value;

  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  const finalHeaders: Record<string, string> = {
    ...(headers || {}),
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  if (params) {
    url = `${url}?${new URLSearchParams(params).toString()}`;
  }

  const axiosConfig: AxiosRequestConfig = {
    method,
    url: `${process.env.NEXT_PUBLIC_APP_LINK}/api/${url}`,
    headers: finalHeaders,
    data: body,
    withCredentials: true,
  };

  try {
    const response = await axios<T>(axiosConfig);

    // if (process.env.NODE_ENV === "development") {
    //   (await createLogger()).info(
    //     isFormData
    //       ? `${JSON.stringify(Object.fromEntries(body.entries()))}`
    //       : typeof body === "string"
    //       ? `${JSON.stringify(body)}`
    //       : `${JSON.stringify(body ?? params)}`
    //   );
    //   if (response.status >= 400) {
    //     (await createLogger()).api(
    //       `${url} - ${method} - ${response.status} - ${JSON.stringify(
    //         response.data
    //       )}`
    //     );
    //   }
    // }

    return response.data;
  } catch (error: any) {
    // if (process.env.NODE_ENV === "development") {
    //   const status = error.response?.status || "NO_RESPONSE";
    //   const data = error.response?.data || error.message;

    //   (await createLogger()).api(
    //     `${url} - ${method} - ${status} - ${JSON.stringify(data)}`,
    //     true
    //   );
    // }

    throw error;
  }
}
