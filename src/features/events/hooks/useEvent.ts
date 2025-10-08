import { useState, useEffect } from "react";
import { getEvent } from "../api/getEvent";
import { getTypeInscriptionsByEvent } from "@/features/typeInscription/api/getTypeInscriptionsByEvent";
import { Event } from "../types/eventTypes";

export function useEvent(eventId: string) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEventData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar dados básicos do evento
      const eventData = await getEvent(eventId);

      console.log("O eventId");
      console.log(eventId);
      // Buscar tipos de inscrição em paralelo
      const typesInscriptionsPromise = getTypeInscriptionsByEvent(eventId);

      const [typesInscriptions] = await Promise.all([typesInscriptionsPromise]);

      // Combinar os dados
      const completeEventData: Event = {
        ...eventData,
        typesInscriptions,
        countTypeInscriptions: typesInscriptions.length,
      };

      setEvent(completeEventData);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchEventData();
    }
  }, [eventId]);

  const refetch = () => {
    if (eventId) {
      fetchEventData();
    }
  };

  return { event, loading, error, refetch };
}
