import { useQuery } from "@tanstack/react-query";
import { getListInscription } from "../api/list-inscription/getListInscription";
import { FindAccountWithInscriptionsResponse } from "../types/eventTypes";

export const eventAccountsInscriptionsKeys = {
  all: ["event-accounts-inscriptions"] as const,
  list: (eventId: string) =>
    [...eventAccountsInscriptionsKeys.all, eventId] as const,
};

export function useEventAccountsInscriptions(eventId: string) {
  return useQuery<FindAccountWithInscriptionsResponse>({
    queryKey: eventAccountsInscriptionsKeys.list(eventId),
    queryFn: () => getListInscription(eventId),
    enabled: Boolean(eventId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}
