import axiosInstance from "@/shared/lib/apiClient";
import { FindDetailsEventResponse } from "../types/eventTypes";

export async function getDetailsEvent(eventId: string) {
  try {
    const response = await axiosInstance.get<FindDetailsEventResponse>(
      `/events/${eventId}/details`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching event details:", error);
    throw new Error("Falha ao carregar detalhes do evento");
  }
}
