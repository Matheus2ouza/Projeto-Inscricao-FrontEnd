"use client";

import { Badge } from "@/shared/components/ui/badge";
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
import { ArrowLeft, Loader2, RefreshCcw } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { useRelatorioGeral } from "../hooks/useRelatorioGeral";

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

const formatCurrency = (value: number) => currencyFormatter.format(value || 0);

const formatDateTime = (value: Date) => dateFormatter.format(value);

const formatDateRange = (start: Date, end: Date) =>
  `${periodFormatter.format(start)} - ${periodFormatter.format(end)}`;

const prettifyStatus = (status: string) =>
  status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/(?:^|\s)\w/g, (c) => c.toUpperCase());

const SummaryMetric = ({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) => (
  <div
    className={cn(
      "rounded-lg border bg-background px-4 py-3 transition-shadow",
      highlight ? "border-primary/40 shadow-md" : "border-border"
    )}
  >
    <span className="text-xs font-medium uppercase text-muted-foreground tracking-wide">
      {label}
    </span>
    <p className="mt-2 text-lg font-semibold text-foreground">
      {formatCurrency(value)}
    </p>
  </div>
);

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
}) => (
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
    <SummaryMetric label="Total" value={total} highlight />
    <SummaryMetric label="Dinheiro" value={totalDinheiro} />
    <SummaryMetric label="PIX" value={totalPix} />
    <SummaryMetric label="Cartão" value={totalCartao} />
  </div>
);

export default function ReportDetails() {
  const params = useParams();
  const router = useRouter();
  const eventId = Array.isArray(params.id)
    ? params.id[0]
    : (params.id as string);

  const { data, loading, isFetching, error, refetch } =
    useRelatorioGeral(eventId);

  const hasData = Boolean(data);

  const totalsBySection = useMemo(
    () =>
      data
        ? [
            {
              title: "Inscrições (Grupos)",
              length: data.inscricoes.inscricoes.length,
            },
            {
              title: "Inscrições Avulsas",
              length: data.inscricoesAvulsas.inscricoes.length,
            },
            { title: "Vendas de Tickets", length: data.tickets.vendas.length },
            { title: "Gastos Registrados", length: data.gastos.gastos.length },
          ]
        : [],
    [data]
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-8 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Relatório Geral
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Consulte os dados consolidados do evento selecionado.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
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
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <SummaryMetric
                    label="Total Geral"
                    value={data.totais.totalGeral}
                    highlight
                  />
                  <SummaryMetric
                    label="Dinheiro"
                    value={data.totais.totalDinheiro}
                  />
                  <SummaryMetric label="PIX" value={data.totais.totalPix} />
                  <SummaryMetric
                    label="Cartão"
                    value={data.totais.totalCartao}
                  />
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-lg border bg-background px-4 py-3">
                    <span className="text-xs font-medium uppercase text-muted-foreground tracking-wide">
                      Montante Arrecadado
                    </span>
                    <p className="mt-2 text-lg font-semibold text-foreground">
                      {formatCurrency(data.event.amountCollected)}
                    </p>
                  </div>
                  {totalsBySection.map((section) => (
                    <div
                      key={section.title}
                      className="rounded-lg border bg-background px-4 py-3"
                    >
                      <span className="text-xs font-medium uppercase text-muted-foreground tracking-wide">
                        {section.title}
                      </span>
                      <p className="mt-2 text-lg font-semibold text-foreground">
                        {section.length}
                      </p>
                    </div>
                  ))}
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
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Responsável</TableHead>
                          <TableHead>Telefone</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Criado em</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.inscricoes.inscricoes.map((inscricao) => (
                          <TableRow key={inscricao.id}>
                            <TableCell className="font-medium">
                              {inscricao.responsible}
                            </TableCell>
                            <TableCell>
                              {inscricao.phone || "Não informado"}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {prettifyStatus(inscricao.status)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {formatCurrency(inscricao.totalValue)}
                            </TableCell>
                            <TableCell>
                              {formatDateTime(inscricao.createdAt)}
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
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Responsável</TableHead>
                          <TableHead>Telefone</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Criado em</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.inscricoesAvulsas.inscricoes.map((inscricao) => (
                          <TableRow key={inscricao.id}>
                            <TableCell className="font-medium">
                              {inscricao.responsible}
                            </TableCell>
                            <TableCell>
                              {inscricao.phone || "Não informado"}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {prettifyStatus(inscricao.status)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {formatCurrency(inscricao.totalValue)}
                            </TableCell>
                            <TableCell>
                              {formatDateTime(inscricao.createdAt)}
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
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Quantidade</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Método</TableHead>
                          <TableHead>Criado em</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.tickets.vendas.map((venda) => (
                          <TableRow key={venda.id}>
                            <TableCell className="font-medium">
                              {venda.quantity}
                            </TableCell>
                            <TableCell>
                              {formatCurrency(venda.totalValue)}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {paymentMethodLabels[venda.paymentMethod] ??
                                  prettifyStatus(venda.paymentMethod)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {formatDateTime(venda.createdAt)}
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
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Descrição</TableHead>
                          <TableHead>Responsável</TableHead>
                          <TableHead>Método</TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead>Criado em</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.gastos.gastos.map((gasto) => (
                          <TableRow key={gasto.id}>
                            <TableCell className="font-medium">
                              {gasto.description}
                            </TableCell>
                            <TableCell>{gasto.responsible}</TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {paymentMethodLabels[gasto.paymentMethod] ??
                                  prettifyStatus(gasto.paymentMethod)}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatCurrency(gasto.value)}</TableCell>
                            <TableCell>
                              {formatDateTime(gasto.createdAt)}
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
