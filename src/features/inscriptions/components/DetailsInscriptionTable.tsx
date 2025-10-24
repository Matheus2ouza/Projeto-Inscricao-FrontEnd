import { useGlobalLoading } from "@/components/GlobalLoading";
import RegisterPaymentDialog from "@/features/payment/components/RegisterPaymentDialog";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import {
  ArrowLeft,
  CreditCard,
  Download,
  Eye,
  Loader2,
  Plus,
  User,
} from "lucide-react";
import { MouseEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { InscriptionDetails } from "../types/inscriptionsDetails.types";

interface InscriptionDetailsProps {
  data?: InscriptionDetails;
  isLoading?: boolean;
  error?: string | null;
}

export default function DetailsInscriptionsTable({
  data,
  isLoading = false,
  error = null,
}: InscriptionDetailsProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [registerPaymentOpen, setRegisterPaymentOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [downloadLoading, setDownloadLoading] = useState<{
    [key: string]: boolean;
  }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPaymentPage, setCurrentPaymentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("participants");
  const { setLoading } = useGlobalLoading();

  const itemsPerPage = 15;
  const paymentItemsPerPage = 10;

  // Usar o GlobalLoading quando estiver carregando
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  // Resetar página quando os dados mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [data?.participants]);

  // Resetar página de pagamentos quando os dados mudarem
  useEffect(() => {
    setCurrentPaymentPage(1);
  }, [data?.payments]);

  // Calcular participantes paginados
  const paginatedParticipants = data?.participants
    ? data.participants.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : [];

  const totalPages = data?.participants
    ? Math.ceil(data.participants.length / itemsPerPage)
    : 0;

  // Calcular pagamentos paginados
  const paginatedPayments = data?.payments
    ? data.payments.slice(
        (currentPaymentPage - 1) * paymentItemsPerPage,
        currentPaymentPage * paymentItemsPerPage
      )
    : [];

  const totalPaymentPages = data?.payments
    ? Math.ceil(data.payments.length / paymentItemsPerPage)
    : 0;

  // Se estiver carregando, não renderizar nada (o GlobalLoading será mostrado)
  if (isLoading) {
    return null;
  }

  const showUnderReviewToast = () => {
    toast.info("Inscrição em revisão", {
      description:
        "Aguardando análise da organização. Assim que houver uma atualização você será avisado.",
    });
  };

  const handleRegisterPayment = () => {
    if (data?.status === "UNDER_REVIEW") {
      showUnderReviewToast();
      return;
    }
    setRegisterPaymentOpen(true);
  };
  const handleTabChange = (value: string) => {
    if (value === "payments" && data?.status === "UNDER_REVIEW") {
      return;
    }
    setActiveTab(value);
  };

  const handlePaymentsTriggerClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (data?.status === "UNDER_REVIEW") {
      event.preventDefault();
      showUnderReviewToast();
    }
  };

  // Função para fazer download da imagem
  const handleDownloadImage = async (imageUrl: string, paymentId: string) => {
    try {
      setDownloadLoading((prev) => ({ ...prev, [paymentId]: true }));

      const response = await fetch(imageUrl);
      const blob = await response.blob();

      // Criar um URL temporário para o blob
      const blobUrl = URL.createObjectURL(blob);

      // Criar um elemento link temporário
      const link = document.createElement("a");
      link.href = blobUrl;

      // Extrair o nome do arquivo da URL ou usar um padrão
      const fileName = `comprovante-${paymentId}.${getFileExtension(imageUrl)}`;
      link.download = fileName;

      // Simular clique no link para iniciar o download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Liberar o URL do blob
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Erro ao fazer download da imagem:", error);
      // Fallback: abrir em nova aba se o download falhar
      window.open(imageUrl, "_blank");
    } finally {
      setDownloadLoading((prev) => ({ ...prev, [paymentId]: false }));
    }
  };

  // Função para obter a extensão do arquivo baseado na URL
  const getFileExtension = (url: string) => {
    const extension = url.split(".").pop()?.split("?")[0];
    return extension || "jpg"; // Fallback para jpg
  };

  // Se houver erro, mostrar mensagem de erro
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Detalhes da Inscrição
            </h1>
          </div>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Tentar novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Se não há dados, mostrar mensagem
  if (!data) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Detalhes da Inscrição
            </h1>
          </div>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Nenhum dado encontrado</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const formatDateTime = (date: Date | string) => {
    return new Date(date).toLocaleString("pt-BR");
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "PAGO";
      case "pending":
        return "PENDENTE";
      case "under_review":
        return "EM ANÁLISE";
      case "cancelled":
        return "CANCELADO";
      case "aprovado":
        return "APROVADO";
      case "rejeitado":
        return "REJEITADO";
      case "em_análise":
        return "EM ANÁLISE";
      default:
        return status.toUpperCase();
    }
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

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  const handleImageLoad = (paymentId: string) => {
    setImageLoading((prev) => ({ ...prev, [paymentId]: false }));
  };

  const handleImageError = (paymentId: string) => {
    setImageLoading((prev) => ({ ...prev, [paymentId]: false }));
  };

  const handleImageStart = (paymentId: string) => {
    setImageLoading((prev) => ({ ...prev, [paymentId]: true }));
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPaymentPage = (page: number) => {
    setCurrentPaymentPage(page);
  };

  const goToNextPaymentPage = () => {
    if (currentPaymentPage < totalPaymentPages) {
      setCurrentPaymentPage(currentPaymentPage + 1);
    }
  };

  const goToPreviousPaymentPage = () => {
    if (currentPaymentPage > 1) {
      setCurrentPaymentPage(currentPaymentPage - 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header com botão voltar */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          size="icon"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Detalhes da Inscrição
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Informações completas da inscrição #{data.id.slice(0, 8)}...
          </p>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Header com informações principais */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                  Inscrição #{data.id.slice(0, 8)}...
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Responsável: {data.responsible}
                </CardDescription>
              </div>
              <Badge className={`self-start ${getStatusColor(data.status)}`}>
                {getStatusText(data.status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Telefone</p>
                <p className="text-sm text-muted-foreground break-all">
                  {data.phone}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Valor Total</p>
                <p className="text-sm text-muted-foreground font-semibold">
                  {formatCurrency(data.totalValue)}
                </p>
              </div>
              <div className="space-y-1 sm:col-span-2 lg:col-span-1">
                <p className="text-sm font-medium">Data de Criação</p>
                <p className="text-sm text-muted-foreground">
                  {formatDateTime(data.createdAt)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Abas para Participantes e Pagamentos */}
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-2 h-auto">
            <TabsTrigger
              value="participants"
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 sm:py-3"
            >
              <User className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Participantes</span>
              <span className="sm:hidden">Part.</span>({data.countParticipants})
            </TabsTrigger>
            <TabsTrigger
              value="payments"
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 sm:py-3"
              onClick={handlePaymentsTriggerClick}
            >
              <CreditCard className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Pagamentos</span>
              <span className="sm:hidden">Pag.</span>(
              {data.payments?.length || 0})
            </TabsTrigger>
          </TabsList>

          {/* Tab de Participantes */}
          <TabsContent value="participants">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="text-lg sm:text-xl">
                    Lista de Participantes
                  </CardTitle>
                  <div className="text-sm text-muted-foreground">
                    {data.participants.length} participante(s) no total
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">
                          Nome
                        </TableHead>
                        <TableHead className="hidden sm:table-cell text-xs sm:text-sm">
                          Tipo de Inscrição
                        </TableHead>
                        <TableHead className="hidden md:table-cell text-xs sm:text-sm">
                          Data de Nascimento
                        </TableHead>
                        <TableHead className="text-xs sm:text-sm">
                          Idade
                        </TableHead>
                        <TableHead className="hidden lg:table-cell text-xs sm:text-sm">
                          Gênero
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedParticipants.map((participant) => (
                        <TableRow key={participant.id}>
                          <TableCell className="font-medium text-xs sm:text-sm">
                            <div className="flex flex-col">
                              <span>{participant.name}</span>
                              {/* Mostrar informações extras em telas pequenas */}
                              <div className="sm:hidden text-muted-foreground text-xs mt-1">
                                <div className="flex flex-wrap gap-1">
                                  <Badge variant="outline" className="text-xs">
                                    {participant.typeInscription ||
                                      "Não informado"}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {participant.gender === "MASCULINO"
                                      ? "Masculino"
                                      : participant.gender === "FEMININO"
                                        ? "Feminino"
                                        : participant.gender}
                                  </Badge>
                                </div>
                                <div className="mt-1">
                                  {formatDate(participant.birthDate)}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge variant="outline" className="text-xs">
                              {participant.typeInscription || "Não informado"}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-xs sm:text-sm">
                            {formatDate(participant.birthDate)}
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm font-medium">
                            {calculateAge(participant.birthDate)} anos
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <Badge variant="outline" className="text-xs">
                              {participant.gender === "MASCULINO"
                                ? "Masculino"
                                : participant.gender === "FEMININO"
                                  ? "Feminino"
                                  : participant.gender}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Paginação - Estilo igual ao AccountsTable */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
                    <div className="text-sm text-muted-foreground text-center sm:text-left">
                      Mostrando {paginatedParticipants.length} de{" "}
                      {data.participants.length} participantes
                    </div>

                    <div className="flex justify-center">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() => goToPreviousPage()}
                              href="#"
                              className={
                                currentPage === 1
                                  ? "pointer-events-none opacity-50"
                                  : ""
                              }
                            />
                          </PaginationItem>
                          {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                          ).map((page) => (
                            <PaginationItem key={page}>
                              <PaginationLink
                                isActive={currentPage === page}
                                href="#"
                                onClick={() => goToPage(page)}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationNext
                              onClick={() => goToNextPage()}
                              href="#"
                              className={
                                currentPage === totalPages
                                  ? "pointer-events-none opacity-50"
                                  : ""
                              }
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>

                    <div className="text-sm text-muted-foreground text-center sm:text-right">
                      Página {currentPage} de {totalPages}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab de Pagamentos */}
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="text-lg sm:text-xl">
                    Histórico de Pagamentos
                  </CardTitle>
                  <Button
                    onClick={handleRegisterPayment}
                    className="dark:text-white"
                  >
                    <Plus className="h-4 w-4 mr-2 dark:text-white" />
                    Registrar Pagamento
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {data.payments && data.payments.length > 0 ? (
                  <>
                    {/* Lista mobile (sem tabela) */}
                    <div className="sm:hidden space-y-3">
                      {paginatedPayments.map((payment) => (
                        <div key={payment.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <Badge className={getStatusColor(payment.status)}>
                              {getStatusText(payment.status)}
                            </Badge>
                            <span className="text-sm font-medium">
                              {formatCurrency(payment.value)}
                            </span>
                          </div>
                          <div className="mt-2 text-xs text-muted-foreground">
                            <div>{formatDateTime(payment.createdAt)}</div>
                            {payment.rejectionReason && (
                              <div className="mt-1">
                                <Badge
                                  variant="destructive"
                                  className="text-[10px] max-w-full truncate"
                                >
                                  {payment.rejectionReason}
                                </Badge>
                              </div>
                            )}
                          </div>
                          <div className="mt-3">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full"
                                  onClick={() => {
                                    setSelectedImage(payment.image);
                                    handleImageStart(payment.id);
                                  }}
                                >
                                  <Eye className="h-4 w-4 mr-1" /> Ver
                                  comprovante
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>
                                    Comprovante de Pagamento
                                  </DialogTitle>
                                  <DialogDescription>
                                    Comprovante do pagamento{" "}
                                    {payment.id.slice(0, 8)}...
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="flex justify-center">
                                  {imageLoading[payment.id] && (
                                    <div className="flex items-center justify-center h-96 w-full">
                                      <Loader2 className="h-8 w-8 animate-spin" />
                                    </div>
                                  )}
                                  <img
                                    src={payment.image}
                                    alt={`Comprovante do pagamento ${payment.id}`}
                                    className={`max-h-96 rounded-lg ${imageLoading[payment.id] ? "hidden" : "block"}`}
                                    onLoad={() => handleImageLoad(payment.id)}
                                    onError={() => handleImageError(payment.id)}
                                  />
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button
                                    className="text-white"
                                    onClick={() =>
                                      handleDownloadImage(
                                        payment.image,
                                        payment.id
                                      )
                                    }
                                    disabled={downloadLoading[payment.id]}
                                  >
                                    {downloadLoading[payment.id] ? (
                                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                    ) : (
                                      <Download className="h-4 w-4 mr-1" />
                                    )}
                                    Download
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tabela desktop */}
                    <div className="hidden sm:block overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-xs sm:text-sm">
                              Status
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm">
                              Valor
                            </TableHead>
                            <TableHead className="hidden sm:table-cell text-xs sm:text-sm">
                              Comprovante
                            </TableHead>
                            <TableHead className="hidden md:table-cell text-xs sm:text-sm">
                              Data do Pagamento
                            </TableHead>
                            <TableHead className="hidden lg:table-cell text-xs sm:text-sm">
                              Motivo da Rejeição
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedPayments.map((payment) => (
                            <TableRow key={payment.id}>
                              <TableCell>
                                <Badge
                                  className={getStatusColor(payment.status)}
                                >
                                  {getStatusText(payment.status)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {formatCurrency(payment.value)}
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          setSelectedImage(payment.image);
                                          handleImageStart(payment.id);
                                        }}
                                      >
                                        <Eye className="h-4 w-4 mr-1" />
                                        Visualizar
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-2xl">
                                      <DialogHeader>
                                        <DialogTitle>
                                          Comprovante de Pagamento
                                        </DialogTitle>
                                        <DialogDescription>
                                          Comprovante do pagamento{" "}
                                          {payment.id.slice(0, 8)}...
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="flex justify-center">
                                        {imageLoading[payment.id] && (
                                          <div className="flex items-center justify-center h-96 w-full">
                                            <Loader2 className="h-8 w-8 animate-spin" />
                                          </div>
                                        )}
                                        <img
                                          src={payment.image}
                                          alt={`Comprovante do pagamento ${payment.id}`}
                                          className={`max-h-96 rounded-lg ${imageLoading[payment.id] ? "hidden" : "block"}`}
                                          onLoad={() =>
                                            handleImageLoad(payment.id)
                                          }
                                          onError={() =>
                                            handleImageError(payment.id)
                                          }
                                        />
                                      </div>
                                      <div className="flex justify-end gap-2">
                                        <Button
                                          onClick={() =>
                                            handleDownloadImage(
                                              payment.image,
                                              payment.id
                                            )
                                          }
                                          disabled={downloadLoading[payment.id]}
                                          className="text-white"
                                        >
                                          {downloadLoading[payment.id] ? (
                                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                          ) : (
                                            <Download className="h-4 w-4 mr-1" />
                                          )}
                                          Download
                                        </Button>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              </TableCell>
                              <TableCell>
                                {formatDateTime(payment.createdAt)}
                              </TableCell>
                              <TableCell>
                                {payment.rejectionReason ? (
                                  <Badge
                                    variant="destructive"
                                    className="max-w-xs truncate"
                                  >
                                    {payment.rejectionReason}
                                  </Badge>
                                ) : (
                                  <span className="text-muted-foreground">
                                    -
                                  </span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 dark:text-white">
                    <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4 dark:text-white" />
                    <p className="text-muted-foreground mb-4 dark:text-white">
                      Nenhum pagamento encontrado
                    </p>
                    <Button
                      onClick={handleRegisterPayment}
                      className="dark:text-white"
                    >
                      <Plus className="h-4 w-4 mr-2 dark:text-white" />
                      Registrar Primeiro Pagamento
                    </Button>
                  </div>
                )}

                {/* Paginação para pagamentos */}
                {totalPaymentPages > 1 && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
                    <div className="text-sm text-muted-foreground text-center sm:text-left">
                      Mostrando {paginatedPayments.length} de{" "}
                      {data.payments?.length || 0} pagamentos
                    </div>

                    <div className="flex justify-center">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() => goToPreviousPaymentPage()}
                              href="#"
                              className={
                                currentPaymentPage === 1
                                  ? "pointer-events-none opacity-50"
                                  : ""
                              }
                            />
                          </PaginationItem>
                          {Array.from(
                            { length: totalPaymentPages },
                            (_, i) => i + 1
                          ).map((page) => (
                            <PaginationItem key={page}>
                              <PaginationLink
                                isActive={currentPaymentPage === page}
                                href="#"
                                onClick={() => goToPaymentPage(page)}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationNext
                              onClick={() => goToNextPaymentPage()}
                              href="#"
                              className={
                                currentPaymentPage === totalPaymentPages
                                  ? "pointer-events-none opacity-50"
                                  : ""
                              }
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>

                    <div className="text-sm text-muted-foreground text-center sm:text-right">
                      Página {currentPaymentPage} de {totalPaymentPages}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <RegisterPaymentDialog
        open={registerPaymentOpen}
        onOpenChange={setRegisterPaymentOpen}
        inscriptionId={data.id}
        totalValue={data.totalValue}
      />
    </div>
  );
}
