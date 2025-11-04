"use client";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import { BanknoteArrowDown, FileText, Search, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ComboboxEvent } from "../../events/components/ComboBoxEvent";
import { useInscriptions } from "../hooks/useInscriptions";
import { ComboboxPeriod } from "./ComboboxPeriod";

// Função para converter período para ISO
const getPeriodISO = (period: string): string | null => {
  const now = new Date();

  switch (period) {
    case "1h":
      return new Date(now.getTime() - 60 * 60 * 1000).toISOString();
    case "24h":
      return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    case "7d":
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    case "30d":
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    case "this_month":
      return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    case "all":
    default:
      return null;
  }
};

export default function MyInscriptionsTable() {
  const router = useRouter();
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Estados para os filtros aplicados (que vão para a API)
  const [appliedEventId, setAppliedEventId] = useState<string | null>(null);
  const [appliedLimitTime, setAppliedLimitTime] = useState<string | null>(null);

  const {
    inscriptions,
    total,
    page,
    pageCount,
    totalInscription,
    totalParticipant,
    totalDebt,
    error,
    setPage,
    refetch,
  } = useInscriptions({
    pageSize: 10,
    eventId: appliedEventId,
    limitTime: appliedLimitTime,
  });

  // Filtro local apenas para busca por nome (os outros filtros são feitos na API)
  const filteredInscriptions = useMemo(() => {
    if (!searchTerm) return inscriptions;

    return inscriptions.filter((inscription) =>
      inscription.responsible.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [inscriptions, searchTerm]);

  const handleSearch = () => {
    // Aplicar os filtros selecionados
    setAppliedEventId(selectedEvent || null);
    setAppliedLimitTime(getPeriodISO(selectedPeriod));
    setPage(1);
  };

  const clearFilters = () => {
    setSelectedEvent("");
    setSelectedPeriod("all");
    setSearchTerm("");
    setAppliedEventId(null);
    setAppliedLimitTime(null);
    setPage(1);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "UNDER_REVIEW":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "PAID":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const hasActiveFilters = appliedEventId || appliedLimitTime || searchTerm;

  // Mostrar erro se houver
  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <div className="text-center py-8">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Button onClick={refetch} variant="outline">
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Cards com dados gerais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
        {/* Card de Total em Débito - Sempre visível */}
        <div className="bg-card rounded-lg border p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                Total em Débito
              </p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold">
                {formatCurrency(totalDebt)}
              </p>
            </div>
            <div className="p-2 bg-red-600 rounded-full">
              <BanknoteArrowDown className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white " />
            </div>
          </div>
        </div>

        {/* Card de Total de Inscrições - Visível apenas quando há appliedEventId */}
        {appliedEventId && (
          <div className="bg-card rounded-lg border p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Total de Inscrições
                </p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">
                  {totalInscription}
                </p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white dark:text-white" />
              </div>
            </div>
          </div>
        )}

        {/* Card de Total de Participantes - Visível apenas quando há appliedEventId */}
        {appliedEventId && (
          <div className="bg-card rounded-lg border p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Total de Participantes
                </p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">
                  {totalParticipant}
                </p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white dark:text-white" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:gap-2 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-2">
          {/* Filtro de Evento */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Evento</label>
            <div className="w-full sm:w-65">
              <ComboboxEvent
                value={selectedEvent}
                onChange={setSelectedEvent}
              />
            </div>
          </div>

          {/* Filtro de Período */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Período</label>
            <div className="w-full sm:w-48">
              <ComboboxPeriod
                value={selectedPeriod}
                onChange={setSelectedPeriod}
              />
            </div>
          </div>

          {/* Busca por responsável */}
          <div className="flex flex-col lg:pl-2">
            <label className="text-sm font-medium mb-1">Responsável</label>
            <div className="relative w-full lg:w-100 sm:w-48">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4"
              />
            </div>
          </div>

          {/* Botões de ação - Mover para dentro desta div e ajustar para horizontal no desktop */}
          <div className="flex flex-row lg:self-end-safe sm:flex-row gap-2 sm:gap-2 sm:items-end">
            <Button
              variant="outline"
              onClick={handleSearch}
              type="button"
              className="flex-1 sm:flex-none lg:min-h-9"
              size="sm"
            >
              <span>Buscar</span>
            </Button>

            <Button
              variant="destructive"
              onClick={clearFilters}
              type="button"
              disabled={!hasActiveFilters}
              className="flex-1 sm:flex-none lg:min-h-9"
              size="sm"
            >
              <span className="">Limpar</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Indicador de filtro aplicado */}
      {hasActiveFilters && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Filtros aplicados:
            {appliedEventId && ` Evento selecionado`}
            {appliedLimitTime && ` Período: ${selectedPeriod}`}
            {searchTerm && ` Busca: "${searchTerm}"`}
          </p>
        </div>
      )}

      {/* Tabela */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold text-xs sm:text-sm">
                Responsável
              </th>
              <th className="px-2 py-2 sm:px-4 sm:py-3 text-center font-semibold text-xs sm:text-sm">
                Valor
              </th>
              <th className="px-2 py-2 sm:px-4 sm:py-3 text-center font-semibold text-xs sm:text-sm">
                Status
              </th>
              <th className="hidden sm:table-cell px-2 py-2 sm:px-4 sm:py-3 text-center font-semibold text-xs sm:text-sm">
                Criado em
              </th>
              <th className="hidden md:table-cell px-2 py-2 sm:px-4 sm:py-3 text-center font-semibold text-xs sm:text-sm">
                Horário
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredInscriptions.map((inscription) => (
              <tr
                key={inscription.id}
                className="border-t hover:bg-muted/50"
                onClick={() => {
                  router.push(`MyInscriptions/${inscription.id}`);
                }}
              >
                <td className="px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm">
                  <div className="flex flex-col">
                    <span className="font-medium truncate">
                      {inscription.responsible}
                    </span>
                    {/* Mostrar data e hora em telas pequenas */}
                    <div className="sm:hidden text-muted-foreground text-xs mt-1">
                      <span>{formatDate(inscription.createdAt)}</span>
                      <span className="mx-1">•</span>
                      <span>{formatTime(inscription.createdAt)}</span>
                    </div>
                  </div>
                </td>
                <td className="px-2 py-2 sm:px-4 sm:py-3 text-center font-medium text-xs sm:text-sm">
                  {formatCurrency(inscription.totalValue)}
                </td>
                <td className="px-2 py-2 sm:px-4 sm:py-3 text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${getStatusColor(
                      inscription.status
                    )}`}
                  >
                    {inscription.status === "PENDING"
                      ? "PENDENTE"
                      : inscription.status === "UNDER_REVIEW"
                        ? "EM ANÁLISE"
                        : inscription.status === "PAID"
                          ? "PAGO"
                          : inscription.status === "CANCELLED"
                            ? "CANCELADO"
                            : inscription.status}
                  </span>
                </td>
                <td className="hidden sm:table-cell px-2 py-2 sm:px-4 sm:py-3 text-center text-xs sm:text-sm">
                  {formatDate(inscription.createdAt)}
                </td>
                <td className="hidden md:table-cell px-2 py-2 sm:px-4 sm:py-3 text-center text-xs sm:text-sm">
                  {formatTime(inscription.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mensagem quando não há resultados */}
      {filteredInscriptions.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          {hasActiveFilters
            ? "Nenhuma inscrição encontrada para os filtros selecionados."
            : "Nenhuma inscrição encontrada."}
        </div>
      )}

      {/* Paginação */}
      <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4 mt-6">
        {/* Informações de paginação - Esconder no desktop */}
        <div className="text-center sm:text-left text-xs sm:text-sm text-muted-foreground order-2 sm:order-1 sm:hidden">
          <span className="block sm:inline">
            Página {page} de {pageCount}
          </span>
          <span className="hidden sm:inline mx-2">-</span>
          <span className="block sm:inline">
            {filteredInscriptions.length} de {total} inscrição(ões)
          </span>
        </div>

        {/* Controles de paginação - Centralizado em todas as telas */}
        <div className="order-1 sm:order-1 w-full flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage(Math.max(1, page - 1))}
                  href="#"
                  className="text-xs"
                />
              </PaginationItem>
              {Array.from({ length: Math.min(pageCount, 5) }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={page === i + 1}
                    href="#"
                    onClick={() => setPage(i + 1)}
                    className="text-xs"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage(Math.min(pageCount, page + 1))}
                  href="#"
                  className="text-xs"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        {/* Informações de paginação - Mostrar apenas no desktop */}
        <div className="hidden sm:block text-sm text-muted-foreground order-3">
          <span>
            Página {page} de {pageCount} - {filteredInscriptions.length} de{" "}
            {total} inscrição(ões)
          </span>
        </div>
      </div>
    </div>
  );
}
