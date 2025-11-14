import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deletePayment as deletePaymentRequest } from "../api/deletePayment";
import { updatePaymentStatus } from "../api/updatePaymentStatus";
import { PaymentStatus } from "../types/analysisTypes";
import { paymentDetailsKeys } from "./usePaymentDetails";

type RefusePaymentVariables = {
  paymentId: string;
  rejectionReason: string;
};

type UsePaymentActionsParams = {
  inscriptionId: string;
  eventId: string;
};

export function usePaymentActions({
  inscriptionId,
  eventId,
}: UsePaymentActionsParams) {
  const queryClient = useQueryClient();

  const reviewPaymentMutation = useMutation({
    mutationFn: (paymentId: string) =>
      updatePaymentStatus({
        paymentId,
        inscriptionId,
        eventId,
        statusPayment: PaymentStatus.UNDER_REVIEW,
      }),
    onSuccess: () => {
      toast.success("Pagamento enviado para revisão!");
      queryClient.invalidateQueries({ queryKey: paymentDetailsKeys.all });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao enviar para revisão");
    },
  });

  const approvePaymentMutation = useMutation({
    mutationFn: (paymentId: string) =>
      updatePaymentStatus({
        paymentId,
        inscriptionId,
        eventId,
        statusPayment: PaymentStatus.APPROVED,
      }),
    onSuccess: (data, paymentId) => {
      toast.success("Pagamento aprovado com sucesso!");
      // Invalidar cache para atualizar os dados
      queryClient.invalidateQueries({ queryKey: paymentDetailsKeys.all });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao aprovar pagamento");
    },
  });

  const refusePaymentMutation = useMutation({
    mutationFn: ({ paymentId, rejectionReason }: RefusePaymentVariables) =>
      updatePaymentStatus({
        paymentId,
        inscriptionId,
        eventId,
        statusPayment: PaymentStatus.REFUSED,
        rejectionReason,
      }),
    onSuccess: () => {
      toast.success("Pagamento recusado!");
      // Invalidar cache para atualizar os dados
      queryClient.invalidateQueries({ queryKey: paymentDetailsKeys.all });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao recusar pagamento");
    },
  });

  const deletePaymentMutation = useMutation({
    mutationFn: deletePaymentRequest,
    onSuccess: () => {
      toast.success("Pagamento deletado com sucesso!");
      queryClient.invalidateQueries({ queryKey: paymentDetailsKeys.all });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao deletar pagamento");
    },
  });

  return {
    approvePayment: approvePaymentMutation.mutate,
    refusePayment: refusePaymentMutation.mutate,
    reviewPayment: reviewPaymentMutation.mutate,
    deletePayment: deletePaymentMutation.mutate,
    isApproving: approvePaymentMutation.isPending,
    isRefusing: refusePaymentMutation.isPending,
    isReviewing: reviewPaymentMutation.isPending,
    isDeleting: deletePaymentMutation.isPending,
  };
}
