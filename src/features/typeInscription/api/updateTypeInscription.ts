import axiosInstance from "@/shared/lib/apiClient";
import { TypeInscriptions } from "../types/typesInscriptionsTypes";

export type UpdateTypeInscriptionInput = {
  descriptions?: string;
  value?: number;
};

export async function updateTypeInscription(
  typeInscriptionId: string,
  input: UpdateTypeInscriptionInput
): Promise<TypeInscriptions> {
  try {
    const response = await axiosInstance.put<TypeInscriptions>(
      `/type-inscription/${typeInscriptionId}`,
      input
    );
    return response.data;
  } catch (error) {
    console.error("Error updating type inscription:", error);
    throw new Error("Falha ao atualizar tipo de inscrição");
  }
}
