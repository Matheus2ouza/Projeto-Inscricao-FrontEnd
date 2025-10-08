"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/shared/lib/apiClient";
import Image from "next/image";
import { Calendar, MapPin, Clock, Share2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";

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
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const resolvedParams = await params;
        const { data } = await axiosInstance.get<EventDetail>(`/events/me`, {
          params: { id: resolvedParams.id },
        });
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

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
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
      return { status: "finished", label: "Encerrado", color: "bg-gray-500" };
    return { status: "ongoing", label: "Ao Vivo", color: "bg-green-500" };
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
          <Button onClick={() => window.location.reload()}>
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  const status = getEventStatus();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header com imagem - mais largo */}
        <div className="relative rounded-2xl overflow-hidden mb-8">
          <div className="relative w-full aspect-[4/1] bg-gray-200">
            {event.imageUrl ? (
              <Image
                src={event.imageUrl}
                alt={event.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-500 text-xl">Sem imagem</span>
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
            className="flex-1 justify-center gap-3 border-gray-300 py-6 text-base"
            onClick={handleShare}
          >
            <Share2 className="h-5 w-5" />
            Compartilhar Evento
          </Button>
          <Button
            variant="outline"
            className="flex-1 justify-center gap-3 border-gray-300 py-6 text-base"
            onClick={handleAddToCalendar}
          >
            <Calendar className="h-5 w-5" />
            Adicionar à Agenda
          </Button>
        </div>

        {/* Conteúdo principal em layout mais amplo */}
        <div className="space-y-8">
          {/* Datas e horários - com mais espaço */}
          <div className="grid grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 rounded-xl">
                  <Calendar className="h-6 w-6 text-gray-700" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 text-base">
                    Início
                  </h3>
                  <p className="text-xl font-semibold text-gray-900 mt-1">
                    {formatDate(event.startDate)}
                  </p>
                  <p className="text-gray-600 text-base mt-1">
                    {formatTime(event.startDate)}
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 rounded-xl">
                  <Clock className="h-6 w-6 text-gray-700" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 text-base">
                    Término
                  </h3>
                  <p className="text-xl font-semibold text-gray-900 mt-1">
                    {formatDate(event.endDate)}
                  </p>
                  <p className="text-gray-600 text-base mt-1">
                    {formatTime(event.endDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Localização - mais amplo */}
          <div className="border border-gray-200 rounded-xl p-8">
            <div className="flex items-center gap-4 mb-4">
              <MapPin className="h-6 w-6 text-gray-700" />
              <h3 className="font-semibold text-gray-900 text-xl">
                Localização
              </h3>
            </div>
            <p className="text-gray-900 text-lg">
              {event.location || "Local a ser definido"}
            </p>
          </div>

          {/* Inscrições - mais amplo */}
          <div className="border border-gray-200 rounded-xl p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 text-xl mb-3">
                  Inscrições
                </h3>
                <p
                  className={`font-medium text-lg ${
                    event.isOpen ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {event.isOpen
                    ? "Inscrições abertas"
                    : "Inscrições encerradas"}
                </p>
              </div>
              <Button
                size="lg"
                className={`font-semibold text-base px-8 py-6 ${
                  !event.isOpen || status.status === "finished"
                    ? "bg-gray-400 hover:bg-gray-400"
                    : "bg-gray-900 hover:bg-gray-800"
                }`}
                disabled={!event.isOpen || status.status === "finished"}
              >
                {status.status === "finished"
                  ? "Evento Encerrado"
                  : event.isOpen
                  ? "Inscrever-se"
                  : "Inscrições Fechadas"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
