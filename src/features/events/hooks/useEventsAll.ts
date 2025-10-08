import { useCallback, useEffect, useState } from "react";
import {
  Event,
  getAllEventsResponse,
  UseEventsParams,
  UseEventsResult,
} from "../types/eventTypes";
import { getEvents } from "../api/getEvents";

export function useEventsAll({
  initialPage = 1,
  pageSize = 4,
}: UseEventsParams = {}): UseEventsResult {
  const [events, setEvents] = useState<Event[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data: getAllEventsResponse = await getEvents({ page, pageSize });
      console.log(data);
      setEvents(data.events);
      setTotal(data.total);
      setPageCount(data.pageCount);
    } catch (error) {
      setError((error as Error)?.message ?? "Falha ao carregar eventos");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    total,
    page,
    pageCount,
    loading,
    error,
    setPage,
    refetch: fetchEvents,
  };
}
