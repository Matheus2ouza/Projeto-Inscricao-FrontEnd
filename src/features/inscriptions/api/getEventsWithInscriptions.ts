import axiosInstance from "@/shared/lib/apiClient";
import { FindAllWithInscriptionsRequest, FindAllWithInscriptionsResponse } from "../types/InscriptionsTypes";

export async function getEventsWithInscriptions(
  params: FindAllWithInscriptionsRequest
): Promise<FindAllWithInscriptionsResponse> {
  const { data } = await axiosInstance.get<FindAllWithInscriptionsResponse>(
    "/events/inscriptions",
    {
      params: {
        page: params.page,
        pageSize: params.pageSize,
      },
    }
  );
  return data;
}
