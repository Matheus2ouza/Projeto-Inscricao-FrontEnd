"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getEventInscriptions } from "../api/getEventInscriptions";
import { UseAnalysisParams, UseAnalysisResult } from "../types/analysisTypes";

// Chaves de cache para análise de inscrições
export const analysisKeys = {
  all: ["analysis"] as const,
  eventInscriptions: (eventId: string, page: number, pageSize: number) =>
    [
      ...analysisKeys.all,
      "eventInscriptions",
      eventId,
      { page, pageSize },
    ] as const,
  inscriptionDetails: (inscriptionId: string, page: number, pageSize: number) =>
    [
      ...analysisKeys.all,
      "inscriptionDetails",
      inscriptionId,
      { page, pageSize },
    ] as const,
};

export function useEventInscriptions({
  eventId,
  initialPage = 1,
  pageSize = 15,
}: UseAnalysisParams): UseAnalysisResult {
  const [page, setPage] = useState(initialPage);
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: analysisKeys.eventInscriptions(eventId, page, pageSize),
    queryFn: async () =>
      await getEventInscriptions(eventId, { page, pageSize }),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: !!eventId, // Só executa se eventId estiver definido
  });

  // Pré-carregar próxima página quando possível
  if (data && page < (data.pageCount ?? 0)) {
    void queryClient.prefetchQuery({
      queryKey: analysisKeys.eventInscriptions(eventId, page + 1, pageSize),
      queryFn: async () =>
        await getEventInscriptions(eventId, { page: page + 1, pageSize }),
      staleTime: 5 * 60 * 1000,
    });
  }

  return {
    eventData: data ?? null,
    loading: isLoading,
    error: (error as Error | null)?.message ?? null,
    page,
    pageCount: data?.pageCount ?? 0,
    total: data?.total ?? 0,
    setPage,
    refetch: async () => {
      await refetch();
    },
  };
}
