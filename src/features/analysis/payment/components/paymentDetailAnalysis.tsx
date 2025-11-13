"use client";

import ImageViewerDialog from "@/shared/components/ImageViewerDialog";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  ArrowLeft,
  CheckCircle,
  CircleOff,
  CreditCard,
  DollarSign,
  Frown,
  Mail,
  OctagonX,
  Phone,
  User,
  ZoomIn,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { usePaymentActions } from "../hooks/usePaymentActions";
import { usePaymentDetailsQuery } from "../hooks/usePaymentDetails";
import { PaymentStatus } from "../types/analysisTypes";

export default function PaymentDetailAnalysis() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const inscriptionId = params.id as string;
  const eventStatus = searchParams.get("eventStatus") || "OPEN"; // Default para OPEN se não fornecido
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    paymentId: string;
  } | null>(null);

  // Determinar quais status de pagamento buscar baseado no status do evento
  const paymentStatusToFetch = useMemo(() => {
    if (eventStatus === "OPEN") {
      // Se evento está aberto, buscar todos os pagamentos
      return [
        PaymentStatus.APPROVED,
        PaymentStatus.UNDER_REVIEW,
        PaymentStatus.REFUSED,
      ].map((status) => status.toString());
    } else {
      // Se evento está fechado, buscar apenas aprovados
      return [
        PaymentStatus.APPROVED.toString(),
        PaymentStatus.UNDER_REVIEW.toString(),
      ].map((status) => status.toString());
    }
  }, [eventStatus]);

  const {
    data: paymentData,
    isLoading: loading,
    error,
    page,
    setPage,
    pageCount,
    total,
  } = usePaymentDetailsQuery(inscriptionId, paymentStatusToFetch);

  // Resetar página quando o status do evento mudar
  useEffect(() => {
    setPage(1);
  }, [eventStatus, setPage]);

  const { approvePayment, refusePayment, isApproving, isRefusing } =
    usePaymentActions();

  const [refusalDialog, setRefusalDialog] = useState<{
    paymentId: string;
    reason: string;
  } | null>(null);
  const [refusalError, setRefusalError] = useState<string | null>(null);

  const handleApprovePayment = (paymentId: string) => {
    approvePayment(paymentId);
  };

  const handleRefusePayment = (paymentId: string) => {
    setRefusalDialog({ paymentId, reason: "" });
    setRefusalError(null);
  };

  const handleCloseRefusalDialog = () => {
    setRefusalDialog(null);
    setRefusalError(null);
  };

  const handleConfirmRefusal = () => {
    if (!refusalDialog) return;

    const trimmedReason = refusalDialog.reason.trim();

    if (!trimmedReason) {
      setRefusalError("Informe o motivo da reprovação.");
      return;
    }

    refusePayment(
      {
        paymentId: refusalDialog.paymentId,
        rejectionReason: trimmedReason,
      },
      {
        onSuccess: () => {
          handleCloseRefusalDialog();
        },
        onError: () => {
          // Keep dialog open so the reviewer can adjust the reason if needed
        },
      }
    );
  };

  const handleImageClick = (imageUrl: string, paymentId: string) => {
    setSelectedImage({ url: imageUrl, paymentId });
  };

  const handleCloseImageViewer = () => {
    setSelectedImage(null);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "under_review":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "refused":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "APROVADO";
      case "under_review":
        return "EM ANÁLISE";
      case "refused":
        return "RECUSADO";
      default:
        return status.toUpperCase();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "refused":
        return <OctagonX className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              Erro ao carregar detalhes
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {error.message}
            </p>
            <Button asChild className="w-full">
              <Link href="/super/payments/analysis">Voltar para Análise</Link>
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
                Detalhes do Pagamento
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                ID: {inscriptionId}
              </p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <Skeleton className="h-8 w-64 mb-4" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <Skeleton className="h-6 w-48 mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-32" />
                  <Skeleton className="h-32" />
                </div>
              </CardContent>
            </Card>
          </div>
        ) : paymentData ? (
          <div className="space-y-6">
            {/* Informações do Responsável */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {paymentData.inscription.responsible}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Responsável pela inscrição
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-xs text-muted-foreground">Telefone</p>
                      <p className="font-medium">
                        {paymentData.inscription.phone}
                      </p>
                    </div>
                  </div>

                  {paymentData.inscription.email && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="font-medium text-sm break-all">
                          {paymentData.inscription.email}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Saldo devedor
                      </p>
                      <p className="font-bold text-lg text-purple-600">
                        R$ {paymentData.inscription.totalValue.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Total de Pagamentos
                      </p>
                      <p className="text-2xl font-bold ml-4">{total}</p>
                    </div>
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                      <CreditCard className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Aprovados
                      </p>
                      <p className="text-2xl font-bold text-green-600 ml-4">
                        {
                          paymentData.inscription.payments.filter(
                            (p) => p.status.toLowerCase() === "approved"
                          ).length
                        }
                      </p>
                    </div>
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Em Análise
                      </p>
                      <p className="text-2xl font-bold text-blue-600 ml-4">
                        {
                          paymentData.inscription.payments.filter(
                            (p) => p.status.toLowerCase() === "under_review"
                          ).length
                        }
                      </p>
                    </div>
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                      <CreditCard className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Recusados
                      </p>
                      <p className="text-2xl font-bold text-red-600 ml-4">
                        {
                          paymentData.inscription.payments.filter(
                            (p) => p.status.toLowerCase() === "refused"
                          ).length
                        }
                      </p>
                    </div>
                    <div className="p-2 bg-blue-100 dark:bg-red-900 rounded-full">
                      <CircleOff className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Lista de Pagamentos */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Pagamentos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paymentData.inscription.payments.map((payment, index) => {
                    const hasImage = Boolean(payment.image);

                    return (
                      <Card
                        key={payment.id}
                        className="border shadow-sm hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-4">
                          {/* Status */}
                          <div className="flex justify-between items-center mb-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(
                                payment.status
                              )}`}
                            >
                              {getStatusIcon(payment.status)}
                              {getStatusText(payment.status)}
                            </span>
                          </div>

                          {/* Imagem */}
                          <div
                            className={`relative h-48 mb-3 rounded-lg overflow-hidden ${
                              hasImage
                                ? "cursor-pointer group"
                                : "bg-gray-100 dark:bg-gray-800"
                            }`}
                            onClick={() =>
                              hasImage && payment.image
                                ? handleImageClick(payment.image, payment.id)
                                : undefined
                            }
                          >
                            {hasImage && payment.image ? (
                              <>
                                <Image
                                  src={payment.image}
                                  alt={`Comprovante ${index + 1}`}
                                  fill
                                  className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                                  <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                              </>
                            ) : (
                              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                <Frown className="w-10 h-10" />
                                <span className="text-sm font-medium">
                                  Imagem indisponível
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Valor */}
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-sm text-muted-foreground">
                              Valor:
                            </span>
                            <span className="font-bold text-lg text-green-600">
                              R$ {payment.value.toFixed(2)}
                            </span>
                          </div>

                          {/* Botões de Ação */}
                          <div className="flex gap-2 mt-3">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                              onClick={() => handleApprovePayment(payment.id)}
                              disabled={isApproving || isRefusing}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Aprovar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                              onClick={() => handleRefusePayment(payment.id)}
                              disabled={isApproving || isRefusing}
                            >
                              <OctagonX className="w-4 h-4 mr-1" />
                              Recusar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {paymentData.inscription.payments.length === 0 && (
                  <div className="text-center py-12">
                    <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      Nenhum pagamento registrado
                    </h3>
                    <p className="text-muted-foreground">
                      Não há pagamentos para esta inscrição.
                    </p>
                  </div>
                )}

                {/* Paginação */}
                {pageCount > 1 && (
                  <div className="flex justify-center mt-6">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => page > 1 && setPage(page - 1)}
                            href={page > 1 ? "#" : undefined}
                            className={
                              page === 1 ? "pointer-events-none opacity-50" : ""
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
                              page < pageCount && setPage(page + 1)
                            }
                            href={page < pageCount ? "#" : undefined}
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
                )}

                {/* Informação de paginação */}
                {total > 0 && (
                  <div className="text-center mt-4 text-sm text-muted-foreground">
                    Mostrando {paymentData.inscription.payments.length} de{" "}
                    {total} pagamentos (Página {page} de {pageCount})
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-12">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum dado encontrado</h3>
            <p className="text-muted-foreground">
              Não foi possível carregar os detalhes do pagamento.
            </p>
          </div>
        )}
      </div>

      {/* Image Viewer Dialog */}
      {selectedImage && (
        <ImageViewerDialog
          isOpen={!!selectedImage}
          onClose={handleCloseImageViewer}
          imageUrl={selectedImage.url}
          title="Comprovante de Pagamento"
          description={`Comprovante do pagamento ${selectedImage.paymentId.slice(0, 8)}...`}
          downloadFileName={`comprovante-${selectedImage.paymentId}.jpg`}
        />
      )}

      <Dialog
        open={!!refusalDialog}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseRefusalDialog();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recusar pagamento</DialogTitle>
            <DialogDescription>
              Descreva o motivo para reprovar este pagamento. Essa mensagem será
              exibida para o inscrito.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="rejection-reason">Motivo da reprovação</Label>
            <Textarea
              id="rejection-reason"
              placeholder="Explique por que o pagamento foi reprovado"
              value={refusalDialog?.reason ?? ""}
              onChange={(event) => {
                if (!refusalDialog) {
                  return;
                }

                if (refusalError) {
                  setRefusalError(null);
                }

                setRefusalDialog({
                  ...refusalDialog,
                  reason: event.target.value,
                });
              }}
              disabled={isRefusing}
              rows={4}
            />
            {refusalError && (
              <p className="text-xs text-red-500">{refusalError}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseRefusalDialog}
              disabled={isRefusing}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmRefusal}
              disabled={isRefusing}
            >
              {isRefusing ? "Enviando..." : "Recusar pagamento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
