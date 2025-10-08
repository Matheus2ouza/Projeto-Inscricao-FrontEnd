import axiosInstance from "@/shared/lib/apiClient";
import { TypeInscriptions } from "../types/typesInscriptionsTypes";

export async function getTypeInscriptionsByEvent(
  eventId: string
): Promise<TypeInscriptions[]> {
  try {
    const response = await axiosInstance.get<TypeInscriptions[]>(
      `/type-inscription/event/${eventId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching type inscriptions:", error);
    throw new Error("Falha ao carregar tipos de inscrição");
  }
}
