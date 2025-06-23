import { TOKEN_SETTING } from "@/constants";
import { cookies } from "next/headers";
import axios, { AxiosRequestConfig, Method } from "axios";

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

    return response.data;
  } catch (error: any) {
    const status = error.response?.status || "NO_RESPONSE";
    const data = error.response?.data || error.message;

    throw error;
  }
}
