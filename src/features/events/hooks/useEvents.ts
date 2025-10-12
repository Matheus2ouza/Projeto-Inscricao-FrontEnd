"use client";

import { useEffect, useState } from "react";
import { getEventsName } from "../api/getEvents";
import { EventDto } from "../types/eventTypes";

type UseEventsResult = {
  events: EventDto[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useEvents(): UseEventsResult {
  const [events, setEvents] = useState<EventDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRegions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEventsName();
      setEvents(data);
    } catch (e: unknown) {
      const errorMessage =
        e instanceof Error ? e.message : "Falha ao carregar os eventos";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegions();
  }, []);

  return { events, loading, error, refetch: fetchRegions };
}
