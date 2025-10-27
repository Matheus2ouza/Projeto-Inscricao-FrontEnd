import axiosInstance from "@/shared/lib/apiClient";
import { getAllEventsResponse } from "../types/eventTypes";

export async function getEventsToAnalysis(params: {
  page: number;
  pageSize: number;
}): Promise<getAllEventsResponse> {
  const { data } = await axiosInstance.get<getAllEventsResponse>(
    "/events/analysis/inscription",
    {
      params: { page: params.page, pageSize: params.pageSize },
    }
  );
  return data;
}
