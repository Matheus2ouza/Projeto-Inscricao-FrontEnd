"use client";

import DetailsInscriptionsTable from "@/features/inscriptions/components/DetailsInscriptionTable";
import { useInscriptionDetails } from "@/features/inscriptions/hooks/useInscriptionDetails";
import { useParams } from "next/navigation";

export default function DetailsInscriptionsPage() {
  const params = useParams();
  const inscriptionId = params.id as string;

  const { data, isLoading, error } = useInscriptionDetails({ inscriptionId });

  return (
    <DetailsInscriptionsTable
      data={data}
      isLoading={isLoading}
      error={error?.message || null}
    />
  );
}
