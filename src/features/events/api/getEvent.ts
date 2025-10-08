import axiosInstance from "@/shared/lib/apiClient";
import { Event } from "../types/eventTypes";

export async function getEvent(eventId: string): Promise<Event> {
  try {
    const response = await axiosInstance.get<Event>(`/events/${eventId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching event:", error);
    throw new Error("Falha ao carregar evento");
  }
}
