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
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Calendar,
  CheckCircle,
  Download,
  FileText,
  Mail,
  Menu,
  OctagonX,
  Phone,
  User,
  Users,
  X
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useInscriptionActions } from "../hooks/useInscriptionActions";
import { useInscriptionDetails } from "../hooks/useInscriptionDetails";
import { ConfirmationModal } from "./ConfirmationModal";

export default function InscriptionDetailAnalysis() {
  const params = useParams();
  const router = useRouter();
  const inscriptionId = params.id as string;
  const [sortBy, setSortBy] = useState<{
    field: string;
    direction: "asc" | "desc" | "default";
  }>({ field: "", direction: "default" });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    description: string;
    confirmText: string;
    variant: "default" | "destructive" | "success";
    action: () => void;
  }>({
    title: "",
    description: "",
    confirmText: "",
    variant: "default",
    action: () => {},
  });

  // Detectar quando o componente é desmontado
  useEffect(() => {
    return () => {
      // Cleanup quando componente é desmontado
    };
  }, [inscriptionId]);

  const {
    approveInscription,
    cancelInscription,
    deleteInscription,
    downloadList,
    isApproving,
    isCancelling,
    isDeleting,
  } = useInscriptionActions();

  const { inscriptionData, loading, error, page, pageCount, total, setPage } =
    useInscriptionDetails({
      inscriptionId,
      initialPage: 1,
      pageSize: 10,
      enabled: !isDeleting,
    });

  // Verificar se a inscrição foi deletada
  const isInscriptionDeleted = !loading && !inscriptionData && !error && !isDeleting;

  const handleApproveInscription = () => {
    setModalConfig({
      title: "Aprovar Inscrição",
      description: "Tem certeza que deseja aprovar esta inscrição? Esta ação irá marcar a inscrição como aprovada.",
      confirmText: "Aprovar",
      variant: "success",
      action: async () => {
        await approveInscription(inscriptionId);
        setShowConfirmModal(false);
      },
    });
    setShowConfirmModal(true);
  };

  const handleCancelInscription = () => {
    const isCurrentlyCancelled = inscriptionData?.status.toLowerCase() === "cancelled";

    setModalConfig({
      title: isCurrentlyCancelled ? "Reativar Inscrição" : "Cancelar Inscrição",
      description: isCurrentlyCancelled
        ? "Tem certeza que deseja reativar esta inscrição? Ela voltará ao status de pendente."
        : "Tem certeza que deseja cancelar esta inscrição? Esta ação pode ser revertida posteriormente.",
      confirmText: isCurrentlyCancelled ? "Reativar" : "Cancelar",
      variant: isCurrentlyCancelled ? "success" : "default",
      action: async () => {
        await cancelInscription(inscriptionId, inscriptionData?.status || "");
        setShowConfirmModal(false);
      },
    });
    setShowConfirmModal(true);
  };

  const handleDeleteInscription = () => {
    setModalConfig({
      title: "Deletar Inscrição",
      description: "ATENÇÃO: Esta ação irá deletar permanentemente esta inscrição e todos os dados associados. Esta ação NÃO pode ser desfeita. Tem certeza que deseja continuar?",
      confirmText: "Deletar Permanentemente",
      variant: "destructive",
      action: async () => {
        await deleteInscription(inscriptionId);
        setShowConfirmModal(false);
      },
    });
    setShowConfirmModal(true);
  };

  const handleDownloadList = () => {
    downloadList(inscriptionId);
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

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
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

  // Função para ordenar os participantes
  const sortParticipants = (participants: any[]) => {
    if (sortBy.direction === "default") return participants;

    return [...participants].sort((a, b) => {
      if (sortBy.field === "name") {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();

        if (sortBy.direction === "asc") {
          return aName.localeCompare(bName);
        } else {
          return bName.localeCompare(aName);
        }
      }

      if (sortBy.field === "birthDate") {
        const aDate = new Date(a.birthDate);
        const bDate = new Date(b.birthDate);

        if (sortBy.direction === "asc") {
          return aDate.getTime() - bDate.getTime();
        } else {
          return bDate.getTime() - aDate.getTime();
        }
      }

      if (sortBy.field === "gender") {
        const aGender = getGenderText(a.gender).toLowerCase();
        const bGender = getGenderText(b.gender).toLowerCase();

        if (sortBy.direction === "asc") {
          return aGender.localeCompare(bGender);
        } else {
          return bGender.localeCompare(aGender);
        }
      }

      return 0;
    });
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

  if (isInscriptionDeleted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <OctagonX className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h2 className="text-xl font-semibold text-orange-600 mb-2">
              Inscrição não encontrada
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Esta inscrição pode ter sido deletada ou não existe mais.
            </p>
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
              {inscriptionData.status.toLowerCase() === "under_review" && (
                <Button
                  variant="default"
                  onClick={handleApproveInscription}
                  disabled={isApproving}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  <User className="h-4 w-4" />
                  {isApproving ? "Aprovando..." : "Aprovar Inscrição"}
                </Button>
              )}

              {inscriptionData.status.toLowerCase() !== "paid" && (
                <Button
                  variant="outline"
                  onClick={handleCancelInscription}
                  disabled={isCancelling}
                  className={`flex items-center gap-2 ${
                    inscriptionData.status.toLowerCase() === "cancelled"
                      ? "border-green-500 text-green-600 hover:bg-green-50 hover:border-green-600 hover:text-green-700"
                      : "border-orange-500 text-orange-600 hover:bg-orange-50 hover:border-orange-600 hover:text-orange-700"
                  }`}
                >
                  {inscriptionData.status.toLowerCase() === "cancelled" ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                  {isCancelling
                    ? (inscriptionData.status.toLowerCase() === "cancelled" ? "Reativando..." : "Cancelando...")
                    : (inscriptionData.status.toLowerCase() === "cancelled" ? "Reativar Inscrição" : "Cancelar Inscrição")
                  }
                </Button>
              )}

              <Button
                variant="destructive"
                onClick={handleDeleteInscription}
                disabled={isDeleting}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
              >
                <OctagonX className="h-4 w-4"/>
                {isDeleting ? "Deletando..." : "Deletar Inscrição"}
              </Button>
            </div>
          )}
        </div>

        {/* Informações da Inscrição */}
        {inscriptionData && (
          <Card className="border-0 shadow-md mb-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {inscriptionData.responsible}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Responsável pela inscrição
                    </p>
                  </div>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                    inscriptionData.status
                  )}`}
                >
                  {getStatusText(inscriptionData.status)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                  <div className="p-3 bg-green-500 rounded-lg shadow-md">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">
                      Telefone
                    </p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {inscriptionData.phone}
                    </p>
                  </div>
                </div>

                {inscriptionData.email && (
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <div className="p-3 bg-orange-500 rounded-lg shadow-md">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">
                        Email
                      </p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white break-all">
                        {inscriptionData.email}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Botão Baixar Lista */}
        {inscriptionData && (
          <div className="flex justify-end mb-6">
            <Button
              variant="outline"
              onClick={handleDownloadList}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Baixar Lista
            </Button>
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
                    <thead className="text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-base">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (sortBy.field === "name") {
                                if (sortBy.direction === "default") {
                                  setSortBy({
                                    field: "name",
                                    direction: "asc",
                                  });
                                } else if (sortBy.direction === "asc") {
                                  setSortBy({
                                    field: "name",
                                    direction: "desc",
                                  });
                                } else {
                                  setSortBy({
                                    field: "",
                                    direction: "default",
                                  });
                                }
                              } else {
                                setSortBy({
                                  field: "name",
                                  direction: "asc",
                                });
                              }
                            }}
                            className="h-auto p-0 font-semibold text-base hover:bg-transparent flex items-center gap-1"
                          >
                            Nome
                            {sortBy.field === "name" ? (
                              sortBy.direction === "asc" ? (
                                <ArrowDown className="h-3 w-3" />
                              ) : sortBy.direction === "desc" ? (
                                <ArrowUp className="h-3 w-3" />
                              ) : (
                                <Menu className="h-3 w-3" />
                              )
                            ) : (
                              <Menu className="h-3 w-3 text-gray-400" />
                            )}
                          </Button>
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-base">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (sortBy.field === "birthDate") {
                                if (sortBy.direction === "default") {
                                  setSortBy({
                                    field: "birthDate",
                                    direction: "asc",
                                  });
                                } else if (sortBy.direction === "asc") {
                                  setSortBy({
                                    field: "birthDate",
                                    direction: "desc",
                                  });
                                } else {
                                  setSortBy({
                                    field: "",
                                    direction: "default",
                                  });
                                }
                              } else {
                                setSortBy({
                                  field: "birthDate",
                                  direction: "asc",
                                });
                              }
                            }}
                            className="h-auto p-0 font-semibold text-base hover:bg-transparent flex items-center gap-1"
                          >
                            Data de Nascimento
                            {sortBy.field === "birthDate" ? (
                              sortBy.direction === "asc" ? (
                                <ArrowDown className="h-3 w-3" />
                              ) : sortBy.direction === "desc" ? (
                                <ArrowUp className="h-3 w-3" />
                              ) : (
                                <Menu className="h-3 w-3" />
                              )
                            ) : (
                              <Menu className="h-3 w-3 text-gray-400" />
                            )}
                          </Button>
                        </th>
                        <th className="px-4 py-3 text-center font-semibold text-base">
                          Idade
                        </th>
                        <th className="px-4 py-3 text-center font-semibold text-base">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (sortBy.field === "gender") {
                                if (sortBy.direction === "default") {
                                  setSortBy({
                                    field: "gender",
                                    direction: "asc",
                                  });
                                } else if (sortBy.direction === "asc") {
                                  setSortBy({
                                    field: "gender",
                                    direction: "desc",
                                  });
                                } else {
                                  setSortBy({
                                    field: "",
                                    direction: "default",
                                  });
                                }
                              } else {
                                setSortBy({
                                  field: "gender",
                                  direction: "asc",
                                });
                              }
                            }}
                            className="h-auto p-0 font-semibold text-base hover:bg-transparent flex items-center gap-1 mx-auto"
                          >
                            Gênero
                            {sortBy.field === "gender" ? (
                              sortBy.direction === "asc" ? (
                                <ArrowDown className="h-3 w-3" />
                              ) : sortBy.direction === "desc" ? (
                                <ArrowUp className="h-3 w-3" />
                              ) : (
                                <Menu className="h-3 w-3" />
                              )
                            ) : (
                              <Menu className="h-3 w-3 text-gray-400" />
                            )}
                          </Button>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortParticipants(inscriptionData.participants).map(
                        (participant) => (
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
                              <span className="text-muted-foreground font-medium">
                                {calculateAge(participant.birthDate)} anos
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="text-muted-foreground">
                                {getGenderText(participant.gender)}
                              </span>
                            </td>
                          </tr>
                        )
                      )}
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

        {/* Modal de Confirmação */}
        <ConfirmationModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={modalConfig.action}
          title={modalConfig.title}
          description={modalConfig.description}
          confirmText={modalConfig.confirmText}
          variant={modalConfig.variant}
          isLoading={isApproving || isCancelling || isDeleting}
        />
      </div>
    </div>
  );
}
