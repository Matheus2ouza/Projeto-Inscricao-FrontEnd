"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getTicketsByEvent } from "../api/getTicketsByEvent";
import { ticketsKeys } from "../types/ticketsTypes";

export function useTicketsByEvent(eventId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ticketsKeys.byEvent(eventId),
    queryFn: async () => await getTicketsByEvent(eventId),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    ...query,
    invalidate: async () => {
      await queryClient.invalidateQueries({
        queryKey: ticketsKeys.byEvent(eventId),
      });
    },
  };
}
