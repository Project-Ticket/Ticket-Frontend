import { API_CODE } from "@/constants/api_constant";
import { FormStateInterface } from "@/interfaces";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Swal from "sweetalert2";

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

export function getImageUrl(url: string) {
  return `${process.env.NEXT_PUBLIC_APP_LINK}/storage/${url}`;
}

export async function swalAlert(
  icon: "success" | "error" | "warning",
  title: string,
  message: string
) {
  return Swal.fire({
    icon: icon,
    title: title,
    text: message,
  });
}

export const confirmDelete = async (): Promise<boolean> => {
  const result = await Swal.fire({
    icon: "warning",
    title: "Are you sure?",
    text: "If you want to delete, enter 'delete' to confirm.",
    input: "text",
    inputAttributes: {
      autocapitalize: "off",
      required: "required",
    },
    showCancelButton: true,
    cancelButtonText: "Cancel",
    confirmButtonColor: "#e7000b",
    confirmButtonText: "Delete!",
    showLoaderOnConfirm: true,
    preConfirm: async (text: string) => {
      if (text.toLowerCase() === "delete") {
        return true;
      } else {
        Swal.showValidationMessage("Wrong confirmation!");
        return false;
      }
    },
    allowOutsideClick: () => !Swal.isLoading(),
  });

  return result.isConfirmed;
};
