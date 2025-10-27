"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteInscription } from "../api/deleteInscription";
import { updateInscriptionStatus } from "../api/updateInscriptionStatus";
import { useDeletedInscriptions } from "../context/DeletedInscriptionsContext";
import { useInvalidateAnalysisInscriptions } from "./useAnalysisInscriptionsQuery";

export function useInscriptionActions() {
  const router = useRouter();
  const {
    invalidateAll,
    invalidateInscriptionDetails,
    removeInscriptionDetails,
    cancelInscriptionDetails,
    removeInscriptionFromAllCaches,
  } = useInvalidateAnalysisInscriptions();
  const { markAsDeleted } = useDeletedInscriptions();

  // Atualizar status da inscrição (aprovar/cancelar)
  const updateStatusMutation = useMutation({
    mutationFn: ({ inscriptionId, status }: { inscriptionId: string; status: "PENDING" | "CANCELLED" }) =>
      updateInscriptionStatus(inscriptionId, status),
    onSuccess: (_, { inscriptionId }) => {
      // Invalidar cache da inscrição específica e listas
      invalidateInscriptionDetails(inscriptionId);
      invalidateAll();
    },
  });

  // Deletar inscrição
  const deleteMutation = useMutation({
    mutationFn: deleteInscription,
    // Cancel any ongoing queries related to this inscription before mutating
    onMutate: async (inscriptionId: string) => {
      // Marcar inscrição como deletada imediatamente
      markAsDeleted(inscriptionId);
      // Cancelar todas as queries relacionadas à inscrição
      await cancelInscriptionDetails(inscriptionId);
      // Remover dados da inscrição de todos os caches
      removeInscriptionFromAllCaches(inscriptionId);
    },
    onSuccess: (_, inscriptionId) => {
      // Garantir que todos os dados da inscrição foram removidos
      removeInscriptionFromAllCaches(inscriptionId);
      // Marcar como deletada (redundante, mas garante consistência)
      markAsDeleted(inscriptionId);
      // Voltar para a tela anterior (tabela de inscrições do evento)
      router.back();
    },
    onError: (_, inscriptionId) => {
      // Em caso de erro, ainda limpar o cache para evitar dados inconsistentes
      removeInscriptionFromAllCaches(inscriptionId);
      markAsDeleted(inscriptionId);
    },
  });

  // Função para aprovar inscrição
  const handleApproveInscription = async (inscriptionId: string) => {
    try {
      await updateStatusMutation.mutateAsync({ inscriptionId, status: "PENDING" });
      toast.success("Inscrição aprovada com sucesso!");
    } catch (error) {
      console.error("Erro ao aprovar inscrição:", error);
      const errorMessage = error instanceof Error ? error.message : "Erro ao aprovar inscrição. Tente novamente.";
      toast.error(errorMessage);
    }
  };

  // Função para cancelar/reativar inscrição
  const handleCancelInscription = async (inscriptionId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus.toLowerCase() === "cancelled" ? "PENDING" : "CANCELLED";
      const action = currentStatus.toLowerCase() === "cancelled" ? "reativada" : "cancelada";

      await updateStatusMutation.mutateAsync({ inscriptionId, status: newStatus as "PENDING" | "CANCELLED" });
      toast.success(`Inscrição ${action} com sucesso!`);
    } catch (error) {
      const action = currentStatus.toLowerCase() === "cancelled" ? "reativar" : "cancelar";
      console.error(`Erro ao ${action} inscrição:`, error);
      const errorMessage = error instanceof Error ? error.message : `Erro ao ${action} inscrição. Tente novamente.`;
      toast.error(errorMessage);
    }
  };

  // Função para deletar inscrição
  const handleDeleteInscription = async (inscriptionId: string) => {
    try {
      await deleteMutation.mutateAsync(inscriptionId);
      toast.success("Inscrição deletada com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar inscrição:", error);
      const errorMessage = error instanceof Error ? error.message : "Erro ao deletar inscrição. Tente novamente.";
      toast.error(errorMessage);
    }
  };

  // Função para download
  const handleDownloadList = async (inscriptionId: string) => {
    try {
      // TODO: Implementar download do PDF
      console.log("Baixando lista da inscrição:", inscriptionId);
      // Simular download
      toast.success("Download iniciado!");
    } catch (error) {
      console.error("Erro ao baixar lista:", error);
      toast.error("Erro ao baixar lista. Tente novamente.");
    }
  };

  return {
    approveInscription: handleApproveInscription,
    cancelInscription: handleCancelInscription,
    deleteInscription: handleDeleteInscription,
    downloadList: handleDownloadList,
    isApproving: updateStatusMutation.isPending,
    isCancelling: updateStatusMutation.isPending,
    isDeleting: deleteMutation.isPending,
    approveError: updateStatusMutation.error,
    cancelError: updateStatusMutation.error,
    deleteError: deleteMutation.error,
  };
}
