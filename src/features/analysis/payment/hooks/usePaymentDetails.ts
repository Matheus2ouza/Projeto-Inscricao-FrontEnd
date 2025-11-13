import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getPaymentDetails } from "../api/getPaymentDetails";

// Chaves de cache para detalhes de pagamento
export const paymentDetailsKeys = {
  all: ["payment-details"] as const,
  detail: (
    inscriptionId: string,
    page: number,
    pageSize: number,
    status?: string[]
  ) =>
    [
      ...paymentDetailsKeys.all,
      inscriptionId,
      page,
      pageSize,
      status,
    ] as const,
};

export function usePaymentDetailsQuery(
  inscriptionId: string,
  paymentStatus?: string[],
  initialPage: number = 1,
  pageSize: number = 3
) {
  const [page, setPage] = useState(initialPage);

  const query = useQuery({
    queryKey: paymentDetailsKeys.detail(
      inscriptionId,
      page,
      pageSize,
      paymentStatus
    ),
    queryFn: () =>
      getPaymentDetails(inscriptionId, {
        page,
        pageSize,
        status: paymentStatus,
      }),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: !!inscriptionId, // Só executa se inscriptionId estiver definido
  });

  return {
    ...query,
    page,
    setPage,
    pageCount: query.data?.pageCount || 0,
    total: query.data?.total || 0,
  };
}

// Hook para invalidar cache de detalhes de pagamento
export function useInvalidatePaymentDetails() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () =>
      queryClient.invalidateQueries({ queryKey: paymentDetailsKeys.all }),
    invalidateDetail: (inscriptionId: string) =>
      queryClient.invalidateQueries({
        queryKey: ["payment-details", inscriptionId],
      }),
  };
}

