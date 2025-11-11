"use client";

import { EventInscriptionsTable } from "@/features/inscriptions/components/EventInscriptionsTable";
import { useEventInscriptions } from "@/features/inscriptions/hooks/useEventInscriptions";
import PageContainer from "@/shared/components/layout/PageContainer";
import { useParams, useRouter } from "next/navigation";

export default function MyEventInscriptionsPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId as string;

  const handleBack = () => {
    // Voltar para a página do evento
    router.push(`/user/MyInscriptions`);
  };

  const {
    event,
    inscriptions,
    page,
    pageCount,
    totalInscription,
    totalParticipant,
    totalDebt,
    limitTime,
    setLimitTime,
    loading,
    error,
    setPage,
    refetch,
  } = useEventInscriptions({
    eventId,
    pageSize: 10,
  });

  return (
    <PageContainer
      title="Inscrições do Evento"
      description="Visualize todas as inscrições do evento selecionado"
      showBackButton={true}
      backButtonAction={handleBack}
    >
      <EventInscriptionsTable
        event={event}
        inscriptions={inscriptions}
        page={page}
        pageCount={pageCount}
        totalInscription={totalInscription}
        totalParticipant={totalParticipant}
        totalDebt={totalDebt}
        limitTime={limitTime}
        setLimitTime={setLimitTime}
        setPage={setPage}
        loading={loading}
        error={error}
        refetch={refetch}
      />
    </PageContainer>
  );
}
