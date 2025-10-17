import axiosInstance from "@/shared/lib/apiClient";
import {
  InscriptionDetailRequest,
  InscriptionDetailResponse,
} from "../types/analysisTypes";

export async function getInscriptionDetails(
  inscriptionId: string,
  params: InscriptionDetailRequest
): Promise<InscriptionDetailResponse> {
  try {
    const { data } = await axiosInstance.get<InscriptionDetailResponse>(
      `/inscriptions/${inscriptionId}/analytics`,
      {
        params: {
          page: params.page,
          pageSize: params.pageSize,
        },
      }
    );
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching inscription details:", error);
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    throw new Error(
      axiosError.response?.data?.message ||
        "Falha ao carregar detalhes da inscrição"
    );
  }
}
