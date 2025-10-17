import axiosInstance from "@/shared/lib/apiClient";
import { Ticket } from "../types/ticketsTypes";

export async function getTicketsByEvent(eventId: string): Promise<Ticket[]> {
  try {
    const { data } = await axiosInstance.get<Ticket[]>(`/ticket/${eventId}`);
    return data;
  } catch (error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    throw new Error(
      axiosError.response?.data?.message ||
        "Falha ao carregar tickets do evento"
    );
  }
}
