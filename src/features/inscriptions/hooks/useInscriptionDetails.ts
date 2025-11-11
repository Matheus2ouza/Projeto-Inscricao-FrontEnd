import { useQuery } from "@tanstack/react-query";
import { getInscriptionsDetails } from "../api/getInscriptionsDetails";
import { DetailsInscriptionsTableProps } from "../types/inscriptionsDetails.types";

// Chaves para o cache do React Query
export const inscriptionDetailsKeys = {
  all: ["inscription-details"] as const,
  detail: (id: string) => [...inscriptionDetailsKeys.all, id] as const,
};

export function useInscriptionDetails({
  inscriptionId,
}: DetailsInscriptionsTableProps) {
  return useQuery({
    queryKey: inscriptionDetailsKeys.detail(inscriptionId),
    queryFn: () => getInscriptionsDetails(inscriptionId),
    staleTime: 5 * 60 * 1000, // 5 minutos - dados de inscrição não mudam frequentemente
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: !!inscriptionId, // Só executa se inscriptionId existir
  });
}
