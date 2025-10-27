import axiosInstance from "@/shared/lib/apiClient";
import {
  AnalysisInscriptionResponse,
  InscriptionDetailRequest,
} from "../types/analysisTypes";

export async function getInscriptionDetails(
  inscriptionId: string,
  params: InscriptionDetailRequest
): Promise<AnalysisInscriptionResponse> {
  try {
    const { data } = await axiosInstance.get<AnalysisInscriptionResponse>(
      `/inscriptions/${inscriptionId}/analytics`,
      {
        params: {
          page: params.page,
          pageSize: params.pageSize,
        },
      }
    );

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
