"use client";

import EventMap from "@/shared/components/EventMap";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import axiosInstance from "@/shared/lib/apiClient";
import { Calendar, Loader2, MapPin, Share2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  status: "OPEN" | "CLOSE" | "FINALIZED";
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
  const [error, setError] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [loading, setLoading] = useState(false);

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

  // Função para quando a imagem carregar
  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // Função para tratar erro no carregamento da imagem
  const handleImageError = () => {
    setImageLoading(false);
    // Você pode adicionar lógica adicional aqui se quiser
  };

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

    // Se as inscrições estão fechadas (CLOSE)
    if (event.status === "CLOSE") {
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

  const handleOpenRoute = () => {
    if (!event) return;

    const destination = `${event.latitude}, ${event.longitude}`;
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;

    window.open(mapsUrl, "_blank");
  };

  const handleSubscribe = () => {
    router.push(`/login`);
  };

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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header com imagem - MAIS ESPAÇO VERTICAL */}
        <div className="relative rounded-xl lg:rounded-2xl overflow-hidden mb-8 lg:mb-10">
          <div className="relative w-full max-h-[400px] aspect-[3/2] bg-muted">
            {event.imageUrl ? (
              <>
                {/* Loading overlay para a imagem */}
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                )}

                <Image
                  src={event.imageUrl}
                  alt={event.name}
                  fill
                  decoding="async"
                  className={`object-cover ${
                    imageLoading ? "opacity-0" : "opacity-100"
                  } transition-opacity duration-300`}
                  priority
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              </>
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground text-sm sm:text-xl">
                  Sem imagem
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40" />

            {/* Badge de status - posição responsiva */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8">
              <Badge
                className={`${status.color} text-white px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base lg:text-lg`}
              >
                {status.label}
              </Badge>
            </div>

            {/* Conteúdo do header - posição responsiva com MAIS ESPAÇO */}
            <div className="absolute bottom-6 left-4 sm:bottom-10 sm:left-8 lg:bottom-6 lg:left-10">
              <h1 className="sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 lg:mb-5 line-clamp-2">
                {event.name}
              </h1>
              <div className="flex items-center gap-2 text-white/90 text-sm sm:text-lg lg:text-xl">
                <MapPin className="h-4 w-4 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
                <span>{event.regionName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Resto do código permanece igual */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 lg:mb-8">
          <Button
            variant="outline"
            className="flex-1 justify-center gap-2 sm:gap-3 py-4 sm:py-6 text-sm sm:text-base"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
            Compartilhar
          </Button>
          <Button
            variant="outline"
            className="flex-1 justify-center gap-2 sm:gap-3 py-4 sm:py-6 text-sm sm:text-base"
            onClick={handleAddToCalendar}
          >
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
            Adicionar à Agenda
          </Button>
          <Button
            variant="outline"
            className="flex-1 justify-center gap-2 sm:gap-3 py-4 sm:py-6 text-sm sm:text-base"
            onClick={handleOpenRoute}
          >
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
            Traçar Rota
          </Button>
        </div>

        {/* Conteúdo principal em layout responsivo */}
        <div className="space-y-6 lg:space-y-8">
          {/* Datas - Grid responsivo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="border border-border rounded-lg sm:rounded-xl p-4 sm:p-6 bg-card">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 bg-muted rounded-lg sm:rounded-xl">
                  <Calendar className="h-4 w-4 sm:h-6 sm:w-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium text-card-foreground text-sm sm:text-base">
                    Data de Início
                  </h3>
                  <p className="text-lg sm:text-xl font-semibold text-card-foreground mt-1">
                    {formatDate(event.startDate)}
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-border rounded-lg sm:rounded-xl p-4 sm:p-6 bg-card">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 bg-muted rounded-lg sm:rounded-xl">
                  <Calendar className="h-4 w-4 sm:h-6 sm:w-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium text-card-foreground text-sm sm:text-base">
                    Data de Término
                  </h3>
                  <p className="text-lg sm:text-xl font-semibold text-card-foreground mt-1">
                    {formatDate(event.endDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Localização - Responsiva */}
          <div className="border border-border rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 bg-card">
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-card-foreground" />
              <h3 className="font-semibold text-card-foreground text-lg sm:text-xl">
                Localização
              </h3>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {/* Endereço */}
              <div>
                <p className="text-card-foreground text-base sm:text-lg font-medium mb-2">
                  Endereço
                </p>
                <p className="text-card-foreground/80 text-sm sm:text-base">
                  {event.location || "Local a ser definido"}
                </p>
              </div>

              {/* Mapa responsivo */}
              {event.latitude && event.longitude && (
                <div className="h-48 sm:h-64 lg:h-72 rounded-lg overflow-hidden border border-border">
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

          {/* Inscrições - Responsiva */}
          <div className="border border-border rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 bg-card">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-card-foreground text-lg sm:text-xl mb-2 sm:mb-3">
                  Inscrições
                </h3>
                <p
                  className={`font-medium text-base sm:text-lg ${
                    subscriptionStatus.status === "open"
                      ? "text-green-600"
                      : subscriptionStatus.status === "closed"
                        ? "text-yellow-600"
                        : "text-red-600"
                  }`}
                >
                  {subscriptionStatus.label}
                </p>
                <p className="text-muted-foreground text-xs sm:text-sm mt-1">
                  {subscriptionStatus.description}
                </p>
              </div>
              <Button
                size="lg"
                className={`font-semibold text-sm sm:text-base px-6 py-4 sm:px-8 sm:py-6 dark: text-white w-full sm:w-auto ${
                  subscriptionStatus.status !== "open"
                    ? "bg-muted text-muted-foreground hover:bg-muted cursor-not-allowed "
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
