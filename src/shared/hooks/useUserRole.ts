"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type RoleType = "USER" | "ADMIN" | "MANAGER" | "SUPER" | null;

type UseUserRoleResult = {
  role: RoleType;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useUserRole(): UseUserRoleResult {
  const [role, setRole] = useState<RoleType>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchRole = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/session", {
        method: "GET",
        cache: "no-store",
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });

      if (!res.ok) {
        setRole(null);
        setLoading(false);
        return;
      }

      const data = (await res.json()) as { role: RoleType };
      setRole(data.role ?? null);
    } catch (err: any) {
      if (err?.name !== "AbortError") {
        setError("Falha ao obter role");
        setRole(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRole();
  }, [fetchRole]);

  // Revalidar ao focar/visibilidade
  useEffect(() => {
    const onFocus = () => fetchRole();
    const onVisibility = () => {
      if (document.visibilityState === "visible") fetchRole();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
      abortRef.current?.abort();
    };
  }, [fetchRole]);

  const value = useMemo<UseUserRoleResult>(
    () => ({ role, loading, error, refetch: fetchRole }),
    [role, loading, error, fetchRole]
  );

  return value;
}
