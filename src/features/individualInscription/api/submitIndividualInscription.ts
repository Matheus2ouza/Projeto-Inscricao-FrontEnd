import axiosInstance from "@/shared/lib/apiClient";
import {
  IndividualInscriptionSubmit,
  IndivUploadRouteResponse,
} from "../types/individualInscriptionTypes";

export const submitIndividualInscription = async (
  data: IndividualInscriptionSubmit
): Promise<IndivUploadRouteResponse> => {
  try {
    const response = await axiosInstance.post<IndivUploadRouteResponse>(
      "/inscriptions/indiv/upload",
      data
    );

    console.log(response.data);
    return response.data;
  } catch (error: unknown) {
    console.error("Erro ao enviar inscrição individual:", error);

    // Type guard para verificar se é um erro do Axios
    const isAxiosError = (
      err: unknown
    ): err is {
      response?: {
        data?: {
          message?: string;
          error?: string;
        };
      };
      message?: string;
    } => {
      return (
        typeof err === "object" &&
        err !== null &&
        ("response" in err || "message" in err)
      );
    };

    let errorMessage =
      "Erro inesperado. Por favor, tente novamente mais tarde.";

    if (isAxiosError(error)) {
      errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Erro inesperado. Por favor, tente novamente mais tarde.";
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    console.error("Mensagem de erro detalhada:", errorMessage);

    throw new Error(errorMessage);
  }
};
