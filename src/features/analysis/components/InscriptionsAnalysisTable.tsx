"use client";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ArrowLeft, Calendar, FileText, Search, Users } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useEventInscriptions } from "../hooks/useEventInscriptions";

export default function InscriptionsAnalysisTable() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  const [searchTerm, setSearchTerm] = useState("");

  const { eventData, loading, error, page, pageCount, total, setPage } =
    useEventInscriptions({
      eventId,
      initialPage: 1,
      pageSize: 15,
    });

  const handleInscriptionClick = (inscriptionId: string) => {
    router.push(`/super/inscriptions/analysis/inscription/${inscriptionId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "under_review":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "PENDENTE";
      case "paid":
        return "APROVADA";
      case "cancelled":
        return "REJEITADA";
      case "under_review":
        return "EM ANÁLISE";
      default:
        return status.toUpperCase();
    }
  };

  // Filtro local por nome do responsável
  const filteredInscriptions =
    eventData?.inscriptions.filter((inscription) =>
      inscription.responsible.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              Erro ao carregar inscrições
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <Button asChild className="w-full">
              <Link href="/super/inscriptions/analysis">
                Voltar para Análise
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/super/inscriptions/analysis">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Análise de Inscrições
              </h1>
              {eventData && (
                <p className="text-muted-foreground mt-1">{eventData.name}</p>
              )}
            </div>
          </div>
        </div>

        {/* Cards de Informações */}
        {eventData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total de Inscrições
                    </p>
                    <p className="text-xl font-bold">{eventData.total}</p>
                  </div>
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <FileText className="h-4 w-4 text-white dark:text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Confirmados
                    </p>
                    <p className="text-xl font-bold">
                      {eventData.quantityParticipants}
                    </p>
                  </div>
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                    <Users className="h-4 w-4 text-white dark:text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Status do Evento
                    </p>
                    <p className="text-xl font-bold">Ativo</p>
                  </div>
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
                    <Calendar className="h-4 w-4 text-white dark:text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Barra de Busca e Informações da Tabela */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          {/* Barra de Busca */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por responsável..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4"
            />
          </div>

          {/* Informações da Tabela - Lado Direito */}
          {eventData && filteredInscriptions.length > 0 && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>
                  {filteredInscriptions.length} de {total} inscrição(ões)
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>
                  Em análise:{" "}
                  {
                    filteredInscriptions.filter(
                      (i) => i.status.toLowerCase() === "under_review"
                    ).length
                  }
                </span>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>
                  Pendentes:{" "}
                  {
                    filteredInscriptions.filter(
                      (i) => i.status.toLowerCase() === "pending"
                    ).length
                  }
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Tabela de Inscrições */}
        <Card className="border-0 shadow-sm p-0 rounded-t-lg">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6">
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-1/3" />
                      </div>
                      <Skeleton className="h-6 w-20" />
                    </div>
                  ))}
                </div>
              </div>
            ) : eventData && filteredInscriptions.length > 0 ? (
              <>
                <div className="overflow-x-auto rounded-t-lg">
                  <table className="min-w-full text-sm">
                    <thead className="bg-muted text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-sm">
                          Responsável
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-sm">
                          Telefone
                        </th>
                        <th className="px-4 py-3 text-center font-semibold text-sm">
                          Status
                        </th>
                        <th className="px-4 py-3 text-center font-semibold text-sm">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInscriptions.map((inscription) => (
                        <tr
                          key={inscription.id}
                          className="border-t hover:bg-muted/50 cursor-pointer transition-colors"
                          onClick={() => handleInscriptionClick(inscription.id)}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                <Users className="w-4 h-4 text-white dark:text-white" />
                              </div>
                              <span className="font-medium">
                                {inscription.responsible}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-muted-foreground">
                              {inscription.phone}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                inscription.status
                              )}`}
                            >
                              {getStatusText(inscription.status)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleInscriptionClick(inscription.id);
                              }}
                              className="border-primary text-primary hover:bg-primary hover:text-white"
                            >
                              Analisar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Paginação */}
                {pageCount > 1 && (
                  <div className="p-6 border-t">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                      <p className="text-sm text-muted-foreground">
                        Mostrando {(page - 1) * 15 + 1} a{" "}
                        {Math.min(page * 15, total)} de {total} inscrições
                      </p>
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() => setPage(Math.max(1, page - 1))}
                              href="#"
                              className={
                                page === 1
                                  ? "pointer-events-none opacity-50"
                                  : ""
                              }
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
                              onClick={() =>
                                setPage(Math.min(pageCount, page + 1))
                              }
                              href="#"
                              className={
                                page === pageCount
                                  ? "pointer-events-none opacity-50"
                                  : ""
                              }
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  Nenhuma inscrição encontrada
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm
                    ? "Nenhuma inscrição corresponde à busca."
                    : "Este evento ainda não possui inscrições."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
