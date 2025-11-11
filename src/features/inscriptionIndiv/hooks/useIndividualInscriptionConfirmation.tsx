"use client";

import { useGlobalLoading } from "@/components/GlobalLoading";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { cancelIndividualInscription } from "../api/cancelIndividualInscription";
import {
  confirmIndividualInscription,
  ConfirmIndividualInscriptionResponse,
} from "../api/confirmIndividualInscription";
import { IndivUploadRouteResponse } from "../types/individualInscriptionTypes";

export const useIndividualInscriptionConfirmation = (cacheKey: string) => {
  const router = useRouter();

  const [confirmationData, setConfirmationData] =
    useState<IndivUploadRouteResponse | null>(null);
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmIndividualInscriptionResponse | null>(null);
  const { setLoading } = useGlobalLoading();
  const [confirming, setConfirming] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(30 * 60); // 30 minutos em segundos

  // Carregar dados do localStorage
  useEffect(() => {
    const loadConfirmationData = () => {
      try {
        // Decodificar o cacheKey da URL
        const decodedCacheKey = decodeURIComponent(cacheKey);
        console.log("CacheKey decodificado:", decodedCacheKey);

        const storageKey = `individual-inscription-${decodedCacheKey}`;
        console.log("Buscando no localStorage com chave:", storageKey);

        const storedData = localStorage.getItem(storageKey);
        console.log("Dados encontrados no localStorage:", storedData);

        if (!storedData) {
          console.error(
            "Nenhum dado encontrado no localStorage para a chave:",
            storageKey
          );
          setError(
            "Dados da inscrição não encontrados. Por favor, preencha o formulário novamente."
          );
          return;
        }

        const parsedData: IndivUploadRouteResponse = JSON.parse(storedData);
        console.log("Dados parseados:", parsedData);
        setConfirmationData(parsedData);

        // Iniciar contador de tempo quando os dados são carregados
        const savedTime = localStorage.getItem(
          `individual-time-${decodedCacheKey}`
        );
        if (savedTime) {
          const savedTimestamp = parseInt(savedTime);
          const currentTime = Date.now();
          const elapsedSeconds = Math.floor(
            (currentTime - savedTimestamp) / 1000
          );
          const remaining = Math.max(0, 30 * 60 - elapsedSeconds);
          setTimeRemaining(remaining);
        } else {
          // Salvar timestamp atual se não existir
          localStorage.setItem(
            `individual-time-${decodedCacheKey}`,
            Date.now().toString()
          );
        }
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError("Erro ao carregar dados da inscrição");
      } finally {
        setLoading(false);
      }
    };

    loadConfirmationData();
  }, [cacheKey, setLoading]);

  // Função para quando o tempo expirar
  const handleTimeExpired = useCallback(async () => {
    const decodedCacheKey = decodeURIComponent(cacheKey);

    try {
      // Chamar API para cancelar a inscrição
      await cancelIndividualInscription(decodedCacheKey);

      // Limpar dados do localStorage
      localStorage.removeItem(`individual-inscription-${decodedCacheKey}`);
      localStorage.removeItem(`individual-time-${decodedCacheKey}`);

      toast.error("Tempo esgotado! A inscrição foi cancelada automaticamente.");
      router.replace("/user/events");
    } catch (error: unknown) {
      console.error("Erro ao cancelar inscrição (tempo expirado):", error);

      // Limpar dados do localStorage mesmo em caso de erro
      localStorage.removeItem(`individual-inscription-${decodedCacheKey}`);
      localStorage.removeItem(`individual-time-${decodedCacheKey}`);

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

      let errorMessage = "Tempo esgotado. Erro ao cancelar inscrição.";

      if (isErrorWithResponse(error)) {
        errorMessage =
          error.response?.data?.message ||
          "Tempo esgotado. Erro ao cancelar inscrição.";
      } else if (isStandardError(error)) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      router.replace("/user/events");
    }
  }, [cacheKey, router]);

  // Contador de tempo
  useEffect(() => {
    if (timeRemaining <= 0 || !confirmationData) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, confirmationData, handleTimeExpired]);

  // Função para confirmar inscrição
  const handleConfirm = async () => {
    setConfirming(true);
    setLoading(true);
    try {
      // Decodificar o cacheKey para a API
      const decodedCacheKey = decodeURIComponent(cacheKey);
      const result = await confirmIndividualInscription(decodedCacheKey);

      // Salvar o resultado da confirmação
      setConfirmationResult(result);

      // Limpar dados do localStorage após confirmação bem-sucedida
      localStorage.removeItem(`individual-inscription-${decodedCacheKey}`);
      localStorage.removeItem(`individual-time-${decodedCacheKey}`);

      toast.success("Inscrição confirmada com sucesso!");
    } catch (error: unknown) {
      console.error("Erro ao confirmar inscrição:", error);

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

      let errorMessage = "Erro ao confirmar inscrição. Tente novamente.";

      if (isErrorWithResponse(error)) {
        errorMessage =
          error.response?.data?.message ||
          "Erro ao confirmar inscrição. Tente novamente.";
      } else if (isStandardError(error)) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      throw error;
    } finally {
      setConfirming(false);
      setLoading(false);
    }
  };

  // Função para cancelar/voltar
  const handleCancel = async () => {
    setCancelling(true);
    setLoading(true);
    try {
      // Decodificar o cacheKey para a API
      const decodedCacheKey = decodeURIComponent(cacheKey);

      // Chamar API para cancelar a inscrição
      await cancelIndividualInscription(decodedCacheKey);

      // Limpar dados do localStorage após cancelamento bem-sucedido
      localStorage.removeItem(`individual-inscription-${decodedCacheKey}`);
      localStorage.removeItem(`individual-time-${decodedCacheKey}`);

      toast.success("Inscrição cancelada com sucesso!");
      router.replace("/user/individual-inscription");
    } catch (error: unknown) {
      console.error("Erro ao cancelar inscrição:", error);

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

      let errorMessage = "Erro ao cancelar inscrição. Tente novamente.";

      if (isErrorWithResponse(error)) {
        errorMessage =
          error.response?.data?.message ||
          "Erro ao cancelar inscrição. Tente novamente.";
      } else if (isStandardError(error)) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setCancelling(false);
      setLoading(false);
    }
  };

  // Função para pagamento
  const handlePayment = () => {
    router.replace("/user/MyInscriptions");
  };

  // Função para pular pagamento
  const handleSkipPayment = () => {
    router.replace("/user/individual-inscription");
  };

  // Converter segundos para minutos
  const minutesRemaining = Math.ceil(timeRemaining / 60);

  return {
    // Estado
    confirmationData,
    confirmationResult,
    confirming,
    cancelling,
    error,
    timeRemaining: minutesRemaining,

    // Ações
    handleConfirm,
    handleCancel,
    handlePayment,
    handleSkipPayment,
  };
};
