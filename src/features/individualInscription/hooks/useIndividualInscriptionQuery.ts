import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitIndividualInscription } from "../api/submitIndividualInscription";
import { confirmIndividualInscription } from "../api/confirmIndividualInscription";
import { eventsKeys } from "@/features/events/hooks/useEventsQuery";

// Chaves de query para inscrições individuais
export const individualInscriptionKeys = {
  all: ["individualInscriptions"] as const,
  submissions: () => [...individualInscriptionKeys.all, "submissions"] as const,
  confirmations: () =>
    [...individualInscriptionKeys.all, "confirmations"] as const,
};

// Hook para submeter inscrição individual
export function useSubmitIndividualInscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitIndividualInscription,
    onSuccess: () => {
      // Invalidar cache de eventos para atualizar dados
      queryClient.invalidateQueries({ queryKey: eventsKeys.all });
    },
    onError: (error) => {
      console.error("Erro ao submeter inscrição individual:", error);
    },
  });
}

// Hook para confirmar inscrição individual
export function useConfirmIndividualInscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: confirmIndividualInscription,
    onSuccess: () => {
      // Invalidar cache de eventos para atualizar dados
      queryClient.invalidateQueries({ queryKey: eventsKeys.all });
    },
    onError: (error) => {
      console.error("Erro ao confirmar inscrição individual:", error);
    },
  });
}
