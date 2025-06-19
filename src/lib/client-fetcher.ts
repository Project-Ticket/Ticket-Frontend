import { TOKEN_SETTING } from "@/constants";
import axios, { AxiosRequestConfig, Method } from "axios";
import { getCookie } from "cookies-next";

type FetchOptions = {
  method?: Method;
  headers?: Record<string, string>;
  body?: any;
  params?: any;
};

export async function apiFetch<T = any>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const { method = "GET", headers, body, params } = options;
  const token = getCookie(TOKEN_SETTING.TOKEN);

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
    url: `${process.env.NEXT_PUBLIC_APP_LINK}/rest/${url}`,
    headers: finalHeaders,
    data: body,
  };

  try {
    const response = await axios<T>(axiosConfig);

    return response.data;
  } catch (error: any) {
    throw error;
  }
}
