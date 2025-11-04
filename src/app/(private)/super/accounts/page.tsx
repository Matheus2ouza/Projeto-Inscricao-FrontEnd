"use client";

import AccountsTable from "@/features/accounts/components/AccountsTable";
import { useUsers } from "@/features/accounts/hooks/useUsers";
import { useRegions } from "@/features/regions/hooks/useRegions";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";

export default function AccountsPage() {
  const {
    users,
    total,
    page,
    pageCount,
    loading: usersLoading,
    error: usersError,
    setPage,
    refetch: refetchUsers,
  } = useUsers({ pageSize: 20 });

  const {
    regions,
    loading: regionsLoading,
    error: regionsError,
    refetch: refetchRegions,
  } = useRegions();

  const loading = usersLoading || regionsLoading;
  const errorMessage = usersError ?? regionsError;

  const handleRetry = async () => {
    await Promise.all([refetchUsers(), refetchRegions()]);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center gap-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-[420px] w-full" />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="p-6 flex flex-col items-center justify-center gap-4 min-h-[60vh] text-center">
        <p className="text-muted-foreground">
          Erro ao carregar contas: {errorMessage}
        </p>
        <Button onClick={handleRetry}>Tentar novamente</Button>
      </div>
    );
  }

  return (
    <AccountsTable
      users={users}
      total={total}
      page={page}
      pageCount={pageCount}
      onPageChange={setPage}
      regions={regions}
    />
  );
}
