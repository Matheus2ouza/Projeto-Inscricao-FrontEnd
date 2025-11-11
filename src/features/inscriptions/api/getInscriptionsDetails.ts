import axiosInstance from "@/shared/lib/apiClient";
import { InscriptionDetails } from "../types/inscriptionsDetails.types";

export async function getInscriptionsDetails(
  inscriptionId: string,
): Promise<InscriptionDetails> {
  const { data } = await axiosInstance.get<InscriptionDetails>(
    `/inscriptions/${inscriptionId}/details`
  );
  return data;
}
