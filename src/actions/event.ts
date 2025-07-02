"use server";

import { API_LINK } from "@/constants/api_constant";
import { serverFetcher } from "@/lib/server-fetcher";
import { showMessageError, showMessageSuccess } from "@/lib/utils";
import { cookies } from "next/headers";

export const handleGetEvents = async () => {
  try {
    const response = await serverFetcher(API_LINK.EVENT.INDEX, {
      method: "GET",
    });

    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const handleGetEvent = async (slug: string) => {
  try {
    const response = await serverFetcher(
      API_LINK.EVENT.SHOW.replace(":slug", slug),
      {
        method: "GET",
      }
    );

    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const handleGetCategory = async () => {
  try {
    const response = await serverFetcher(API_LINK.EVENT.CATEGORY, {
      method: "GET",
    });

    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const handleCreate = async (formData: FormData) => {
  try {
    const response = await serverFetcher(API_LINK.EVENT.STORE, {
      method: "POST",
      body: formData,
    });

    return showMessageSuccess(response.message);
  } catch (error: any) {
    return showMessageError(error);
  }
};

export const handleUpdate = async (formData: FormData, slug: string) => {
  formData.append("_method", "PUT");

  try {
    const response = await serverFetcher(
      API_LINK.EVENT.UPDATE.replace(":slug", slug),
      {
        method: "POST",
        body: formData,
      }
    );

    return showMessageSuccess(response.message);
  } catch (error) {
    return showMessageError(error);
  }
};

export const handleDelete = async (slug: string) => {
  try {
    const response = await serverFetcher(
      API_LINK.EVENT.DELETE.replace(":slug", slug),
      {
        method: "DELETE",
      }
    );

    return showMessageSuccess(response.message);
  } catch (error: any) {
    return showMessageError(error);
  }
};
