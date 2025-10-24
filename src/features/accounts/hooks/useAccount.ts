"use client";

import { useEffect, useState } from "react";
import { getAccont, type AccountDto } from "../api/getUsersCombobox";

type UseAccountResult = {
  regions: AccountDto[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useAccount(): UseAccountResult {
  const [regions, setRegions] = useState<AccountDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRegions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAccont();
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
