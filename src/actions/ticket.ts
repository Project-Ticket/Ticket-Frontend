"use server";

import { API_LINK } from "@/constants/api_constant";
import { serverFetcher } from "@/lib/server-fetcher";
import { showMessageError, showMessageSuccess } from "@/lib/utils";

export const handleCreate = async (formData: FormData) => {
  try {
    const response = await serverFetcher(API_LINK.TICKET.TYPE.STORE, {
      method: "POST",
      body: formData,
    });

    return showMessageSuccess(response.message);
  } catch (error: any) {
    return showMessageError(error);
  }
};

export const handleGetTickets = async (params: Record<string, any>) => {
  try {
    const response = await serverFetcher(API_LINK.TICKET.TYPE.INDEX, {
      method: "GET",
      params,
    });

    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const handleGetTicket = async (id: number) => {
  try {
    const response = await serverFetcher(
      API_LINK.TICKET.TYPE.SHOW.replace(":id", id.toString()),
      {}
    );

    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const handleUpdate = async (id: number, formData: FormData) => {
  formData.append("_method", "PUT");

  try {
    const response = await serverFetcher(
      API_LINK.TICKET.TYPE.UPDATE.replace(":id", id.toString()),
      {
        method: "POST",
        body: formData,
      }
    );

    return showMessageSuccess(response.message);
  } catch (error: any) {
    return showMessageError(error);
  }
};
