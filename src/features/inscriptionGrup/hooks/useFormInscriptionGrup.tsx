"use client";

import { useState, useRef, useCallback, RefObject } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { submitGroupInscription } from "../api/submitGroupInscription";
import {
  GroupInscriptionFormData,
  UseFormInscriptionGrupProps,
  UseFormInscriptionGrupReturn,
  ValidationError,
  GroupInscriptionConfirmationData,
} from "../types/inscriptionGrupTypes";
import { toast } from "sonner";

// Schema de validação com Zod
const groupInscriptionSchema = z.object({
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
});

type GroupInscriptionFormInputs = z.infer<typeof groupInscriptionSchema>;

export function useFormInscriptionGrup({
  eventId,
}: UseFormInscriptionGrupProps): UseFormInscriptionGrupReturn {
  const router = useRouter();

  // Inicializar o react-hook-form com Zod
  const {
    register,
    handleSubmit: rhfHandleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<GroupInscriptionFormInputs>({
    resolver: zodResolver(groupInscriptionSchema),
    defaultValues: {
      responsible: "",
      phone: "",
    },
    mode: "onChange",
  });

  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const [showErrorModal, setShowErrorModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Observar os valores do formulário
  const formData = watch();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phone") {
      // Formatação automática do telefone
      const formattedPhone = formatPhone(value);
      setValue(name as keyof GroupInscriptionFormInputs, formattedPhone);
    } else {
      setValue(name as keyof GroupInscriptionFormInputs, value);
    }

    // Validação em tempo real
    trigger(name as keyof GroupInscriptionFormInputs);
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

  const downloadTemplate = () => {
    const fileUrl = "/xlsx/Inscrições Aperfeiçoamento para Serviços.xlsx";
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute(
      "download",
      "Inscrições Aperfeiçoamento para Serviços.xlsx"
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Função para validar o tipo de arquivo
  const isValidFileType = (file: File): boolean => {
    const acceptedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    return (
      acceptedTypes.includes(file.type) ||
      file.name.endsWith(".xlsx") ||
      file.name.endsWith(".xls")
    );
  };

  // Função para mostrar erro de formato
  const showFormatError = () => {
    toast.error("Por favor, selecione um arquivo Excel (.xlsx ou .xls)");
  };

  // Funções para drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];

      if (!isValidFileType(selectedFile)) {
        showFormatError();
        return;
      }

      setFile(selectedFile);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      if (!isValidFileType(selectedFile)) {
        showFormatError();
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setValidationErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAreaClick = () => {
    fileInputRef.current?.click();
  };

  // Função para processar erros de validação
  const processValidationErrors = (errorMessage: string) => {
    try {
      const errorData = JSON.parse(errorMessage);
      if (errorData.errors && Array.isArray(errorData.errors)) {
        setValidationErrors(errorData.errors);
        setShowErrorModal(true);
        return true;
      }
    } catch {
      return false;
    }
    return false;
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setValidationErrors([]);
    handleRemoveFile();
  };

  const onSubmit = async (data: GroupInscriptionFormInputs) => {
    if (!file) {
      toast.warning("Por favor, selecione o arquivo da planilha preenchida");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await submitGroupInscription({
        responsible: data.responsible,
        phone: data.phone,
        eventId,
        file,
      });

      // Salvar os dados completos no localStorage
      if (response.cacheKey) {
        localStorage.setItem(
          `group-inscription-${response.cacheKey}`,
          JSON.stringify(response)
        );

        toast.success(
          "Dados processados com sucesso! Verifique as informações antes de confirmar."
        );
        router.push(`/user/group-inscription/confirm/${response.cacheKey}`);
      } else {
        toast.success("Inscrições em grupo realizadas com sucesso!");
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
        const hasValidationErrors = processValidationErrors(
          error.response.data.message
        );
        if (hasValidationErrors) {
          return;
        }
      }

      toast.error("Erro ao processar inscrições. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Wrapper para o handleSubmit do react-hook-form
  const handleFormSubmit = rhfHandleSubmit(onSubmit);

  return {
    // Estado
    formData,
    file,
    isSubmitting,
    isDragging,
    validationErrors,
    showErrorModal,
    fileInputRef: fileInputRef as RefObject<HTMLInputElement>,
    formErrors: errors, // Exportando os erros do formulário

    // Ações
    handleInputChange,
    downloadTemplate,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileChange,
    handleRemoveFile,
    handleAreaClick,
    handleSubmit: handleFormSubmit, // Usando o handleSubmit do react-hook-form
    handleCloseErrorModal,
    register, // Exportando register para usar nos inputs
  };
}
