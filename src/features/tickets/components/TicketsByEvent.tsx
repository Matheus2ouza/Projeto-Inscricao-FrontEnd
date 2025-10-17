"use client";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
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
import { Textarea } from "@/shared/components/ui/textarea";
import { cn } from "@/shared/lib/utils";
import { Plus, Ticket, Wallet } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useCreateTicket } from "../hooks/useCreateTicket";
import { useTicketsByEvent } from "../hooks/useTicketsByEvent";

export default function TicketsByEvent() {
  const params = useParams();
  const eventId = params.id as string;
  const {
    data: tickets,
    isLoading,
    error,
    invalidate,
  } = useTicketsByEvent(eventId);

  const [openCreate, setOpenCreate] = useState(false);
  const { form, onSubmit, submitting } = useCreateTicket(eventId);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Tickets do Evento
          </h1>
          <Button
            onClick={() => setOpenCreate(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Novo Ticket
          </Button>
        </div>

        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Ticket</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={onSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do ticket" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantidade</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço (R$)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0,00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descrição (opcional)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="md:col-span-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpenCreate(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Criando..." : "Criar Ticket"}
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
                : "Erro ao carregar tickets"}
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(tickets || []).map((t) => (
            <Card
              key={t.id}
              className="border-0 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-primary" />
                    <h3 className="text-lg font-semibold">{t.name}</h3>
                  </div>
                  <span
                    className={cn(
                      "px-2 py-1 text-xs rounded-md",
                      t.available > 0
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                    )}
                  >
                    {t.available} disp.
                  </span>
                </div>

                {t.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {t.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span>Quantidade: {t.quantity}</span>
                  <span className="flex items-center gap-1">
                    <Wallet className="w-4 h-4" />
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(t.price)}
                  </span>
                </div>

                <div className="flex justify-end">
                  <Button variant="outline" size="sm">
                    Ver Vendas
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
