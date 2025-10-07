"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/shared/components/ui/pagination";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import {
  ChevronDown,
  ChevronUp,
  Users,
  Calendar,
  MapPin,
  Clock,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/shared/components/ui/dialog";
import { DialogClose, DialogTitle } from "@radix-ui/react-dialog";
import { Form, FormProvider } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/shared/components/ui/form";
import useFormCreateRegion from "@/features/regions/hooks/useFormCreateRegion";
import { Input } from "@/shared/components/ui/input";
import { useRegionsAll } from "../hooks/useRegionsAll";
import { get } from "http";

const PAGE_SIZE = 4;

export default function RegionsTable() {
  const [open, setOpen] = useState(false);
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null);
  const { form, onSubmit } = useFormCreateRegion();
  const { regions, total, page, pageCount, loading, setPage } = useRegionsAll({
    initialPage: 1,
    pageSize: PAGE_SIZE,
  });

  const toggleExpand = (regionId: string) => {
    setExpandedRegion(expandedRegion === regionId ? null : regionId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  // Retorna o status do evento: "Agendado", "Em andamento" ou "Realizado"
  const getStatus = (startDate: string, endDate?: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : undefined;
    if (end && now > end) return "Realizado";
    if (now >= start && (!end || now <= end)) return "Em andamento";
    if (now < start) return "Agendado";
    return "-";
  };

  // Calcular índice inicial para a paginação
  const startIndex = (page - 1) * 4;

  // Função para lidar com o submit e fechar o dialog se sucesso
  const handleSubmit = async (event: React.FormEvent) => {
    const success = await onSubmit(event);
    if (success) setOpen(false);
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div>Carregando...</div>
      </div>
    );
  }

  return (
    <div className="p-6 relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Regiões
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie e visualize todas as regiões cadastradas
          </p>
        </div>
        <Button
          variant="default"
          className="dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/80"
          onClick={() => setOpen(true)}
        >
          Nova Região
        </Button>
      </div>

      {/* Overlay para quando um card estiver expandido */}
      {expandedRegion && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
          onClick={() => setExpandedRegion(null)}
        />
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-primary font-bold">
              Criar Nova Região
            </DialogTitle>
          </DialogHeader>
          {/* Formulario de criação da Região */}
          <FormProvider {...form}>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor="name"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center text-transform: uppercase"
                      >
                        <i className="bi bi-geo-alt text-indigo-500 dark:text-blue-500"></i>
                        Região
                      </FormLabel>
                      <FormControl className="relative">
                        <Input
                          id="username"
                          type="text"
                          autoComplete="off"
                          placeholder="Digite sua localidade"
                          className="w-full rounded-xl border-gray-300 bg-white/50 dark:bg-gray-800/50 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-60 focus:shadow-md dark:border-gray-600 dark:text-white backdrop-blur-sm transition-all duration-300 pl-4 pr-4 py-3"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  className="dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/80"
                >
                  Criar
                </Button>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6 relative">
        {regions.map((region) => (
          <div
            key={region.id}
            className={cn(
              "transition-all duration-300 ease-in-out",
              expandedRegion === region.id
                ? "fixed inset-0 z-50 flex items-center justify-center p-4"
                : "relative"
            )}
          >
            <Card
              className={cn(
                "transition-all duration-300 ease-in-out border-2 bg-card shadow-sm w-full",
                expandedRegion === region.id
                  ? "border-blue-500 shadow-2xl max-w-6xl max-h-[90vh] overflow-y-auto z-50"
                  : "border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 hover:scale-[1.02] cursor-pointer",
                expandedRegion &&
                  expandedRegion !== region.id &&
                  "opacity-30 blur-sm"
              )}
              onClick={(e) => {
                if (!expandedRegion) {
                  e.stopPropagation();
                  toggleExpand(region.id);
                }
              }}
            >
              {/* Header do Card */}
              <CardHeader className="pb-3 border-b">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                        {region.name.substring(0, 2).toUpperCase()}
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-2xl">
                        {region.name.toUpperCase()}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {region.numberOfAccounts} contas
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {region.numberOfEvents} eventos
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pb-3">
                {/* Estatísticas */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {region.numberOfAccounts}
                      </p>
                      <p className="text-xs text-muted-foreground">Contas</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                      <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        {region.numberOfEvents}
                      </p>
                      <p className="text-xs text-muted-foreground">Eventos</p>
                    </div>
                  </div>
                </div>

                {/* Eventos */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">Último evento:</span>
                    </div>
                    <span className="text-sm font-medium">
                      {region.lastEvent
                        ? formatDate(region.lastEvent.createdAt)
                        : "Nenhum"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Próximo evento:</span>
                    </div>
                    <span className="text-sm font-medium text-black-600 dark:text-white">
                      {region.nextEventAt
                        ? formatDate(region.nextEventAt.createdAt)
                        : "Nenhum agendado"}
                    </span>
                  </div>
                </div>

                {/* Conteúdo Expandido */}
                {expandedRegion === region.id &&
                  (() => {
                    // Badge do próximo evento: status e cor
                    let nextStatus = null;
                    let nextBadgeColor = "bg-blue-600";
                    if (region.nextEventAt) {
                      nextStatus = getStatus(
                        region.nextEventAt.startDate,
                        region.nextEventAt.endDate
                      );
                      if (nextStatus === "Agendado")
                        nextBadgeColor = "bg-green-600";

                      if (nextStatus === "Realizado")
                        nextBadgeColor = "bg-red-600";
                    }
                    return (
                      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-6">
                        {/* Dados dos Eventos */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Último Evento */}
                          <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2 text-lg">
                              <Clock className="h-5 w-5 text-orange-500" />
                              Último Evento
                            </h4>
                            {region.lastEvent ? (
                              <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                                <div className="relative h-32">
                                  {region.lastEvent.imageUrl ? (
                                    <img
                                      src={region.lastEvent.imageUrl}
                                      alt={region.lastEvent.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500" />
                                  )}
                                  <div className="absolute inset-0 bg-black/20" />
                                  <Badge className="absolute top-2 right-2 bg-green-600">
                                    Realizado
                                  </Badge>
                                </div>
                                <div className="p-4">
                                  <h5 className="font-bold text-lg mb-2">
                                    {region.lastEvent.name}
                                  </h5>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">
                                        Data:
                                      </span>
                                      <span className="font-medium">
                                        {formatDate(region.lastEvent.createdAt)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">
                                        Status:
                                      </span>
                                      <span className="font-medium">
                                        {getStatus(
                                          region.lastEvent.startDate,
                                          region.lastEvent.endDate
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="text-center py-8 text-muted-foreground border rounded-lg">
                                <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p>Nenhum evento realizado</p>
                              </div>
                            )}
                          </div>

                          {/* Próximo Evento */}
                          <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2 text-lg">
                              <Calendar className="h-5 w-5 text-blue-500" />
                              Próximo Evento
                            </h4>
                            {region.nextEventAt ? (
                              <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                                <div className="relative h-32">
                                  {region.nextEventAt.imageUrl ? (
                                    <img
                                      src={region.nextEventAt.imageUrl}
                                      alt={region.nextEventAt.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500" />
                                  )}
                                  <div className="absolute inset-0 bg-black/20" />
                                  <Badge
                                    className={`absolute top-2 right-2 ${nextBadgeColor} text-white min-w-[90px] flex items-center justify-center align-center`}
                                  >
                                    {nextStatus}
                                  </Badge>
                                </div>
                                <div className="p-4">
                                  <h5 className="font-bold text-lg mb-2">
                                    {region.nextEventAt.name}
                                  </h5>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">
                                        Data:
                                      </span>
                                      <span className="font-medium">
                                        {formatDate(
                                          region.nextEventAt.createdAt
                                        )}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">
                                        Status:
                                      </span>
                                      <span className="font-medium text-black-600 dark:text-white">
                                        {nextStatus}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="text-center py-8 text-muted-foreground border rounded-lg">
                                <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p>Nenhum evento agendado</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
              </CardContent>

              {/* Footer do Card */}
              <CardFooter className="border-t pt-4 flex justify-end">
                <Button
                  variant={expandedRegion === region.id ? "default" : "outline"}
                  className={cn(
                    "w-50 flex items-center justify-center gap-2 transition-all bg-primary text-white dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/80",
                    expandedRegion === region.id &&
                      "bg-blue-600 hover:bg-blue-700"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand(region.id);
                  }}
                >
                  {expandedRegion === region.id ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      Fechar Detalhes
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      Ver Detalhes Completos
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>

      {/* Mensagem quando não há regiões */}
      {regions.length === 0 && (
        <div className="text-center py-16">
          <div className="text-muted-foreground mb-6">
            <MapPin className="h-20 w-20 mx-auto mb-4 opacity-30" />
            <h3 className="text-xl font-medium mb-2">
              Nenhuma região encontrada
            </h3>
            <p className="max-w-md mx-auto">
              Não há regiões cadastradas no momento. Comece criando a primeira
              região para organizar seus usuários e eventos.
            </p>
          </div>
          <Button size="lg">Criar Primeira Região</Button>
        </div>
      )}

      {/* Paginação */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t">
        <div className="text-sm text-muted-foreground">
          Mostrando {startIndex + 1}-{Math.min(startIndex + 4, total)} de{" "}
          {total} regiões
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => page > 1 && setPage(page - 1)}
                href={page > 1 ? "#" : undefined}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
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
                onClick={() => page < pageCount && setPage(page + 1)}
                href={page < pageCount ? "#" : undefined}
                className={
                  page === pageCount ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
