"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import {
  IndividualInscriptionSubmit,
  IndivUploadRouteResponse,
  UseFormIndividualInscriptionProps,
  UseFormIndividualInscriptionReturn,
} from "../types/individualInscriptionTypes";
import { useTypeInscriptionsQuery } from "./useTypeInscriptionsQuery";
import { useSubmitIndividualInscription } from "./useIndividualInscriptionQuery";

// Schema de validação com Zod (similar ao grupo)
const individualInscriptionSchema = z.object({
  responsible: z
    .string()
    .min(2, { message: "Nome deve ter pelo menos 2 caracteres" })
    .regex(/^[a-zA-ZÀ-ÿ\s']+$/, {
      message: "Nome deve conter apenas letras e espaços",
    })
    .transform((name) =>
      name
        .trim()
        .replace(/\s+/g, " ")
        .replace(/(^\w|\s\w)/g, (l) => l.toUpperCase())
    ),
  phone: z
    .string()
    .min(1, { message: "Telefone é obrigatório" })
    .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, {
      message: "Telefone deve estar no formato (11) 99999-9999",
    }),
  participantName: z
    .string()
    .min(2, {
      message: "Nome do participante deve ter pelo menos 2 caracteres",
    })
    .regex(/^[a-zA-ZÀ-ÿ\s']+$/, {
      message: "Nome deve conter apenas letras e espaços",
    })
    .transform((name) =>
      name
        .trim()
        .replace(/\s+/g, " ")
        .replace(/(^\w|\s\w)/g, (l) => l.toUpperCase())
    ),
  birthDate: z
    .string()
    .min(1, { message: "Data de nascimento é obrigatória" })
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, {
      message: "Data deve estar no formato DD/MM/AAAA",
    }),
  gender: z.string().min(1, { message: "Gênero é obrigatório" }),
  typeInscriptionId: z
    .string()
    .min(1, { message: "Tipo de inscrição é obrigatório" }),
});

type IndividualInscriptionFormInputs = z.infer<
  typeof individualInscriptionSchema
>;

export function useFormIndividualInscription({
  eventId,
}: UseFormIndividualInscriptionProps): UseFormIndividualInscriptionReturn {
  const router = useRouter();

  // Inicializar o react-hook-form com Zod
  const {
    register,
    handleSubmit: rhfHandleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<IndividualInscriptionFormInputs>({
    resolver: zodResolver(individualInscriptionSchema),
    defaultValues: {
      responsible: "",
      phone: "",
      participantName: "",
      birthDate: "",
      gender: "",
      typeInscriptionId: "",
    },
    mode: "onChange",
  });

  // Observar os valores do formulário
  const formData = watch();

  // Usar React Query para carregar tipos de inscrição
  const {
    data: typeInscriptionsData,
    isLoading: typeInscriptionsLoading,
    error: typeInscriptionsError,
  } = useTypeInscriptionsQuery(eventId);

  // Usar React Query para submeter inscrição
  const submitMutation = useSubmitIndividualInscription();

  // Processar dados dos tipos de inscrição
  const typeInscriptions = typeInscriptionsData
    ? Array.isArray(typeInscriptionsData)
      ? typeInscriptionsData
      : [typeInscriptionsData]
    : [];

  // Mostrar erro se houver
  if (typeInscriptionsError) {
    console.error(
      "Erro ao carregar tipos de inscrição:",
      typeInscriptionsError
    );
    toast.error("Erro ao carregar tipos de inscrição");
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phone") {
      // Formatação automática do telefone
      const formattedPhone = formatPhone(value);
      setValue(name as keyof IndividualInscriptionFormInputs, formattedPhone);
    } else if (name === "birthDate") {
      // Formatação automática da data
      const formattedDate = formatDate(value);
      setValue(name as keyof IndividualInscriptionFormInputs, formattedDate);
    } else {
      setValue(name as keyof IndividualInscriptionFormInputs, value);
    }

    // Validação em tempo real
    trigger(name as keyof IndividualInscriptionFormInputs);
  };

  // Função para formatar telefone
  const formatPhone = (value: string): string => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, "");

    // Aplica a máscara (11) 99999-9999
    if (numbers.length <= 2) {
      return numbers ? `(${numbers}` : "";
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
        7
      )}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
        7,
        11
      )}`;
    }
  };

  // Função para formatar data
  const formatDate = (value: string): string => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, "");

    // Aplica a máscara DD/MM/AAAA
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    } else {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(
        4,
        8
      )}`;
    }
  };

  const onSubmit = async (data: IndividualInscriptionFormInputs) => {
    const apiData: IndividualInscriptionSubmit = {
      responsible: data.responsible,
      phone: data.phone,
      eventId,
      participant: {
        name: data.participantName,
        birthDateStr: data.birthDate,
        gender: data.gender,
        typeDescriptionId: data.typeInscriptionId,
      },
    };

    try {
      const response = await submitMutation.mutateAsync(apiData);

      // Salvar os dados completos no localStorage
      if (response.cacheKey) {
        localStorage.setItem(
          `individual-inscription-${response.cacheKey}`,
          JSON.stringify(response)
        );

        toast.success(
          "Dados processados com sucesso! Verifique as informações antes de confirmar."
        );
        router.push(
          `/user/individual-inscription/confirm/${response.cacheKey}`
        );
      } else {
        toast.success("Inscrição individual realizada com sucesso!");
        router.push("/user/events");
      }
    } catch (error: unknown) {
      console.error("Erro:", error);

      // Type guard para verificar se é um erro com estrutura de resposta
      const isErrorWithResponse = (
        err: unknown
      ): err is {
        response?: { status?: number; data?: { message?: string } };
      } => {
        return typeof err === "object" && err !== null && "response" in err;
      };

      if (
        isErrorWithResponse(error) &&
        error.response?.status === 400 &&
        error.response?.data?.message
      ) {
        toast.error(error.response.data.message);
        return;
      }

      toast.error("Erro ao processar inscrição. Tente novamente.");
    }
  };

  // Wrapper para o handleSubmit do react-hook-form
  const handleFormSubmit = rhfHandleSubmit(onSubmit);

  return {
    // Estado
    formData,
    typeInscriptions,
    isSubmitting: submitMutation.isPending, // Usar estado da mutation
    formErrors: errors, // Exportando os erros do formulário
    typeInscriptionsLoading, // Estado de loading dos tipos de inscrição

    // Ações
    handleInputChange,
    handleSubmit: handleFormSubmit, // Usando o handleSubmit do react-hook-form
    register, // Exportando register para usar nos inputs
  };
}
