import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updatePaymentStatus } from "../api/updatePaymentStatus";
import { PaymentStatus } from "../types/analysisTypes";
import { paymentDetailsKeys } from "./usePaymentDetails";

type RefusePaymentVariables = {
  paymentId: string;
  rejectionReason: string;
};

export function usePaymentActions() {
  const queryClient = useQueryClient();

  const approvePaymentMutation = useMutation({
    mutationFn: (paymentId: string) =>
      updatePaymentStatus(paymentId, PaymentStatus.APPROVED),
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
      updatePaymentStatus(paymentId, PaymentStatus.REFUSED, rejectionReason),
    onSuccess: () => {
      toast.success("Pagamento recusado!");
      // Invalidar cache para atualizar os dados
      queryClient.invalidateQueries({ queryKey: paymentDetailsKeys.all });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao recusar pagamento");
    },
  });

  return {
    approvePayment: approvePaymentMutation.mutate,
    refusePayment: refusePaymentMutation.mutate,
    isApproving: approvePaymentMutation.isPending,
    isRefusing: refusePaymentMutation.isPending,
  };
}
