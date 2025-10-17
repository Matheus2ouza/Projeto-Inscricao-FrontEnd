"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getInscriptionDetails } from "../api/getInscriptionDetails";
import {
  UseInscriptionDetailParams,
  UseInscriptionDetailResult,
} from "../types/analysisTypes";
import { analysisKeys } from "./useEventInscriptions";

export function useInscriptionDetails({
  inscriptionId,
  initialPage = 1,
  pageSize = 10,
}: UseInscriptionDetailParams): UseInscriptionDetailResult {
  const [page, setPage] = useState(initialPage);
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: analysisKeys.inscriptionDetails(inscriptionId, page, pageSize),
    queryFn: async () =>
      await getInscriptionDetails(inscriptionId, { page, pageSize }),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: !!inscriptionId, // Só executa se inscriptionId estiver definido
  });

  console.log("O data");
  console.log(data);

  // Pré-carregar próxima página quando possível
  if (data && page < (data.pageCount ?? 0)) {
    void queryClient.prefetchQuery({
      queryKey: analysisKeys.inscriptionDetails(
        inscriptionId,
        page + 1,
        pageSize
      ),
      queryFn: async () =>
        await getInscriptionDetails(inscriptionId, {
          page: page + 1,
          pageSize,
        }),
      staleTime: 5 * 60 * 1000,
    });
  }

  return {
    inscriptionData: data ?? null,
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
