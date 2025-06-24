import { API_CODE } from "@/constants/api_constant";
import { FormStateInterface } from "@/interfaces";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function showMessageError(error: any, values?: any): FormStateInterface {
  let message = error?.response?.data?.message || error?.message || "Failed";

  let data;

  if (error.response.status == API_CODE.UNPROCESSABLE_ENTITY) {
    data = error.response.data.data.errors;
  }

  return {
    error: {
      message,
      data,
    },
    values,
  };
}

export function showMessageSuccess(
  message: string,
  data?: any
): FormStateInterface {
  return {
    success: {
      status: true,
      message: message,
      data,
    },
  };
}

export function toTitleCase(str: string) {
  let removeUnderscore = str.replace(/_/g, " ");

  const words = removeUnderscore.split(" ");

  for (let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].substr(1);
  }

  return words.join(" ");
}
