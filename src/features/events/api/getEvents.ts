import axiosInstance from "@/shared/lib/apiClient";
import qs from "qs";
import { EventDto, getAllEventsResponse } from "../types/eventTypes";

export async function getEvents(params: {
  page: number;
  pageSize: number;
  status?: string[];
}): Promise<getAllEventsResponse> {
  const { data } = await axiosInstance.get<getAllEventsResponse>("/events", {
    params: {
      page: params.page,
      pageSize: params.pageSize,
      status: params.status,
    },
    paramsSerializer: (p) => qs.stringify(p, { arrayFormat: "repeat" }),
  });
  return data;
}


export async function getEventsCombobox(): Promise<EventDto[]> {
  const { data } = await axiosInstance.get<EventDto[]>("/events/all/names");
  return data;
}
