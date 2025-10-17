import axiosInstance from "@/shared/lib/apiClient";
import { CreateInscriptionAvulRequest } from "../types/avulsaTypes";

export async function createAvulsaRegistration(
  input: CreateInscriptionAvulRequest
): Promise<{ id: string }> {
  try {
    const { data } = await axiosInstance.post<{ id: string }>(
      "/inscriptions/avulsa",
      input
    );
    return data;
  } catch (error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    throw new Error(
      axiosError.response?.data?.message || "Falha ao criar inscrição avulsa"
    );
  }
}
