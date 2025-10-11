import axiosInstance from "@/shared/lib/apiClient";
import { EventDto } from "../types/eventsTypes";

export async function getEvents(): Promise<EventDto[]> {
  const { data } = await axiosInstance.get<EventDto[]>("/events/all/names");
  return data;
}
