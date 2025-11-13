import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
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
  const queryClient = useQueryClient();

  // Verificar se a inscrição foi deletada
  const isDeleted = useMemo(() => {
    const deletedInscriptions = queryClient.getQueryData<Set<string>>([
      "deleted-inscriptions",
    ]);
    return deletedInscriptions?.has(inscriptionId) || false;
  }, [inscriptionId, queryClient]);

  // Se a inscrição foi deletada, não executar a query
  const shouldExecuteQuery = !!inscriptionId && !isDeleted;

  return useQuery({
    queryKey: inscriptionDetailsKeys.detail(inscriptionId),
    queryFn: () => getInscriptionsDetails(inscriptionId),
    staleTime: Infinity, // Mantém os dados sempre fresh até invalidarmos manualmente
    gcTime: 10 * 60 * 1000, // 10 minutos em cache antes de ser coletado
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    enabled: shouldExecuteQuery, // Só executa se inscriptionId existir e não foi deletada
  });
}
