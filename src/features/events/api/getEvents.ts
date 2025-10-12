import axiosInstance from "@/shared/lib/apiClient";
import { EventDto, getAllEventsResponse } from "../types/eventTypes";

export async function getEvents(params: {
  page: number;
  pageSize: number;
}): Promise<getAllEventsResponse> {
  const { data } = await axiosInstance.get<getAllEventsResponse>("/events", {
    params: { page: params.page, pageSize: params.pageSize },
  });
  return data;
}

export async function getEventsName(): Promise<EventDto[]> {
  const { data } = await axiosInstance.get<EventDto[]>("/events/all/names");
  return data;
}
