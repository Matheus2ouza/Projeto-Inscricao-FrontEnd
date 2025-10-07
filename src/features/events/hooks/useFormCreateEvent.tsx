"use client";

import { useGlobalLoading } from "@/components/GlobalLoading";
import { useForm } from "react-hook-form";
import z from "zod";
import { registerEvent } from "../api/registerEvent";
import { toast } from "sonner";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { DateRange } from "react-day-picker";

const EventSchema = z.object({
  name: z
    .string()
    .min(2, { message: "O nome do Evento deve ter pelo menos 2 Caracteres" }),
  image: z
    .instanceof(File)
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      {
        message: "A imagem deve ser JPEG, PNG ou WebP",
      }
    )
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "A imagem deve ter no máximo 5MB",
    })
    .optional(),
  regionId: z.string().min(1, { message: "Região é obrigatória" }),
});

type EventFormType = z.infer<typeof EventSchema>;

export type useFormCreateEvent = {
  form: ReturnType<typeof useForm<EventFormType>>;
  onSubmit: (event?: React.BaseSyntheticEvent) => Promise<boolean>;
  dateRange: DateRange | undefined;
  setDateRange: (dateRange: DateRange | undefined) => void;
};

// Função para converter File para base64
const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

// Função para converter Date para ISO string
const convertToISOString = (date: Date): string => {
  const newDate = new Date(date);
  newDate.setHours(20, 0, 0, 0); // Define como 20:00:00
  return newDate.toISOString();
};

export default function useFormCreateEvent(): useFormCreateEvent {
  const { setLoading } = useGlobalLoading();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 3)),
  });

  const form = useForm<EventFormType>({
    resolver: zodResolver(EventSchema),
    defaultValues: {
      name: "",
      regionId: "",
    },
  });

  async function onCreateForm(input: EventFormType) {
    try {
      setLoading(true);

      // Validar se as datas foram selecionadas
      if (!dateRange?.from || !dateRange?.to) {
        toast.error("Período inválido", {
          description: "Selecione as datas de início e término do evento.",
          icon: <ThumbsDown />,
        });
        return false;
      }

      // Validar se a data final é posterior à data inicial
      if (dateRange.to < dateRange.from) {
        toast.error("Período inválido", {
          description: "A data de término deve ser posterior à data de início.",
          icon: <ThumbsDown />,
        });
        return false;
      }

      // Converter imagem para base64 se existir
      let imageBase64: string | undefined;
      if (input.image) {
        imageBase64 = await convertFileToBase64(input.image);
      }

      // Converter datas para o formato ISO esperado pela API
      const startDateISO = convertToISOString(dateRange.from);
      const endDateISO = convertToISOString(dateRange.to);

      // Preparar dados no formato esperado pela API
      const eventData = {
        name: input.name,
        startDate: startDateISO,
        endDate: endDateISO,
        regionId: input.regionId,
        image: imageBase64,
      };

      console.log("Dados do evento a serem enviados para a API:");
      console.log(
        JSON.stringify(
          eventData,
          (key, value) =>
            key === "image"
              ? value?.slice(0, 70) + "...[base64 truncado]"
              : value,
          2
        )
      );

      await registerEvent(eventData);

      form.reset();
      setDateRange({
        from: new Date(),
        to: new Date(new Date().setDate(new Date().getDate() + 3)),
      });

      toast.success("Evento criado com sucesso!", {
        description: "Evento criado com sucesso e pronto para uso.",
        icon: <ThumbsUp />,
      });
      return true;
    } catch (error) {
      const err = error as Error;
      toast.error("Erro ao criar evento", {
        description: err.message,
        icon: <ThumbsDown />,
      });
      return false;
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = async (event?: React.BaseSyntheticEvent) => {
    let result = false;
    await form.handleSubmit(async (data) => {
      result = await onCreateForm(data);
    })(event);
    return result;
  };

  return {
    form,
    onSubmit,
    dateRange,
    setDateRange,
  };
}
