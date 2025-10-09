import axiosInstance from "@/shared/lib/apiClient";

export interface ConfirmGroupInscriptionParams {
  cacheKey: string;
}

export interface ConfirmGroupInscriptionResponse {
  inscriptionId: string;
  paymentEnabled: boolean;
}

export async function confirmGroupInscription(
  data: ConfirmGroupInscriptionParams
): Promise<ConfirmGroupInscriptionResponse> {
  const response = await axiosInstance.post("inscriptions/group/confirm", {
    cacheKey: data.cacheKey,
  });

  console.log(response.data);
  return response.data;
}
