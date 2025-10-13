"use server";

import axiosInstance from "@/shared/lib/apiClient";
import { getAllInscriptionsResponse } from "../types/InscriptionsTypes";

export async function getAllInscriptions(params: {
  page: number;
  pageSize: number;
  limitTime?: string | null;
  eventId?: string | null;
}): Promise<getAllInscriptionsResponse> {
  const { data } = await axiosInstance.get<getAllInscriptionsResponse>(
    "/inscriptions",
    {
      params: {
        page: params.page,
        pageSize: params.pageSize,
        limitTime: params.limitTime,
        eventId: params.eventId,
      },
    }
  );
  return data;
}
