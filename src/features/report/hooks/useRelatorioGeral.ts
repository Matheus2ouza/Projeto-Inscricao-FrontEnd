"use client";

import { useQuery } from "@tanstack/react-query";
import { getRelatorioGeral } from "../api/getReportGeral";
import { UseReportGeralResult } from "../types/reportTypes";

export const relatorioKeys = {
  all: ["relatorio"] as const,
  geral: (eventId: string) => [...relatorioKeys.all, "geral", eventId] as const,
};

export function useRelatorioGeral(eventId?: string): UseReportGeralResult {
  const queryKey = eventId
    ? relatorioKeys.geral(eventId)
    : ([...relatorioKeys.all, "geral", "pending"] as const);

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey,
    queryFn: async () => await getRelatorioGeral(eventId as string),
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
