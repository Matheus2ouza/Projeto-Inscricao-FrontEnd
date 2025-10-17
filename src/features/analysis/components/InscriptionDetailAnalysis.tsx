"use client";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  ArrowLeft,
  Calendar,
  Download,
  FileText,
  Phone,
  Trash2,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useInscriptionDetails } from "../hooks/useInscriptionDetails";

export default function InscriptionDetailAnalysis() {
  const params = useParams();
  const router = useRouter();
  const inscriptionId = params.id as string;
  const [isCancelling, setIsCancelling] = useState(false);

  const { inscriptionData, loading, error, page, pageCount, total, setPage } =
    useInscriptionDetails({
      inscriptionId,
      initialPage: 1,
      pageSize: 10,
    });

  console.log("quantidade de participantes:", total);

  const handleCancelInscription = async () => {
    if (
      !confirm(
        "Tem certeza que deseja cancelar esta inscrição? Esta ação não pode ser desfeita."
      )
    ) {
      return;
    }

    setIsCancelling(true);
    try {
      // TODO: Implementar API de cancelamento
      console.log("Cancelando inscrição:", inscriptionId);
      // Simular delay da API
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert("Inscrição cancelada com sucesso!");
      router.back();
    } catch (error) {
      console.error("Erro ao cancelar inscrição:", error);
      alert("Erro ao cancelar inscrição. Tente novamente.");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleDownloadList = async () => {
    try {
      // TODO: Implementar download do PDF
      console.log("Baixando lista da inscrição:", inscriptionId);
      // Simular download
      alert("Download iniciado!");
    } catch (error) {
      console.error("Erro ao baixar lista:", error);
      alert("Erro ao baixar lista. Tente novamente.");
    }
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

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const getGenderText = (gender: string) => {
    switch (gender.toLowerCase()) {
      case "male":
        return "Masculino";
      case "female":
        return "Feminino";
      case "other":
        return "Outro";
      default:
        return gender;
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              Erro ao carregar inscrição
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
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Análise da Inscrição
              </h1>
              {inscriptionData && (
                <p className="text-muted-foreground mt-1">
                  {inscriptionData.responsible}
                </p>
              )}
            </div>
          </div>

          {/* Botões de Ação */}
          {inscriptionData && (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleDownloadList}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Baixar Lista
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancelInscription}
                disabled={
                  isCancelling ||
                  inscriptionData.status.toLowerCase() === "cancelled"
                }
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                {isCancelling ? "Cancelando..." : "Cancelar Inscrição"}
              </Button>
            </div>
          )}
        </div>

        {/* Informações da Inscrição */}
        {inscriptionData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Responsável
                    </p>
                    <p className="text-xl font-bold">
                      {inscriptionData.responsible}
                    </p>
                  </div>
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <User className="h-4 w-4 text-white dark:text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Telefone
                    </p>
                    <p className="text-xl font-bold">{inscriptionData.phone}</p>
                  </div>
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                    <Phone className="h-4 w-4 text-white dark:text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Status
                    </p>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        inscriptionData.status
                      )}`}
                    >
                      {getStatusText(inscriptionData.status)}
                    </span>
                  </div>
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
                    <FileText className="h-4 w-4 text-white dark:text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Informações da Lista de Participantes - Fora da Tabela */}
        {inscriptionData && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Lista de Participantes
            </h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{total} participante(s)</span>
            </div>
          </div>
        )}

        {/* Tabela de Participantes */}
        <Card className="border-0 shadow-sm">
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
            ) : inscriptionData && inscriptionData.participants.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-muted text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-sm">
                          Nome
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-sm">
                          Data de Nascimento
                        </th>
                        <th className="px-4 py-3 text-center font-semibold text-sm">
                          Gênero
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {inscriptionData.participants.map((participant) => (
                        <tr
                          key={participant.id}
                          className="border-t hover:bg-muted/50 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-white dark:text-white" />
                              </div>
                              <span className="font-medium">
                                {participant.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                {formatDate(participant.birthDate)}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="text-muted-foreground">
                              {getGenderText(participant.gender)}
                            </span>
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
                        Mostrando {(page - 1) * 10 + 1} a{" "}
                        {Math.min(page * 10, total)} de {total} participantes
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
                  Nenhum participante encontrado
                </h3>
                <p className="text-muted-foreground">
                  Esta inscrição não possui participantes cadastrados.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
