import axiosInstance from "@/shared/lib/apiClient";
import { GroupInscriptionConfirmationData } from "../types/inscriptionGrupTypes";

export interface SubmitGroupInscriptionParams {
  responsible: string;
  phone: string;
  eventId: string;
  file: File;
}

export async function submitGroupInscription(
  data: SubmitGroupInscriptionParams
): Promise<GroupInscriptionConfirmationData> {
  const formData = new FormData();
  formData.append("responsible", data.responsible);
  formData.append("phone", data.phone);
  formData.append("eventId", data.eventId);
  formData.append("file", data.file);

  const response = await axiosInstance.post(
    "inscriptions/group/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  console.log(response.data);
  return response.data;
}
