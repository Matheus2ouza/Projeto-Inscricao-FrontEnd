import axiosInstance from "@/shared/lib/apiClient";

export interface ConfirmIndividualInscriptionResponse {
  inscriptionId: string;
  inscriptionStatus: string;
  paymentEnabled: boolean;
}

export const confirmIndividualInscription = async (
  cacheKey: string
): Promise<ConfirmIndividualInscriptionResponse> => {
  const response = await axiosInstance.post(`/inscriptions/indiv/confirm/`, {
    cacheKey: cacheKey,
  });
  return response.data;
};
