"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { cn } from "@/shared/lib/utils";
import { ArrowLeft, Download, Loader2, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { genaratePdfReport } from "../api/genaratePdfReport";
import { useReportGeneral } from "../hooks/useReportGeneral";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

const periodFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const paymentMethodLabels: Record<string, string> = {
  PIX: "PIX",
  CARTAO: "Cartão",
  CARTAO_CREDITO: "Cartão de Crédito",
  CARTAO_DEBITO: "Cartão de Débito",
  DINHEIRO: "Dinheiro",
};

const statusLabels: Record<string, string> = {
  PENDING: "Pendente",
  UNDER_REVIEW: "Em análise",
  PAID: "Pago",
  CANCELLED: "Cancelada",
};

const formatCurrency = (value: number) => currencyFormatter.format(value || 0);
const numberFormatter = new Intl.NumberFormat("pt-BR");
const formatNumber = (value: number) => numberFormatter.format(value || 0);
const formatDateTime = (value: Date) => dateFormatter.format(value);

const formatDateRange = (start: Date, end: Date) =>
  `${periodFormatter.format(start)} - ${periodFormatter.format(end)}`;

const prettifyStatus = (status: string) =>
  statusLabels[status] ??
  status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/(?:^|\s)\w/g, (c) => c.toUpperCase());

const SummaryMetric = ({
  label,
  value,
  highlight = false,
  formatter = formatCurrency,
}: {
  label: string;
  value: number;
  highlight?: boolean;
  formatter?: (value: number) => string;
}) => {
  const baseClasses =
    "rounded-lg border border-border bg-background px-4 py-3 transition-all";
  const hoverClasses = highlight
    ? "hover:border-primary/50 hover:shadow-[0_4px_12px_rgba(59,130,246,0.15)]"
    : "hover:border-border/70 hover:bg-muted/30 hover:shadow-[0_2px_6px_rgba(0,0,0,0.08)]";

  return (
    <div className={cn(baseClasses, "hover:-translate-y-[2px]", hoverClasses)}>
      <span className="text-xs font-medium uppercase text-muted-foreground tracking-wide">
        {label}
      </span>
      <p className="mt-2 text-lg font-semibold text-foreground">
        {formatter(value)}
      </p>
    </div>
  );
};

const SectionSummary = ({
  total,
  totalDinheiro,
  totalPix,
  totalCartao,
}: {
  total: number;
  totalDinheiro: number;
  totalPix: number;
  totalCartao: number;
}) => {
  const metrics = [
    { label: "Total", value: total, highlight: true },
    { label: "Dinheiro", value: totalDinheiro, highlight: true },
    { label: "PIX", value: totalPix, highlight: true },
    { label: "Cartão", value: totalCartao, highlight: true },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <SummaryMetric
          key={metric.label}
          label={metric.label}
          value={metric.value}
          highlight={metric.highlight}
        />
      ))}
    </div>
  );
};

