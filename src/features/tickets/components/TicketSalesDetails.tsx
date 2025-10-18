"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { ArrowLeft, Loader2, RefreshCcw, Ticket, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useSaleGroupTicket } from "../hooks/useSaleGroupTicket";
import { useTicketSalesDetails } from "../hooks/useTicketSalesDetails";
import {
  PAYMENT_METHOD_OPTIONS,
  STATUS_PAYMENT_OPTIONS,
} from "../types/ticketSaleGroupTypes";

interface TicketSalesDetailsProps {
  eventId: string;
  ticketId: string;
}

export default function TicketSalesDetails({
  eventId,
  ticketId,
}: TicketSalesDetailsProps) {
  const router = useRouter();
  const { data, isLoading, isFetching, error, refetch } =
    useTicketSalesDetails(ticketId);
  const [openSaleDialog, setOpenSaleDialog] = useState(false);
  const {
    form: saleGroupForm,
    submit: submitSaleGroup,
    submitting: submittingSaleGroup,
    reset: resetSaleGroup,
  } = useSaleGroupTicket(ticketId);

  useEffect(() => {
    if (data?.price != null) {
      saleGroupForm.setValue("pricePerTicket", String(data.price));
    }
  }, [data?.price, saleGroupForm]);

  const handleSaleDialogChange = (open: boolean) => {
    setOpenSaleDialog(open);
    if (open) {
      if (data?.price != null) {
        saleGroupForm.setValue("pricePerTicket", String(data.price));
      }
      return;
    }

    resetSaleGroup({
      pricePerTicket:
        data?.price != null ? String(data.price) : "",
    });
  };

  const handleSaleGroupSubmit = saleGroupForm.handleSubmit(async (values) => {
    const success = await submitSaleGroup(values);
    if (success) {
      resetSaleGroup({
        pricePerTicket:
          data?.price != null ? String(data.price) : "",
      });
      setOpenSaleDialog(false);
    }
  });

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
      }),
    []
  );

  const totalSoldQuantity = useMemo(() => {
    if (!data?.ticketSale?.length) return 0;
    return data.ticketSale.reduce((acc, sale) => acc + sale.quantity, 0);
  }, [data]);

  const totalRevenue = useMemo(() => {
    if (!data?.ticketSale?.length) return 0;
    return data.ticketSale.reduce((acc, sale) => acc + sale.totalValue, 0);
  }, [data]);

  const handleBack = () => {
    router.push(`/super/tickets/analysis/${eventId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleBack}
              className="border-gray-200 dark:border-gray-600"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Detalhes de Vendas
              </h1>
              {data && (
                <p className="text-sm text-muted-foreground">
                  Ticket: {data.name}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => refetch()}
              disabled={isFetching}
              className="flex items-center gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              Atualizar
            </Button>
            <Button
              type="button"
              onClick={() => setOpenSaleDialog(true)}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Venda em grupo
            </Button>
          </div>
        </div>

        <Dialog open={openSaleDialog} onOpenChange={handleSaleDialogChange}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar venda em grupo</DialogTitle>
            </DialogHeader>
            <Form {...saleGroupForm}>
              <form
                onSubmit={handleSaleGroupSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <FormField
                  control={saleGroupForm.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantidade</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          step={1}
                          placeholder="0"
                          value={field.value ?? ""}
                          onChange={(event) => field.onChange(event.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={saleGroupForm.control}
                  name="pricePerTicket"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço por ticket (R$)</FormLabel>
                      <input
                        type="hidden"
                        value={field.value ?? ""}
                        name={field.name}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        ref={field.ref}
                      />
                      <FormControl>
                        <Input
                          value={
                            field.value
                              ? currencyFormatter.format(Number(field.value))
                              : ""
                          }
                          readOnly
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={saleGroupForm.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Forma de pagamento</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a forma de pagamento" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PAYMENT_METHOD_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={saleGroupForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status do pagamento</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {STATUS_PAYMENT_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className="md:col-span-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSaleDialogChange(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={submittingSaleGroup}>
                    {submittingSaleGroup ? "Registrando..." : "Registrar"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {error && (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 text-center text-red-600">
              {error instanceof Error
                ? error.message
                : "Erro ao carregar detalhes do ticket"}
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : data ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Estoque do Ticket
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {data.quantity}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Quantidade criada
                    </p>
                  </div>
                  <Ticket className="h-8 w-8 text-primary" />
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Vendidos
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {totalSoldQuantity}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Quantidade total vendida
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Receita Gerada
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {currencyFormatter.format(totalRevenue)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Soma de todas as vendas
                    </p>
                  </div>
                  <Ticket className="h-8 w-8 text-emerald-500" />
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                  Informações do Ticket
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Nome</p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      {data.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Preço</p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      {currencyFormatter.format(data.price)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Disponíveis</p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      {data.available}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Criado
                    </p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      {data.quantity}
                    </p>
                  </div>
                </div>
                {data.description && (
                  <div>
                    <p className="text-sm text-muted-foreground">Descrição</p>
                    <p className="text-base text-gray-900 dark:text-white">
                      {data.description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="flex items-center justify-between flex-wrap gap-4">
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                  Vendas Realizadas
                </CardTitle>
                {isFetching && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Atualizando...
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {data.ticketSale.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Nenhuma venda registrada para este ticket.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID da Venda</TableHead>
                          <TableHead className="text-right">
                            Quantidade
                          </TableHead>
                          <TableHead className="text-right">
                            Valor Total
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.ticketSale.map((sale) => (
                          <TableRow key={sale.id}>
                            <TableCell className="font-medium">
                              {sale.id}
                            </TableCell>
                            <TableCell className="text-right">
                              {sale.quantity}
                            </TableCell>
                            <TableCell className="text-right">
                              {currencyFormatter.format(sale.totalValue)}
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
        ) : null}
      </div>
    </div>
  );
}
