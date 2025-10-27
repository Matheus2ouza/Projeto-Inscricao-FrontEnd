import axiosInstance from "@/shared/lib/apiClient";

export async function deleteInscription(inscriptionId: string): Promise<void> {
  try {
    console.log('chamou a api');
    await axiosInstance.delete(`/inscriptions/${inscriptionId}/delete`);
  } catch (error) {
    console.error("Error deleting inscription:", error);
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    throw new Error(
      axiosError.response?.data?.message ||
      "Falha ao deletar inscrição"
    );
  }
}
