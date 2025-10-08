"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEvent } from "@/features/events/hooks/useEvent";
import EventManagement from "@/features/events/components/EventManagement";
import { Button } from "@/shared/components/ui/button";

export default function EventManagementPage() {
  const params = useParams();
  const eventId = params.id as string;
  const { event, loading, error, refetch } = useEvent(eventId); // Adicione refetch aqui

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando evento...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-gray-900">
            {error || "Evento não encontrado"}
          </p>
          <Button asChild>
            <Link href="/super/events">Voltar para Eventos</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <EventManagement event={event} refetch={refetch} />;
}
