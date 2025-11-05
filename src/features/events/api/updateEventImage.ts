import axiosInstance from "@/shared/lib/apiClient";

type UpdateEventImageInput = {
  eventId: string;
  imageBase64: string; // data URL (jpeg)
};

export async function updateEventImage({ eventId, imageBase64 }: UpdateEventImageInput): Promise<void> {
  try {
    await axiosInstance.put(`/events/${eventId}/image`, {
      image: imageBase64,
    });
  } catch (error) {
    console.error("Error updating event image:", error);
    throw new Error("Falha ao atualizar imagem do evento");
  }
}


