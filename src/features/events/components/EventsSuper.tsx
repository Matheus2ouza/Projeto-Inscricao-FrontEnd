"use client";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import { cn } from "@/shared/lib/utils";
import {
  AlertTriangle,
  Calendar,
  Check,
  Copy,
  DollarSign,
  ExternalLink,
  Eye,
  EyeClosed,
  MapPin,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useEventsAll } from "../hooks/useEventsAll";

const PAGE_SIZE = 4;

export default function EventsTableSuper() {
  const [open, setOpen] = useState(false);
  const [showAmount, setShowAmount] = useState<{ [key: string]: boolean }>({});
  const [copiedEventId, setCopiedEventId] = useState<string | null>(null);

  const { events, total, page, pageCount, loading, error, setPage, refetch } =
    useEventsAll({
      initialPage: 1,
      pageSize: PAGE_SIZE,
    });

  const toggleAmountVisibility = (eventId: string) => {
    setShowAmount((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getEventStatus = (startDate: string, endDate: string) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (today < start) return "futuro";
    if (today > end) return "passado";
    return "andamento";
  };

  const getStatusBadge = (startDate: string, endDate: string) => {
    const status = getEventStatus(startDate, endDate);
    switch (status) {
      case "futuro":
        return { label: "Agendado", color: "bg-green-600" };
      case "andamento":
        return { label: "Em Andamento", color: "bg-blue-600" };
      case "passado":
        return { label: "Realizado", color: "bg-red-600" };
      default:
        return { label: "Agendado", color: "bg-green-600" };
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const copyToClipboard = async (text: string, eventId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedEventId(eventId);

      // Resetar o estado após 2 segundos
      setTimeout(() => {
        setCopiedEventId(null);
      }, 2000);
    } catch (err) {
      console.error("Falha ao copiar texto: ", err);
    }
  };

  const openEventPage = (eventId: string) => {
    window.open(`/events/${eventId}`, "_blank");
  };

  // Estados de loading e error
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando eventos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center text-destructive">
          <p className="mb-4">Erro ao carregar eventos: {error}</p>
          <Button onClick={refetch}>Tentar Novamente</Button>
        </div>
      </div>
    );
  }

  const startIndex = (page - 1) * PAGE_SIZE;

  return (
    <div className="p-4 sm:p-6 relative">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Eventos
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Gerencie e visualize todos os eventos cadastrados
          </p>
        </div>
        <Button
          asChild
          variant="default"
          className="dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/80 w-full sm:w-auto"
        >
          <Link href="/super/events/create">Novo Evento</Link>
        </Button>
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 relative">
        {events.map((event) => {
          const statusBadge = getStatusBadge(event.startDate, event.endDate);
          const isCopied = copiedEventId === event.id;
          const hasTypeInscriptions = (event?.countTypeInscriptions ?? 0) > 0;

          return (
            <div
              key={event.id}
              className={cn("relative transition-all duration-300 ease-in-out")}
            >
              {/* Card personalizado sem bordas do shadcn */}
              <div
                className={cn(
                  "bg-card text-card-foreground flex flex-col transition-all duration-300 ease-in-out shadow-sm w-full overflow-hidden rounded-xl hover:shadow-md"
                )}
              >
                {/* Imagem do Evento - Ocupando toda a parte superior */}
                <div className="relative w-full aspect-[3/1.1] overflow-hidden">
                  {event.imageUrl ? (
                    <Image
                      src={event.imageUrl}
                      alt={event.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500" />
                  )}
                  <div className="absolute inset-0 bg-black/20" />
                  <Badge
                    className={`absolute top-3 right-3 ${statusBadge.color} text-white min-w-[100px] flex items-center justify-center text-xs`}
                  >
                    {statusBadge.label}
                  </Badge>
                </div>

                {/* Conteúdo do Card */}
                <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6">
                  {/* Header do Card */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3 sm:gap-4 w-full">
                      {/* Sigla do Evento */}
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-lg">
                          {event.name.substring(0, 2)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg sm:text-xl mb-1 sm:mb-2 line-clamp-2">
                          {event.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="text-xs flex items-center gap-1"
                          >
                            <MapPin className="h-3 w-3" />
                            Região {event.regionId}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Estatísticas - Responsivas */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {/* Participantes */}
                    <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {event.quantityParticipants}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Participantes
                        </p>
                      </div>
                    </div>

                    {/* Arrecadado */}
                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                        <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                              {showAmount[event.id]
                                ? formatCurrency(event.amountCollected)
                                : "****"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Arrecadado
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleAmountVisibility(event.id);
                            }}
                            className="ml-2 focus:outline-none flex-shrink-0"
                          >
                            {showAmount[event.id] ? (
                              <Eye className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 dark:text-green-400" />
                            ) : (
                              <EyeClosed className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 dark:text-green-400" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Informações Básicas */}
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                        <span className="text-xs sm:text-sm">
                          Data de Início:
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm font-medium">
                        {formatDate(event.startDate)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                        <span className="text-xs sm:text-sm">
                          Data de Término:
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm font-medium">
                        {formatDate(event.endDate)}
                      </span>
                    </div>
                  </div>

                  {/* Alerta para eventos sem tipos de inscrição */}
                  {!hasTypeInscriptions && (
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-1">
                            Configuração Pendente
                          </p>
                          <p className="text-xs text-amber-700 dark:text-amber-400">
                            Este evento ainda não tem Tipos de Inscrições
                            configurados. Configure clicando em{" "}
                            <strong>Gerenciar Evento</strong>.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Link público do evento */}
                  <div className="pt-3 sm:pt-4 border-t">
                    <div className="flex flex-col gap-2">
                      <span className="text-xs text-muted-foreground">
                        URL pública:
                      </span>
                      <div className="flex gap-2">
                        <div className="flex-1 min-w-0">
                          <input
                            readOnly
                            className="w-full text-xs bg-transparent border rounded px-2 py-1 truncate"
                            value={`${
                              typeof window !== "undefined"
                                ? window.location.origin
                                : ""
                            }/events/${event.id}`}
                          />
                        </div>
                        <div className="flex gap-1 sm:gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className={cn(
                              "p-1 sm:p-2 h-7 w-7 sm:h-8 sm:w-8 transition-all duration-300",
                              isCopied
                                ? "bg-green-50 text-green-600 border-green-200"
                                : "bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200"
                            )}
                            onClick={() =>
                              copyToClipboard(
                                `${window.location.origin}/events/${event.id}`,
                                event.id
                              )
                            }
                            title={isCopied ? "Copiado!" : "Copiar URL"}
                          >
                            {isCopied ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="p-1 sm:p-2 h-7 w-7 sm:h-8 sm:w-8 bg-green-50 text-green-600 hover:bg-green-100 border-green-200"
                            onClick={() => openEventPage(event.id)}
                            title="Visualizar Evento"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer do Card */}
                  <div className="flex justify-between items-center pt-3 sm:pt-4">
                    <Button
                      asChild
                      variant="outline"
                      className="flex items-center gap-2 text-xs sm:text-sm"
                    >
                      <Link href={`/super/events/${event.id}`}>
                        Gerenciar Evento
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mensagem quando não há eventos */}
      {events.length === 0 && (
        <div className="text-center py-12 sm:py-16">
          <div className="text-muted-foreground mb-6">
            <Calendar className="h-16 w-16 sm:h-20 sm:w-20 mx-auto mb-4 opacity-30" />
            <h3 className="text-lg sm:text-xl font-medium mb-2">
              Nenhum evento encontrado
            </h3>
            <p className="max-w-md mx-auto text-sm sm:text-base">
              Não há eventos cadastrados no momento. Comece criando o primeiro
              evento.
            </p>
          </div>
          <Button size="lg" asChild className="w-full sm:w-auto">
            <Link href="/super/events/create">Criar Primeiro Evento</Link>
          </Button>
        </div>
      )}

      {/* Paginação */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t">
        <div className="text-sm text-muted-foreground text-center sm:text-left">
          Mostrando {startIndex + 1}-{Math.min(startIndex + PAGE_SIZE, total)}{" "}
          de {total} eventos
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => page > 1 && handlePageChange(page - 1)}
                href={page > 1 ? "#" : undefined}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {Array.from({ length: pageCount }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={page === i + 1}
                  href="#"
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => page < pageCount && handlePageChange(page + 1)}
                href={page < pageCount ? "#" : undefined}
                className={
                  page === pageCount ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
