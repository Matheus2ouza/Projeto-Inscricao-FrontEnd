"use client";

import { useGlobalLoading } from "@/components/GlobalLoading";
import { useCallback, useEffect, useState } from "react";
import { getAllInscriptions } from "../api/getInscriptions";
import {
  getAllInscriptionsResponse,
  UsePaymentsParams,
  UsePaymentsResult,
} from "../types/InscriptionsTypes";

export function useInscriptions({
  initialPage = 1,
  pageSize = 10,
  eventId = null,
  limitTime = null,
}: UsePaymentsParams = {}): UsePaymentsResult {
  const [inscriptions, setInscriptions] = useState<
    getAllInscriptionsResponse["inscription"]
  >([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [pageCount, setPageCount] = useState(0);
  const [totalInscription, setTotalInscription] = useState(0);
  const [totalParticipant, setTotalParticipant] = useState(0);
  const [totalDebt, setTotalDebt] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setLoading: setGlobalLoading } = useGlobalLoading();

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setGlobalLoading(true);
    setError(null);

    try {
      const data: getAllInscriptionsResponse = await getAllInscriptions({
        page,
        pageSize,
        eventId,
        limitTime: limitTime,
      });

      setInscriptions(data.inscription);
      setTotal(data.total);
      setPageCount(data.pageCount);
      setTotalInscription(data.totalInscription);
      setTotalParticipant(data.totalParticipant);
      setTotalDebt(data.totalDebt);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Falha ao carregar pagamentos";
      setError(errorMessage);
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  }, [page, pageSize, eventId, limitTime, setGlobalLoading]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return {
    inscriptions,
    total,
    page,
    pageCount,
    totalInscription,
    totalParticipant,
    totalDebt,
    loading,
    error,
    setPage,
    refetch: fetchPayments,
  };
}
