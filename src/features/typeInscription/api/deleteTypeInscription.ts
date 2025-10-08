import axiosInstance from "@/shared/lib/apiClient";

export async function deleteTypeInscription(
  typeInscriptionId: string
): Promise<void> {
  try {
    await axiosInstance.delete(`/type-inscription/${typeInscriptionId}`);
  } catch (error) {
    console.error("Error deleting type inscription:", error);
    throw new Error("Falha ao excluir tipo de inscrição");
  }
}
