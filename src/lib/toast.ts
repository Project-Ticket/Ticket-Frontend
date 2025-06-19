import { toast } from "react-toastify";

export function toastError(message: any) {
  toast.error(message || "Forbidden", {
    autoClose: 3000,
  });
}

export function toastSuccess(message: string) {
  toast.success(message, {
    autoClose: 3000,
  });
}
