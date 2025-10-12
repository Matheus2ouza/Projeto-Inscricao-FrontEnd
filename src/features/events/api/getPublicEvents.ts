import axiosInstance from "@/shared/lib/apiClient";

export interface PublicEvent {
  id: string;
  name: string;
  location: string;
  image?: string;
}

export async function getPublicEvents(): Promise<PublicEvent[]> {
  const { data } = await axiosInstance.get<PublicEvent[]>("/events/carousel");
  return data;
}
