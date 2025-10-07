"use client";

import { useEffect, useState } from "react";
import { getRegions, type RegionDto } from "@/features/regions/api/getRegions";

type UseRegionsResult = {
  regions: RegionDto[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useRegions(): UseRegionsResult {
  const [regions, setRegions] = useState<RegionDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRegions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRegions();
      setRegions(data);
    } catch (e: unknown) {
      const errorMessage =
        e instanceof Error ? e.message : "Falha ao carregar regiões";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegions();
  }, []);

  return { regions, loading, error, refetch: fetchRegions };
}
