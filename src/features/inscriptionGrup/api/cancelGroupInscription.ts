import axiosInstance from "@/shared/lib/apiClient";

export const cancelGroupInscription = async (
  cacheKey: string
): Promise<void> => {
  await axiosInstance.post("inscriptions/group/cancel", {
    cacheKey,
  });
};
