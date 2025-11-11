"use client";

import { useGlobalLoading } from "@/components/GlobalLoading";
import { useCallback, useEffect, useState } from "react";
import { getEventsWithInscriptions } from "../api/getEventsWithInscriptions";
import {
  Events,
  UsePaymentsParams,
  UsePaymentsResult,
} from "../types/InscriptionsTypes";

export function useInscriptions({
  initialPage = 1,
  pageSize = 10,
}: UsePaymentsParams = {}): UsePaymentsResult {
  const [events, setEvents] = useState<Events>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setLoading: setGlobalLoading } = useGlobalLoading();

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setGlobalLoading(true);
    setError(null);

    try {
      const data = await getEventsWithInscriptions({
        page,
        pageSize,
      });

      setEvents(data.events);
      setTotal(data.total);
      setPageCount(data.pageCount);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Falha ao carregar eventos";
      setError(errorMessage);
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  }, [page, pageSize, setGlobalLoading]);

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
