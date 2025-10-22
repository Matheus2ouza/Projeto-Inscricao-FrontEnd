"use client";

import { useQuery } from "@tanstack/react-query";
import { getReportGeneral } from "../api/getReportGeral";
import { UseReportGeneralResult } from "../types/reportTypes";

export const reportKeys = {
  all: ["report"] as const,
  general: (eventId: string) => [...reportKeys.all, "geral", eventId] as const,
};

export function useReportGeneral(eventId?: string): UseReportGeneralResult {
  const queryKey = eventId
    ? reportKeys.general(eventId)
    : ([...reportKeys.all, "general", "pending"] as const);

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey,
    queryFn: async () => await getReportGeneral(eventId as string),
    enabled: Boolean(eventId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  return {
    data: data ?? null,
    loading: isLoading && Boolean(eventId),
    isFetching,
    error: (error as Error | null)?.message ?? null,
    refetch: async () => {
      await refetch();
    },
  };
}
