import axiosInstance from "@/shared/lib/apiClient";
import {
  ListInscriptionRequest,
  ListInscriptionResponse,
} from "../types/analysisTypes";

export async function getEventInscriptions(
  eventId: string,
  params: ListInscriptionRequest
): Promise<ListInscriptionResponse> {
  try {
    const { data } = await axiosInstance.get<ListInscriptionResponse>(
      `/events/${eventId}/inscriptions`,
      {
        params: {
          page: params.page,
          pageSize: params.pageSize,
        },
      }
    );
    return data;
  } catch (error) {
    console.error("Error fetching event inscriptions:", error);
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    throw new Error(
      axiosError.response?.data?.message ||
        "Falha ao carregar inscrições do evento"
    );
  }
}
