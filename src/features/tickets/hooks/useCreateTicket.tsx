"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { createTicket } from "../api/createTicket";
import { ticketsKeys } from "../types/ticketsTypes";

const createTicketSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Nome deve ter pelo menos 2 caracteres" })
    .max(60, { message: "Nome deve ter no máximo 60 caracteres" }),
  quantity: z.string().refine((v) => !isNaN(Number(v)) && Number(v) > 0, {
    message: "Quantidade deve ser um número maior que 0",
  }),
  price: z.string().refine((v) => !isNaN(Number(v)) && Number(v) >= 0, {
    message: "Preço deve ser um número válido",
  }),
  description: z.string().optional(),
});

export type CreateTicketFormType = z.infer<typeof createTicketSchema>;

export function useCreateTicket(eventId: string) {
  const queryClient = useQueryClient();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<CreateTicketFormType>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      name: "",
      quantity: "",
      price: "",
      description: "",
    },
  });

  async function onCreate(input: CreateTicketFormType) {
    setSubmitting(true);
    try {
      const payload = {
        eventId,
        name: input.name,
        description: input.description || undefined,
        quantity: Number(input.quantity),
        price: Number(input.price),
      };

      const result = await createTicket(payload);
      toast.success("Ticket criado com sucesso", {
        description: `ID: ${result.id}`,
      });

      await queryClient.invalidateQueries({
        queryKey: ticketsKeys.byEvent(eventId),
      });
      form.reset();
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao criar ticket";
      toast.error(message);
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  const onSubmit = (event?: React.BaseSyntheticEvent) =>
    form.handleSubmit(onCreate)(event);

  return { form, onSubmit, submitting };
}
