import axiosInstance from "@/shared/lib/apiClient";
import { PaymentStatus, UpdatePaymentStatusResponse } from "../types/analysisTypes";

type UpdatePaymentStatusPayload = {
  paymentId: string;
  statusPayment: PaymentStatus;
  rejectionReason?: string;
};

export async function updatePaymentStatus(
  paymentId: string,
  statusPayment: PaymentStatus,
  rejectionReason?: string
): Promise<UpdatePaymentStatusResponse> {
  try {
    const payload: UpdatePaymentStatusPayload = {
      paymentId,
      statusPayment,
    };

    if (rejectionReason) {
      payload.rejectionReason = rejectionReason;
    }

    const update = await axiosInstance.patch(
      `payments/${paymentId}/update`,
      payload
    );

    return update?.data;
  } catch (error) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    throw new Error(
      axiosError.response?.data?.message ||
      "Erro ao atualizar status do pagamento"
    );
  }
}
