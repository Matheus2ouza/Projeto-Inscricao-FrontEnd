"use client";

import { useRegions } from "@/features/regions/hooks/useRegions";
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
import { BanknoteArrowDown, FileText, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { ComboboxEvent } from "./ComboBoxEvent";
import { ComboboxPeriod } from "./ComboboxPeriod";

// Dados mock (substitua pela sua API real)
const paymentData = {
  inscription: [
    {
      id: "01229fb7-b122-4aae-a415-d5c240dd604b",
      responsible: "Matheus Furtado",
      totalValue: 160,
      status: "PENDING",
      createdAt: "2025-10-11T06:00:08.471Z",
      updatedAt: "2025-10-11T06:00:08.471Z",
    },
    {
      id: "0caa0bc2-00b6-4440-93c8-569ec1e7cf97",
      responsible: "Matheus Furtado",
      totalValue: 160,
      status: "PENDING",
      createdAt: "2025-10-11T05:39:49.065Z",
      updatedAt: "2025-10-11T05:39:49.065Z",
    },
    // ... outros dados
  ],
  total: 15,
  page: 1,
  pageCount: 2,
  totalInscription: 15,
  totalParticipant: 23,
  totalDebt: 3680,
};

// Hook mock para paginação (substitua pelo seu hook real)
function usePayments({ pageSize = 10 }) {
  const [page, setPage] = useState(1);

  return {
    inscriptions: paymentData.inscription,
    total: paymentData.total,
    page,
    pageCount: paymentData.pageCount,
    totalInscription: paymentData.totalInscription,
    totalParticipant: paymentData.totalParticipant,
    totalDebt: paymentData.totalDebt,
    setPage,
  };
}

export default function PaymentTable() {
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { regions: fetchedRegions } = useRegions();

  const {
    inscriptions,
    total,
    page,
    pageCount,
    totalInscription,
    totalParticipant,
    totalDebt,
    setPage,
  } = usePayments({ pageSize: 10 });

  // Filtros combinados
  const filteredInscriptions = useMemo(() => {
    return inscriptions.filter((inscription) => {
      const matchesEvent = !selectedEvent;
      // Quando implementar a API real, ajuste para:
      // const matchesEvent = !selectedEvent || inscription.eventId === selectedEvent;

      const matchesSearch =
        !searchTerm ||
        inscription.responsible
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      // Filtro por período (implementação básica)
      const inscriptionDate = new Date(inscription.createdAt);
      const now = new Date();
      let matchesPeriod = true;

      switch (selectedPeriod) {
        case "24h":
          const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          matchesPeriod = inscriptionDate >= oneDayAgo;
          break;
        case "7d":
          const sevenDaysAgo = new Date(
            now.getTime() - 7 * 24 * 60 * 60 * 1000
          );
          matchesPeriod = inscriptionDate >= sevenDaysAgo;
          break;
        case "30d":
          const thirtyDaysAgo = new Date(
            now.getTime() - 30 * 24 * 60 * 60 * 1000
          );
          matchesPeriod = inscriptionDate >= thirtyDaysAgo;
          break;
        case "this_month":
          const firstDayOfMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
          );
          matchesPeriod = inscriptionDate >= firstDayOfMonth;
          break;
        case "last_month":
          const firstDayOfLastMonth = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            1
          );
          const lastDayOfLastMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            0
          );
          matchesPeriod =
            inscriptionDate >= firstDayOfLastMonth &&
            inscriptionDate <= lastDayOfLastMonth;
          break;
        case "all":
        default:
          matchesPeriod = true;
      }

      return matchesEvent && matchesSearch && matchesPeriod;
    });
  }, [inscriptions, selectedEvent, selectedPeriod, searchTerm]);

  const handleSearch = () => {
    setPage(1);
  };

  const clearFilters = () => {
    setSelectedEvent("");
    setSelectedPeriod("all");
    setSearchTerm("");
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

  const hasActiveFilters =
    selectedEvent || selectedPeriod !== "all" || searchTerm;

  return (
    <div className="p-6">
      {/* Cards com dados gerais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-card rounded-lg border p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total em Débito
              </p>
              <p className="text-2xl font-bold">{formatCurrency(totalDebt)}</p>
            </div>
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-full">
              <BanknoteArrowDown className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total de Inscrições
              </p>
              <p className="text-2xl font-bold">{totalInscription}</p>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total de Participantes
              </p>
              <p className="text-2xl font-bold">{totalParticipant}</p>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
              <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex justify-between items-center mb-6 gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Filtro de Evento */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Evento</label>
            <div className="w-65">
              <ComboboxEvent
                value={selectedEvent}
                onChange={setSelectedEvent}
              />
            </div>
          </div>

          {/* Filtro de Período */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Período</label>
            <div className="w-48">
              <ComboboxPeriod
                value={selectedPeriod}
                onChange={setSelectedPeriod}
              />
            </div>
          </div>

          {/* Busca por responsável */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Responsável</label>
            <Input
              type="text"
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-48"
            />
          </div>

          <Button
            variant="outline"
            onClick={handleSearch}
            type="button"
            className="mt-6"
          >
            Buscar
          </Button>

          <Button
            variant="destructive"
            onClick={clearFilters}
            type="button"
            disabled={!hasActiveFilters}
            className="mt-6"
          >
            Limpar
          </Button>
        </div>
      </div>

      {/* Indicador de filtro aplicado */}
      {hasActiveFilters && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Filtros aplicados:
            {selectedEvent && ` Evento selecionado`}
            {selectedPeriod !== "all" && ` Período: ${selectedPeriod}`}
            {searchTerm && ` Busca: "${searchTerm}"`}
          </p>
        </div>
      )}

      {/* Tabela */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="w-1/4 px-4 py-3 text-left font-semibold">
                Responsável
              </th>
              <th className="w-1/6 px-4 py-3 text-center font-semibold">
                Valor Total
              </th>
              <th className="w-1/6 px-4 py-3 text-center font-semibold">
                Status
              </th>
              <th className="w-1/4 px-4 py-3 text-center font-semibold">
                Criado em
              </th>
              <th className="w-1/4 px-4 py-3 text-center font-semibold">
                Atualizado em
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredInscriptions.map((inscription) => (
              <tr key={inscription.id} className="border-t hover:bg-muted/50">
                <td className="px-4 py-3">{inscription.responsible}</td>
                <td className="px-4 py-3 text-center font-medium">
                  {formatCurrency(inscription.totalValue)}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                      inscription.status
                    )}`}
                  >
                    {inscription.status === "PENDING"
                      ? "PENDENTE"
                      : inscription.status === "UNDER_REVIEW"
                      ? "EM ANALISE"
                      : inscription.status === "PAID"
                      ? "PAGO"
                      : inscription.status === "CANCELLED"
                      ? "CANCELADO"
                      : inscription.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {formatDate(inscription.createdAt)}
                </td>
                <td className="px-4 py-3 text-center">
                  {formatDate(inscription.updatedAt)}
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
      <div className="flex justify-end mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage(Math.max(1, page - 1))}
                href="#"
              />
            </PaginationItem>
            {Array.from({ length: pageCount }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={page === i + 1}
                  href="#"
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage(Math.min(pageCount, page + 1))}
                href="#"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Informações de paginação */}
      <div className="text-center text-sm text-muted-foreground mt-2">
        Página {page} de {pageCount} - {filteredInscriptions.length} de {total}{" "}
        inscrição(ões)
      </div>
    </div>
  );
}
