import { FormStateInterface } from "@/interfaces";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function showMessageError(error: any, values?: any): FormStateInterface {
  let message = error?.response?.data?.message || error?.message || "Failed";

  return {
    error: {
      message,
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
