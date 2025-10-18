import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { eventsKeys } from "@/features/events/hooks/useEventsQuery";
import { createAvulsaRegistration } from "../api/createAvulsaRegistration";
import { avulsaKeys, CreateInscriptionAvulInput } from "../types/avulsaTypes";

export function useCreateAvulsaRegistration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInscriptionAvulInput) =>
      createAvulsaRegistration(data),
    onSuccess: (result, variables) => {
      toast.success("Inscrição avulsa criada com sucesso!", {
        description: `ID: ${result.id}`,
      });

      // Invalidar as queries relacionadas para atualizar a lista
      queryClient.invalidateQueries({
        queryKey: avulsaKeys.list(variables.eventId, 1, 10),
      });
      queryClient.invalidateQueries({
        queryKey: eventsKeys.lists(),
      });
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : "Erro ao criar inscrição avulsa";
      toast.error("Erro ao criar inscrição", {
        description: message,
      });
    },
  });
}