export default function ReportDetails() {
  const params = useParams();
  const eventId = Array.isArray(params.id)
    ? params.id[0]
    : (params.id as string);
  const [isDownloading, setIsDownloading] = useState(false);

  const { data, loading, isFetching, error, refetch } =
    useReportGeneral(eventId);

  const hasData = Boolean(data);

  const financialMetrics = useMemo(
    () =>
      data
        ? [
            {
              label: "Total Geral",
              value: data.totais.totalGeral,
              highlight: true,
            },
            {
              label: "Montante Arrecadado",
              value: data.totais.totalArrecadado,
              highlight: true,
            },
            {
              label: "Total em Dinheiro",
              value: data.totais.totalDinheiro,
              highlight: true,
            },
            {
              label: "Total em PIX",
              value: data.totais.totalPix,
              highlight: true,
            },
            {
              label: "Total em Cartão",
              value: data.totais.totalCartao,
              highlight: true,
            },
            {
              label: "Total de Gastos",
              value: data.totais.totalGastos,
              highlight: true,
            },
          ]
        : [],
    [data]
  );

  const infoMetrics = useMemo(
    () =>
      data
        ? [
            {
              label: "Inscrições (Grupos)",
              value: data.inscricoes.inscricoes.length,
              highlight: true,
            },
            {
              label: "Participantes (Grupos)",
              value: data.inscricoes.totalParticipantes,
              highlight: true,
            },
            {
              label: "Inscrições Avulsas",
              value: data.inscricoesAvulsas.inscricoes.length,
              highlight: true,
            },
            {
              label: "Participantes Avulsos",
              value: data.inscricoesAvulsas.totalParticipantes,
              highlight: true,
            },
            {
              label: "Vendas de Tickets",
              value: data.tickets.vendas.length,
              highlight: true,
            },
            {
              label: "Gastos Registrados",
              value: data.gastos.gastos.length,
              highlight: true,
            },
          ]
        : [],
    [data]
  );

  const handleDownloadReport = async () => {
    if (!eventId) return;

    try {
      setIsDownloading(true);

      // ⬇️ o backend agora retorna pdfBase64 e filename
      const { pdfBase64, filename } = await genaratePdfReport({ eventId });

      // converte base64 → blob
      const byteCharacters = atob(pdfBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });

      // cria link temporário pra download
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Erro ao baixar relatório em PDF:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível baixar o relatório."
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-8 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/super/relatorios">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Relatório Geral
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Consulte os dados consolidados do evento selecionado.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              onClick={handleDownloadReport}
              disabled={isDownloading}
              className="flex items-center gap-2"
            >
              {isDownloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {isDownloading ? "Gerando..." : "Baixar relatório"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                void refetch();
              }}
              disabled={isFetching || loading}
              className="flex items-center gap-2"
            >
              {isFetching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4" />
              )}
              Atualizar
            </Button>
          </div>
        </div>

        {loading && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-40 rounded-xl" />
            ))}
          </div>
        )}

        {!loading && error && (
          <Card className="border-0 shadow-sm">
            <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
              <p className="text-red-600 dark:text-red-400">
                {error ||
                  "Não foi possível carregar o relatório. Tente novamente."}
              </p>
              <Button
                onClick={() => {
                  void refetch();
                }}
                size="sm"
              >
                Tentar novamente
              </Button>
            </CardContent>
          </Card>
        )}

        {!loading && !error && !hasData && (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-8 text-center text-sm text-muted-foreground">
              Nenhum dado foi encontrado para este evento.
            </CardContent>
          </Card>
        )}

        {hasData && data && (
          <>
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="text-2xl font-semibold">
                    {data.event.name}
                  </CardTitle>
                  <CardDescription>Evento #{data.event.id}</CardDescription>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>
                    Período:{" "}
                    {formatDateRange(data.event.startDate, data.event.endDate)}
                  </p>
                  <p>
                    Local:{" "}
                    {data.event.location
                      ? data.event.location
                      : "Local não informado"}
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Totais financeiros
                    </span>
                    <div className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                      {financialMetrics.map((metric) => (
                        <SummaryMetric
                          key={metric.label}
                          label={metric.label}
                          value={metric.value}
                          highlight={Boolean(metric.highlight)}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Dados gerais
                    </span>
                    <div className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                      {infoMetrics.map((metric) => (
                        <SummaryMetric
                          key={metric.label}
                          label={metric.label}
                          value={metric.value}
                          formatter={formatNumber}
                          highlight={Boolean(metric.highlight)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Inscrições de Grupo</CardTitle>
                <CardDescription>
                  Relação de inscrições efetuadas por responsáveis.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <SectionSummary
                  total={data.inscricoes.total}
                  totalDinheiro={data.inscricoes.totalDinheiro}
                  totalPix={data.inscricoes.totalPix}
                  totalCartao={data.inscricoes.totalCartao}
                />
                {data.inscricoes.inscricoes.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                    Nenhuma inscrição registrada.
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-lg border">
                    <Table className="min-w-full table-fixed">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[40%]">Responsável</TableHead>
                          <TableHead className="w-[20%]">
                            Participantes
                          </TableHead>
                          <TableHead className="w-[20%]">Valor total</TableHead>
                          <TableHead className="w-[20%] text-right">
                            Data
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.inscricoes.inscricoes.map((inscricao) => (
                          <TableRow key={inscricao.id}>
                            <TableCell className="font-medium">
                              {inscricao.responsible}
                            </TableCell>
                            <TableCell>
                              {formatNumber(inscricao.countParticipants)}
                            </TableCell>
                            <TableCell>
                              {formatCurrency(inscricao.totalValue)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex flex-col items-end gap-1">
                                <span className="text-xs text-muted-foreground">
                                  {formatDateTime(inscricao.createdAt)}
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Inscrições Avulsas</CardTitle>
                <CardDescription>
                  Dados das inscrições realizadas presencialmente.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <SectionSummary
                  total={data.inscricoesAvulsas.total}
                  totalDinheiro={data.inscricoesAvulsas.totalDinheiro}
                  totalPix={data.inscricoesAvulsas.totalPix}
                  totalCartao={data.inscricoesAvulsas.totalCartao}
                />
                {data.inscricoesAvulsas.inscricoes.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                    Nenhuma inscrição avulsa registrada.
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-lg border">
                    <Table className="min-w-full table-fixed">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[40%]">Responsável</TableHead>
                          <TableHead className="w-[20%]">
                            Participantes
                          </TableHead>
                          <TableHead className="w-[20%]">Valor total</TableHead>
                          <TableHead className="w-[20%] text-right">
                            Data
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.inscricoesAvulsas.inscricoes.map((inscricao) => (
                          <TableRow key={inscricao.id}>
                            <TableCell className="font-medium">
                              {inscricao.responsible}
                            </TableCell>
                            <TableCell>
                              {formatNumber(inscricao.countParticipants)}
                            </TableCell>
                            <TableCell>
                              {formatCurrency(inscricao.totalValue)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex flex-col items-end gap-1">
                                <span className="text-xs text-muted-foreground">
                                  {formatDateTime(inscricao.createdAt)}
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Vendas de Tickets</CardTitle>
                <CardDescription>
                  Relatório das vendas registradas no evento.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <SectionSummary
                  total={data.tickets.total}
                  totalDinheiro={data.tickets.totalDinheiro}
                  totalPix={data.tickets.totalPix}
                  totalCartao={data.tickets.totalCartao}
                />
                {data.tickets.vendas.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                    Nenhuma venda de ticket registrada.
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-lg border">
                    <Table className="min-w-full table-fixed">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[40%]">Ingresso</TableHead>
                          <TableHead className="w-[20%]">Vendidos</TableHead>
                          <TableHead className="w-[20%]">Valor total</TableHead>
                          <TableHead className="w-[20%] text-right">
                            Data
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.tickets.vendas.map((venda) => (
                          <TableRow key={venda.id}>
                            <TableCell className="font-medium">
                              {venda.name}
                            </TableCell>
                            <TableCell className="font-medium">
                              {formatNumber(venda.quantitySold)}
                            </TableCell>
                            <TableCell>
                              {formatCurrency(venda.totalValue)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex flex-col items-end gap-1">
                                <span className="text-xs text-muted-foreground">
                                  {formatDateTime(venda.createdAt)}
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Gastos</CardTitle>
                <CardDescription>
                  Contabilização dos gastos vinculados ao evento.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <SectionSummary
                  total={data.gastos.total}
                  totalDinheiro={data.gastos.totalDinheiro}
                  totalPix={data.gastos.totalPix}
                  totalCartao={data.gastos.totalCartao}
                />
                {data.gastos.gastos.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                    Nenhum gasto registrado.
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-lg border">
                    <Table className="min-w-full table-fixed">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[40%]">Descrição</TableHead>
                          <TableHead className="w-[20%]">Responsável</TableHead>
                          <TableHead className="w-[20%]">Valor</TableHead>
                          <TableHead className="w-[20%] text-right">
                            Data
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.gastos.gastos.map((gasto) => (
                          <TableRow key={gasto.id}>
                            <TableCell className="font-medium">
                              {gasto.description}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <span>{gasto.responsible}</span>
                              </div>
                            </TableCell>
                            <TableCell>{formatCurrency(gasto.value)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex flex-col items-end gap-1">
                                <span className="text-xs text-muted-foreground">
                                  {formatDateTime(gasto.createdAt)}
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
