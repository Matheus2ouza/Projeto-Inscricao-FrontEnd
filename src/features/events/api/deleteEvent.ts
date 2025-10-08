import axiosInstance from "@/shared/lib/apiClient";

export async function deleteEvent(eventId: string): Promise<void> {
  try {
    await axiosInstance.delete(`/events/${eventId}`);
  } catch (error) {
    console.error("Error deleting event:", error);
    throw new Error("Falha ao excluir evento");
  }
}
