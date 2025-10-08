import { useState } from "react";
import { toast } from "sonner";
import { updateEvent } from "../api/updateEvent";
import { deleteEvent } from "../api/deleteEvent";
import { Event, UpdateEventInput } from "../types/eventTypes";

export function useFormEditEvent(event: Event) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
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
    isOpen: event.isOpen || false,
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
        isOpen: formData.isOpen,
      };

      await updateEvent(event.id, updateData);
      toast.success("Evento atualizado com sucesso!");
      setIsEditing(false);

      // Recarregar a página para refletir as mudanças
      window.location.reload();
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
      isOpen: event.isOpen || false,
    });
    setIsEditing(false);
  };

  return {
    isEditing,
    setIsEditing,
    loading,
    formData,
    handleInputChange,
    handleSave,
    handleDelete,
    handleCancel,
  };
}
