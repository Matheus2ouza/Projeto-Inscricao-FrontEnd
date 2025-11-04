"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAccont, type AccountDto } from "../api/getUsersCombobox";

export const accountsKeys = {
  all: ["accounts"] as const,
  lists: () => [...accountsKeys.all, "list"] as const,
  combobox: () => [...accountsKeys.lists(), "combobox"] as const,
  details: () => [...accountsKeys.all, "detail"] as const,
  detail: (id: string) => [...accountsKeys.details(), id] as const,
};

export function useAccountsComboboxQuery(enabled: boolean = true) {
  return useQuery<AccountDto[]>({
    queryKey: accountsKeys.combobox(),
    queryFn: () => getAccont(),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useInvalidateAccountsQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateCombobox: () =>
      queryClient.invalidateQueries({ queryKey: accountsKeys.combobox() }),
    invalidateAll: () =>
      queryClient.invalidateQueries({ queryKey: accountsKeys.all }),
  };
}
