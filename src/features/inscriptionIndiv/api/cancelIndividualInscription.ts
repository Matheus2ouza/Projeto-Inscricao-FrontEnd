import axiosInstance from "@/shared/lib/apiClient";

export const cancelIndividualInscription = async (
  cacheKey: string
): Promise<void> => {
  await axiosInstance.post(`/inscriptions/indiv/cancel`, {
    cacheKey: cacheKey,
  });
};
