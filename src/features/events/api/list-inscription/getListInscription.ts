import axiosInstance from "@/shared/lib/apiClient";
import { FindAccountWithInscriptionsResponse } from "../../types/eventTypes";

export async function getListInscription(
  eventId: string
): Promise<FindAccountWithInscriptionsResponse> {
  console.log('eventId', eventId);
  try {
    const { data } = await axiosInstance.get<FindAccountWithInscriptionsResponse>(
      `/events/${eventId}/list-inscription`
    );
    return data;
  } catch (error) {
    console.error("Error fetching list inscriptions:", error);
    throw new Error("Falha ao carregar lista de inscrições");
  }
}
