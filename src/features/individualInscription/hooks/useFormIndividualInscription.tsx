// useFormIndividualInscription.tsx - COM PROTEÇÃO CONTRA DUPLICATA
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  IndividualInscriptionData,
  TypeInscription,
  IndividualInscriptionSubmit,
  IndivUploadRouteResponse,
} from "../types/individualInscriptionTypes";
import { getTypeInscriptions } from "../api/getTypeInscriptions";
import { submitIndividualInscription } from "../api/submitIndividualInscription";
import {
  individualInscriptionSchema,
  IndividualInscriptionFormData,
} from "../schemas/individualInscriptionSchema";

export const useFormIndividualInscription = (eventId: string) => {
  const router = useRouter();

  const {
    register,
    handleSubmit: reactHookFormHandleSubmit,
    setValue,
    watch,
    formState: { errors },
    trigger,
  } = useForm<IndividualInscriptionFormData>({
    resolver: zodResolver(individualInscriptionSchema),
    defaultValues: {
      eventId,
      typeInscriptionId: "",
      responsibleData: {
        fullName: "",
        phone: "",
      },
      personalData: {
        fullName: "",
        birthDate: "",
        gender: "",
      },
    },
    mode: "onChange",
  });

  const [typeInscriptions, setTypeInscriptions] = useState<TypeInscription[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [lastSubmission, setLastSubmission] = useState<number>(0);

  // Watch form values
  const formData = watch();

  // Carregar tipos de inscrição
  useEffect(() => {
    const loadTypeInscriptions = async () => {
      try {
        const data = await getTypeInscriptions(eventId);
        const inscriptionsArray = Array.isArray(data) ? data : [data];
        setTypeInscriptions(inscriptionsArray);
      } catch (error) {
        console.error("Erro ao carregar tipos de inscrição:", error);
        setTypeInscriptions([]);
        toast.error("Erro ao carregar tipos de inscrição");
      } finally {
        setLoading(false);
      }
    };

    loadTypeInscriptions();
  }, [eventId]);

  // Funções para atualizar os valores do formulário
  const updateResponsibleData = (
    field: keyof IndividualInscriptionData["responsibleData"],
    value: string
  ) => {
    setValue(`responsibleData.${field}`, value, { shouldValidate: true });
  };

  const updatePersonalData = (
    field: keyof IndividualInscriptionData["personalData"],
    value: string
  ) => {
    setValue(`personalData.${field}`, value, { shouldValidate: true });
  };

  const setTypeInscriptionId = (id: string) => {
    setValue("typeInscriptionId", id, { shouldValidate: true });
  };

  // Função para formatar telefone
  const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, "");

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
    const numbers = value.replace(/\D/g, "");

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

  // Handler para mudança de telefone com formatação
  const handlePhoneChange = (value: string) => {
    const formattedPhone = formatPhone(value);
    updateResponsibleData("phone", formattedPhone);
  };

  // Handler para mudança de data com formatação
  const handleDateChange = (value: string) => {
    const formattedDate = formatDate(value);
    updatePersonalData("birthDate", formattedDate);
  };

  // Converter dados para formato da API
  const convertToApiFormat = (
    data: IndividualInscriptionFormData
  ): IndividualInscriptionSubmit => {
    return {
      responsible: data.responsibleData.fullName.trim(),
      phone: data.responsibleData.phone,
      eventId: data.eventId,
      participant: {
        name: data.personalData.fullName.trim(),
        birthDateStr: data.personalData.birthDate,
        gender: data.personalData.gender,
        typeDescriptionId: data.typeInscriptionId,
      },
    };
  };

  // Submissão principal do formulário - COM PROTEÇÃO CONTRA DUPLICATAS
  const handleFormSubmit = async (data: IndividualInscriptionFormData) => {
    // Proteção contra submissões rápidas (debounce de 2 segundos)
    const now = Date.now();
    if (now - lastSubmission < 2000) {
      toast.warning("Aguarde um momento antes de enviar novamente");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    setLastSubmission(now);

    try {
      const apiData = convertToApiFormat(data);
      const response: IndivUploadRouteResponse =
        await submitIndividualInscription(apiData);

      if (response?.cacheKey) {
        console.log("Resposta do individual:", response);

        // SALVAR NO LOCALSTORAGE para usar na confirmação
        localStorage.setItem(
          `individual-inscription-${response.cacheKey}`,
          JSON.stringify(response)
        );

        toast.success(
          "Dados enviados com sucesso! Verifique as informações antes de confirmar."
        );

        // Codificar o cacheKey para URL
        const encodedCacheKey = encodeURIComponent(response.cacheKey);
        router.push(`/user/individual-inscription/confirm/${encodedCacheKey}`);
      } else {
        throw new Error("Resposta da API inválida: cacheKey não encontrado");
      }

      return response;
    } catch (error: unknown) {
      console.error("Erro na inscrição:", error);

      // Type guard para verificar se é um erro com estrutura de resposta
      const isErrorWithResponse = (
        err: unknown
      ): err is { response?: { data?: { message?: string } } } => {
        return typeof err === "object" && err !== null && "response" in err;
      };

      // Type guard para verificar se é um Error padrão
      const isStandardError = (err: unknown): err is Error => {
        return err instanceof Error;
      };

      let errorMessage = "Erro ao processar inscrição. Tente novamente.";

      if (isErrorWithResponse(error)) {
        errorMessage =
          error.response?.data?.message ||
          "Erro ao processar inscrição. Tente novamente.";
      } else if (isStandardError(error)) {
        errorMessage = error.message;
      }

      setSubmitError(errorMessage);

      // Mostrar mensagem mais específica para erro de duplicata
      if (
        errorMessage.includes("Unique constraint") ||
        errorMessage.includes("cacheKey") ||
        errorMessage.includes("duplicat") ||
        errorMessage.includes("já existe")
      ) {
        toast.error(
          "Inscrição já processada. Verifique sua confirmação ou aguarde alguns instantes."
        );
      } else {
        toast.error(errorMessage);
      }

      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  // Handler para submit do formulário
  const onSubmit = reactHookFormHandleSubmit(handleFormSubmit);

  return {
    // Estado
    formData,
    typeInscriptions,
    loading,
    submitting,
    submitError,
    errors,

    // Ações do formulário
    register,
    onSubmit,
    updateResponsibleData,
    updatePersonalData,
    setTypeInscriptionId,

    // Handlers de campos
    handlePhoneChange,
    handleDateChange,

    // Utilitários
    formatPhone,
    formatDate,
    trigger,
  };
};
