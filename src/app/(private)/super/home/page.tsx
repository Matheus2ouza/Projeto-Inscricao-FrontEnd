"use client";

import { useGlobalLoading } from "@/components/GlobalLoading";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import SuperHomeDashboard from "@/features/home/components/super/SuperHomeDashboard";
import { useUserRole } from "@/shared/hooks/useUserRole";
import { useEffect } from "react";

export default function SuperHomePage() {
  const { setLoading } = useGlobalLoading();
  const { loading } = useUserRole();

  useEffect(() => {
    setLoading(loading);
    return () => setLoading(false);
  }, [loading, setLoading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <Spinner
          variant="infinite"
          size={160}
          className="text-primary drop-shadow-lg"
        />
      </div>
    );
  }

  return <SuperHomeDashboard />;
}
