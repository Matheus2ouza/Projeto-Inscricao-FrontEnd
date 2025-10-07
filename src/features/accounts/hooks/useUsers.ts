"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getUsers,
  type GetUsersResponse,
  type UserDto,
} from "@/features/accounts/api/getUsers";

type UseUsersParams = {
  initialPage?: number;
  pageSize?: number;
};

type UseUsersResult = {
  users: UserDto[];
  total: number;
  page: number;
  pageCount: number;
  loading: boolean;
  error: string | null;
  setPage: (p: number) => void;
  refetch: () => Promise<void>;
};

export function useUsers({
  initialPage = 1,
  pageSize = 20,
}: UseUsersParams = {}): UseUsersResult {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data: GetUsersResponse = await getUsers({ page, pageSize });
      setUsers(data.users);
      setTotal(data.total);
      setPageCount(data.pageCount);
    } catch (e: any) {
      setError(e?.message ?? "Falha ao carregar usuários");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    total,
    page,
    pageCount,
    loading,
    error,
    setPage,
    refetch: fetchUsers,
  };
}
