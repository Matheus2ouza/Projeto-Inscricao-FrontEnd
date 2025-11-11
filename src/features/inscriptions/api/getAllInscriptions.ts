"use server";

import axiosInstance from "@/shared/lib/apiClient";
import {
  FindAllPaginatedInscriptionRequest,
  FindAllPaginatedInscriptionResponse
} from "../types/InscriptionsTypes";

export async function getAllInscriptions(
  eventId: string,
  params: FindAllPaginatedInscriptionRequest
): Promise<FindAllPaginatedInscriptionResponse> {
  const { data } = await axiosInstance.get<FindAllPaginatedInscriptionResponse>(
    `/inscriptions/${eventId}`,
    {
      params: {
        page: params.page,
        pageSize: params.pageSize,
        limitTime: params.limitTime,
      },
    }
  );
  return data;
}
