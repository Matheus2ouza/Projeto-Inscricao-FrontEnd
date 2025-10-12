import { useQuery } from "@tanstack/react-query";
import { getPublicEvents } from "../api/getPublicEvents";

export function usePublicEvents() {
  return useQuery({
    queryKey: ["public-events"],
    queryFn: getPublicEvents,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    refetchOnWindowFocus: false,
  });
}
