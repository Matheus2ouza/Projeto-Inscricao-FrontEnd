import axiosInstance from "@/shared/lib/apiClient";

export const confirmIndividualInscription = async (cacheKey: string) => {
  const response = await axiosInstance.post(`/inscriptions/indiv/confirm/`, {
    cacheKey: cacheKey,
  });
  return response.data;
};
