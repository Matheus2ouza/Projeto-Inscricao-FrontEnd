"use client";

import { useQuery } from "@tanstack/react-query";
import { getTicketSalesDetails } from "../api/getTicketSalesDetails";
import { ticketsKeys } from "../types/ticketsTypes";

export function useTicketSalesDetails(ticketId: string) {
  return useQuery({
    queryKey: ticketsKeys.detail(ticketId),
    queryFn: async () => await getTicketSalesDetails(ticketId),
    enabled: !!ticketId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
