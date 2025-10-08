"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/shared/lib/apiClient";
import Image from "next/image";
import { Calendar, MapPin, Share2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import EventMap from "@/shared/components/EventMap";

type EventDetail = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  regionName: string;
  location: string;
  latitude: number;
  longitude: number;
  isOpen: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const resolvedParams = await params;
        const { data } = await axiosInstance.get<EventDetail>(
          `/events/${resolvedParams.id}`
        );
        setEvent(data);
      } catch (err) {
        setError("Erro ao carregar evento");
        console.error("Error fetching event:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [params]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getEventStatus = () => {
    if (!event)
      return {
        status: "loading",
        label: "Carregando...",
        color: "bg-gray-500",
      };

    const now = new Date();
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);

    if (now < start)
      return { status: "soon", label: "Em Breve", color: "bg-blue-500" };
    if (now > end)
      return { status: "finalized", label: "Encerrado", color: "bg-gray-500" };
    return { status: "ongoing", label: "Ao Vivo", color: "bg-green-500" };
  };

  const getSubscriptionStatus = () => {
    if (!event) return { status: "loading", label: "Carregando..." };

    const eventStatus = getEventStatus();

    // Se o evento já finalizou
    if (eventStatus.status === "finalized") {
      return {
        status: "finalized",
        label: "Inscrições Encerradas",
        description: "Este evento já foi finalizado",
      };
    }

    // Se as inscrições estão fechadas (CLOSED)
    if (!event.isOpen) {
      return {
        status: "closed",
        label: "Inscrições Fechadas",
        description: "As inscrições ainda não foram abertas",
      };
    }

    // Se as inscrições estão abertas
    return {
      status: "open",
      label: "Inscrições Abertas",
      description: "Inscreva-se agora para participar",
    };
  };

  const handleShare = () => {
    if (event && navigator.share) {
      navigator.share({
        title: event.name,
        text: `Confira o evento: ${event.name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copiado para a área de transferência!");
    }
  };

  const handleAddToCalendar = () => {
    if (!event) return;

    const startDate = new Date(event.startDate)
      .toISOString()
      .replace(/-|:|\.\d+/g, "");
    const endDate = new Date(event.endDate)
      .toISOString()
      .replace(/-|:|\.\d+/g, "");

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.name
    )}&dates=${startDate}/${endDate}&details=${encodeURIComponent(
      `Evento: ${event.name}\nLocal: ${event.location || "A definir"}`
    )}`;

    window.open(calendarUrl, "_blank");
  };

  const handleSubscribe = () => {
    if (!event) return;

    // Redireciona para a página de login com o evento ID como parâmetro
    router.push(`/login?redirect=/events/${event.id}/subscribe`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando evento...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-foreground">
            {error || "Evento não encontrado"}
          </p>
          <Button onClick={() => window.location.reload()}>
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  const status = getEventStatus();
  const subscriptionStatus = getSubscriptionStatus();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header com imagem - mais largo */}
        <div className="relative rounded-2xl overflow-hidden mb-8">
          <div className="relative w-full aspect-[4/1] bg-muted">
            {event.imageUrl ? (
              <Image
                src={event.imageUrl}
                alt={event.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground text-xl">
                  Sem imagem
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40" />

            <div className="absolute top-6 right-6">
              <Badge
                className={`${status.color} text-white px-4 py-2 text-base`}
              >
                {status.label}
              </Badge>
            </div>

            <div className="absolute bottom-8 left-8">
              <h1 className="text-4xl font-bold text-white mb-3">
                {event.name}
              </h1>
              <div className="flex items-center gap-2 text-white/90 text-lg">
                <MapPin className="h-5 w-5" />
                <span>{event.regionName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ações rápidas - Horizontal com mais espaço */}
        <div className="flex gap-4 mb-8">
          <Button
            variant="outline"
            className="flex-1 justify-center gap-3 py-6 text-base"
            onClick={handleShare}
          >
            <Share2 className="h-5 w-5" />
            Compartilhar Evento
          </Button>
          <Button
            variant="outline"
            className="flex-1 justify-center gap-3 py-6 text-base"
            onClick={handleAddToCalendar}
          >
            <Calendar className="h-5 w-5" />
            Adicionar à Agenda
          </Button>
        </div>

        {/* Conteúdo principal em layout mais amplo */}
        <div className="space-y-8">
          {/* Datas - com mais espaço */}
          <div className="grid grid-cols-2 gap-6">
            <div className="border border-border rounded-xl p-6 bg-card">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-muted rounded-xl">
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium text-card-foreground text-base">
                    Data de Início
                  </h3>
                  <p className="text-xl font-semibold text-card-foreground mt-1">
                    {formatDate(event.startDate)}
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-border rounded-xl p-6 bg-card">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-muted rounded-xl">
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium text-card-foreground text-base">
                    Data de Término
                  </h3>
                  <p className="text-xl font-semibold text-card-foreground mt-1">
                    {formatDate(event.endDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Localização - com mapa largo */}
          <div className="border border-border rounded-xl p-8 bg-card">
            <div className="flex items-center gap-4 mb-6">
              <MapPin className="h-6 w-6 text-card-foreground" />
              <h3 className="font-semibold text-card-foreground text-xl">
                Localização
              </h3>
            </div>

            <div className="space-y-6">
              {/* Endereço */}
              <div>
                <p className="text-card-foreground text-lg font-medium mb-2">
                  Endereço
                </p>
                <p className="text-card-foreground/80">
                  {event.location || "Local a ser definido"}
                </p>
              </div>

              {/* Mapa largo */}
              {event.latitude && event.longitude && (
                <div className="h-64 rounded-lg overflow-hidden border border-border">
                  <EventMap
                    lat={event.latitude}
                    lng={event.longitude}
                    height="100%"
                    zoom={15}
                    markerTitle={event.name}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Inscrições - mais amplo */}
          <div className="border border-border rounded-xl p-8 bg-card">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-card-foreground text-xl mb-3">
                  Inscrições
                </h3>
                <p
                  className={`font-medium text-lg ${
                    subscriptionStatus.status === "open"
                      ? "text-green-600"
                      : subscriptionStatus.status === "closed"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {subscriptionStatus.label}
                </p>
                <p className="text-muted-foreground text-sm mt-1">
                  {subscriptionStatus.description}
                </p>
              </div>
              <Button
                size="lg"
                className={`font-semibold text-base px-8 py-6 ${
                  subscriptionStatus.status !== "open"
                    ? "bg-muted text-muted-foreground hover:bg-muted cursor-not-allowed"
                    : ""
                }`}
                disabled={subscriptionStatus.status !== "open"}
                onClick={handleSubscribe}
              >
                {subscriptionStatus.status === "finalized"
                  ? "Evento Encerrado"
                  : subscriptionStatus.status === "closed"
                  ? "Inscrições Fechadas"
                  : "Inscrever-se"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
