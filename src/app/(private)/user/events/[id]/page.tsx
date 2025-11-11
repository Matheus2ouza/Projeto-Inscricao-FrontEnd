"use client";

import DetailsEvent from "@/features/events/components/DetailsEvent";
import PageContainer from "@/shared/components/layout/PageContainer";
import { useParams } from "next/navigation";

export default function EventsDetailsPage() {
  const params = useParams();
  const eventId = params.id as string;

  return (
    <PageContainer
      title="Detalhes do Evento"
      description="Veja as informações completas antes de realizar sua inscrição"
    >
      <DetailsEvent eventId={eventId} />
    </PageContainer>
  );
}
