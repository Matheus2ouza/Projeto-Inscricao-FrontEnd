import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPaymentDetails } from "../api/getPaymentDetails";

// Chaves de cache para detalhes de pagamento
export const paymentDetailsKeys = {
  all: ["payment-details"] as const,
  detail: (inscriptionId: string) =>
    [...paymentDetailsKeys.all, inscriptionId] as const,
};

export function usePaymentDetailsQuery(inscriptionId: string) {
  return useQuery({
    queryKey: paymentDetailsKeys.detail(inscriptionId),
    queryFn: () => getPaymentDetails(inscriptionId),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: !!inscriptionId, // Só executa se inscriptionId estiver definido
  });
}

// Hook para invalidar cache de detalhes de pagamento
export function useInvalidatePaymentDetails() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () =>
      queryClient.invalidateQueries({ queryKey: paymentDetailsKeys.all }),
    invalidateDetail: (inscriptionId: string) =>
      queryClient.invalidateQueries({
        queryKey: paymentDetailsKeys.detail(inscriptionId),
      }),
  };
}

