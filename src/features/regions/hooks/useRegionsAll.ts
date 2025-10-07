import { useCallback, useEffect, useState } from "react";
import {
  RegionsDto,
  UseRegionsParams,
  UseRegionsResult,
  getAllRegionsResponse,
} from "../types/regionsTypes";
import { getAllRegions } from "../api/getRegions";

export function useRegionsAll({
  initialPage = 1,
  pageSize = 4,
}: UseRegionsParams = {}): UseRegionsResult {
  const [regions, setRegions] = useState<RegionsDto[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRegions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data: getAllRegionsResponse = await getAllRegions({
        page,
        pageSize,
      });
      setRegions(data.regions);
      setTotal(data.total);
      setPageCount(data.pageCount);
    } catch (error: any) {
      setError(error?.message ?? "Falha ao carregar regiões");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchRegions();
  }, [fetchRegions]);

  return {
    regions,
    total,
    page,
    pageCount,
    loading,
    error,
    setPage,
    refetch: fetchRegions,
  };
}
