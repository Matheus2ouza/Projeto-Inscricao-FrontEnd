// useIndividualInscriptionConfirmation.tsx - COM CONTADOR DE TEMPO
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IndivUploadRouteResponse } from "../types/individualInscriptionTypes";
import { confirmIndividualInscription } from "../api/confirmIndividualInscription";

export const useIndividualInscriptionConfirmation = (cacheKey: string) => {
  const router = useRouter();

  const [confirmationData, setConfirmationData] =
    useState<IndivUploadRouteResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
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
  }, [cacheKey]);

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
  }, [timeRemaining, confirmationData]);

  // Função para quando o tempo expirar
  const handleTimeExpired = () => {
    const decodedCacheKey = decodeURIComponent(cacheKey);

    // Limpar dados do localStorage
    localStorage.removeItem(`individual-inscription-${decodedCacheKey}`);
    localStorage.removeItem(`individual-time-${decodedCacheKey}`);

    toast.error("Tempo esgotado! A inscrição foi cancelada automaticamente.");
    router.push("/user/events");
  };

  // Função para confirmar inscrição
  const handleConfirm = async () => {
    setConfirming(true);
    try {
      // Decodificar o cacheKey para a API
      const decodedCacheKey = decodeURIComponent(cacheKey);
      await confirmIndividualInscription(decodedCacheKey);

      // Limpar dados do localStorage após confirmação
      localStorage.removeItem(`individual-inscription-${decodedCacheKey}`);
      localStorage.removeItem(`individual-time-${decodedCacheKey}`);

      toast.success("Inscrição confirmada com sucesso!");
      router.push("/user/events");
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
    }
  };

  // Função para cancelar/voltar
  const handleCancel = () => {
    // Limpar dados do localStorage ao cancelar
    const decodedCacheKey = decodeURIComponent(cacheKey);
    localStorage.removeItem(`individual-inscription-${decodedCacheKey}`);
    localStorage.removeItem(`individual-time-${decodedCacheKey}`);
    router.back();
  };

  // Converter segundos para minutos
  const minutesRemaining = Math.ceil(timeRemaining / 60);

  return {
    // Estado
    confirmationData,
    loading,
    confirming,
    error,
    timeRemaining: minutesRemaining,

    // Ações
    handleConfirm,
    handleCancel,
  };
};
