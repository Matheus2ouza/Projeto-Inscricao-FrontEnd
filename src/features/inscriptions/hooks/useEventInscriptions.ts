"use client";

import { useGlobalLoading } from "@/components/GlobalLoading";
import { useCallback, useEffect, useState } from "react";
import { getAllInscriptions } from "../api/getAllInscriptions";
import { Event, Inscriptions } from "../types/InscriptionsTypes";

type UseEventInscriptionsParams = {
  eventId: string;
  initialPage?: number;
  pageSize?: number;
  initialLimitTime?: string;
};

export type UseEventInscriptionsResult = {
  event: Event | null;
  inscriptions: Inscriptions;
  total: number;
  page: number;
  pageCount: number;
  totalInscription: number;
  totalParticipant: number;
  totalDebt: number;
  limitTime: string;
  setLimitTime: (value: string) => void;
  loading: boolean;
  error: string | null;
  setPage: (page: number) => void;
  refetch: () => Promise<void>;
};

/**
 * Converte o valor do período (ex: "1h", "24h", "7d", "30d") para uma data/hora ISO
 * que representa o limite inferior para filtrar as inscrições
 */
const convertLimitTimeToISO = (limitTime: string): string | undefined => {
  if (limitTime === "all" || !limitTime) {
    return undefined;
  }

  const now = new Date();
  let limitDate: Date;

  // Parse do formato: "1h", "24h", "7d", "30d"
  if (limitTime.endsWith("h")) {
    const hours = parseInt(limitTime.replace("h", ""), 10);
    limitDate = new Date(now.getTime() - hours * 60 * 60 * 1000);
  } else if (limitTime.endsWith("d")) {
    const days = parseInt(limitTime.replace("d", ""), 10);
    limitDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  } else {
    // Se não conseguir parsear, retorna undefined
    return undefined;
  }

  // Retorna em formato ISO string
  return limitDate.toISOString();
};

export function useEventInscriptions({
  eventId,
  initialPage = 1,
  pageSize = 10,
  initialLimitTime = "all",
}: UseEventInscriptionsParams): UseEventInscriptionsResult {
  const [event, setEvent] = useState<Event | null>(null);
  const [inscriptions, setInscriptions] = useState<Inscriptions>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [pageCount, setPageCount] = useState(0);
  const [totalInscription, setTotalInscription] = useState(0);
  const [totalParticipant, setTotalParticipant] = useState(0);
  const [totalDebt, setTotalDebt] = useState(0);
  const [limitTime, setLimitTimeState] = useState(initialLimitTime);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setLoading: setGlobalLoading } = useGlobalLoading();

  const fetchEventInscriptions = useCallback(async () => {
    if (!eventId) return;

    setLoading(true);
    setGlobalLoading(true);
    setError(null);

    try {
      // Converte o limitTime para o formato ISO esperado pelo backend
      const convertedLimitTime = convertLimitTimeToISO(limitTime);

      const data = await getAllInscriptions(eventId, {
        page,
        pageSize,
        limitTime: convertedLimitTime,
      });

      const eventData = data.events?.[0] ?? null;

      setEvent(eventData);
      setInscriptions(eventData?.inscriptions ?? []);
      setTotal(data.total);
      setPageCount(data.pageCount);
      setTotalInscription(data.totalInscription);
      setTotalParticipant(data.totalParticipant);
      setTotalDebt(data.totalDebt);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Falha ao carregar inscrições do evento";
      setError(errorMessage);
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  }, [eventId, limitTime, page, pageSize, setGlobalLoading]);

  useEffect(() => {
    fetchEventInscriptions();
  }, [fetchEventInscriptions]);

  const handleSetLimitTime = (value: string) => {
    setLimitTimeState(value);
    setPage(1);
  };

  return {
    event,
    inscriptions,
    total,
    page,
    pageCount,
    totalInscription,
    totalParticipant,
    totalDebt,
    limitTime,
    setLimitTime: handleSetLimitTime,
    loading,
    error,
    setPage,
    refetch: fetchEventInscriptions,
  };
}
