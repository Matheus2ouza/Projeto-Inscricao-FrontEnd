import axiosInstance from "@/shared/lib/apiClient";
import { AnalysisPaymentResponse } from "../types/analysisTypes";

export async function getPaymentDetails(
  inscriptionId: string
): Promise<AnalysisPaymentResponse> {
  try {
    const { data } = await axiosInstance.get<AnalysisPaymentResponse>(
      `/payments/${inscriptionId}/analysis`
    );
    return data;
  } catch (error) {
    console.error("Error fetching payment details:", error);
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    throw new Error(
      axiosError.response?.data?.message ||
      "Falha ao carregar detalhes do pagamento"
    );
  }
}
