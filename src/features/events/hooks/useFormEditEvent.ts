import { useState } from "react";
import { toast } from "sonner";
import { deleteEvent } from "../api/deleteEvent";
import { updateEvent } from "../api/updateEvent";
import { Event, UpdateEventInput } from "../types/eventTypes";
import { useEventInscriptions } from "./useEventInscriptions";
import { useEventPayment } from "./useEventPayment";
import { useInvalidateEventsQuery } from "./useEventsQuery";

export function useFormEditEvent(event: Event) {
  const { invalidateDetail, invalidateList } = useInvalidateEventsQuery();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { loading: paymentLoading, updatePayment } = useEventPayment();
  const { loading: inscriptionsLoading, updateInscriptions } =
    useEventInscriptions();
  const [formData, setFormData] = useState({
    name: event.name,
    description: event.description || "",
    startDate: event.startDate.split("T")[0],
    endDate: event.endDate.split("T")[0],
    startTime: event.startDate.includes("T")
      ? event.startDate.split("T")[1].substring(0, 5)
      : "00:00",
    endTime: event.endDate.includes("T")
      ? event.endDate.split("T")[1].substring(0, 5)
      : "00:00",
    location: event.location || "",
    maxParticipants: event.maxParticipants || 0,
    ticketPrice: event.ticketPrice || 0,
    status: event.status || "CLOSE",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // Combinar data e hora
      const startDate = `${formData.startDate}T${formData.startTime}:00`;
      const endDate = `${formData.endDate}T${formData.endTime}:00`;

      const updateData: UpdateEventInput = {
        name: formData.name,
        description: formData.description,
        startDate,
        endDate,
        location: formData.location,
        maxParticipants: formData.maxParticipants || undefined,
        ticketPrice: formData.ticketPrice || undefined,
        status: formData.status,
      };

      await updateEvent(event.id, updateData);

      // Invalidar cache do evento e da lista de eventos
      invalidateDetail(event.id);
      invalidateList();

      toast.success("Evento atualizado com sucesso!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Erro ao atualizar evento");
      console.error("Error updating event:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita."
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      await deleteEvent(event.id);
      toast.success("Evento excluído com sucesso!");

      // Redirecionar para a lista de eventos
      window.location.href = "/super/events";
    } catch (error) {
      toast.error("Erro ao excluir evento");
      console.error("Error deleting event:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleUpdatePayment = async (paymentEnabled: boolean) => {
    const success = await updatePayment(event.id, paymentEnabled);
    if (success) {
      // Invalidar cache do evento
      invalidateDetail(event.id);
      invalidateList();
    }
  };

  const handleUpdateInscription = async (status: "OPEN" | "CLOSE") => {
    const success = await updateInscriptions(event.id, status);
    if (success) {
      // Invalidar cache do evento
      invalidateDetail(event.id);
      invalidateList();
    }
  };

  const handleCancel = () => {
    setFormData({
      name: event.name,
      description: event.description || "",
      startDate: event.startDate.split("T")[0],
      endDate: event.endDate.split("T")[0],
      startTime: event.startDate.includes("T")
        ? event.startDate.split("T")[1].substring(0, 5)
        : "00:00",
      endTime: event.endDate.includes("T")
        ? event.endDate.split("T")[1].substring(0, 5)
        : "00:00",
      location: event.location || "",
      maxParticipants: event.maxParticipants || 0,
      ticketPrice: event.ticketPrice || 0,
      status: event.status || "CLOSE",
    });
    setIsEditing(false);
  };

  return {
    isEditing,
    setIsEditing,
    loading: loading || paymentLoading || inscriptionsLoading,
    formData,
    handleInputChange,
    handleSave,
    handleDelete,
    handleCancel,
    handleUpdatePayment,
    handleUpdateInscription,
  };
}
