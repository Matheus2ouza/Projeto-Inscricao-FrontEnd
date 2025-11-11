"use client";

import { useGlobalLoading } from "@/components/GlobalLoading";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { cancelGroupInscription } from "../api/cancelGroupInscription";
import {
  confirmGroupInscription,
  ConfirmGroupInscriptionResponse,
} from "../api/confirmGroupInscription";
import { GroupInscriptionConfirmationData } from "../types/inscriptionGrupTypes";

interface UseGroupInscriptionConfirmationProps {
  cacheKey: string;
}

const isErrorWithResponse = (
  err: unknown
): err is { response?: { data?: { message?: string } } } => {
  return typeof err === "object" && err !== null && "response" in err;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (isErrorWithResponse(error)) {
    return error.response?.data?.message ?? fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

export function useGroupInscriptionConfirmation({
  cacheKey,
}: UseGroupInscriptionConfirmationProps) {
  const router = useRouter();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const { setLoading } = useGlobalLoading();
  const [timeRemaining, setTimeRemaining] = useState(30); // 30 minutos
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmGroupInscriptionResponse | null>(null);

  // Decodificar o cacheKey da URL
  const decodedCacheKey = decodeURIComponent(cacheKey);

  // Dados do localStorage
  const [confirmationData, setConfirmationData] =
    useState<GroupInscriptionConfirmationData | null>(null);

  const handleTimeExpired = useCallback(async () => {
    try {
      await cancelGroupInscription(decodedCacheKey);
      toast.error(
        "Tempo esgotado! As inscrições foram canceladas automaticamente."
      );
    } catch (error: unknown) {
      console.error("Erro ao cancelar inscrições (tempo expirado):", error);
      const errorMessage = getErrorMessage(
        error,
        "Tempo esgotado. Erro ao cancelar inscrições."
      );
      toast.error(errorMessage);
    } finally {
      localStorage.removeItem(`group-inscription-${decodedCacheKey}`);
      router.replace("/user/inscription-group");
    }
  }, [decodedCacheKey, router]);

  // Timer de 30 minutos com setTimeout único
  useEffect(() => {
    const timeout = setTimeout(
      () => {
        handleTimeExpired();
      },
      30 * 60 * 1000
    ); // 30 minutos em milissegundos

    return () => clearTimeout(timeout);
  }, [handleTimeExpired]);

  // Timer para atualizar o contador visual
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Buscar dados do localStorage
  useEffect(() => {
    const loadConfirmationData = () => {
      try {
        setLoading(true);
        const storedData = localStorage.getItem(
          `group-inscription-${decodedCacheKey}`
        );

        if (storedData) {
          const parsedData: GroupInscriptionConfirmationData =
            JSON.parse(storedData);
          setConfirmationData(parsedData);
        } else {
          // Se não encontrar dados no localStorage, redirecionar
          toast.error("Dados da inscrição não encontrados ou expiraram.");
          router.push("/user/inscription-group");
        }
      } catch (error) {
        console.error("Erro ao carregar dados da inscrição:", error);
        toast.error("Erro ao carregar dados da inscrição.");
        router.push("/user/inscription-group");
      } finally {
        setLoading(false);
      }
    };

    loadConfirmationData();
  }, [decodedCacheKey, router, setLoading]);

  const handleConfirm = async () => {
    setIsConfirming(true);
    setLoading(true);

    try {
      const result = await confirmGroupInscription({
        cacheKey: decodedCacheKey,
      });

      // Salvar o resultado da confirmação
      setConfirmationResult(result);

      // Limpar dados do localStorage após confirmação bem-sucedida
      localStorage.removeItem(`group-inscription-${decodedCacheKey}`);

      toast.success("Inscrições confirmadas com sucesso!");
    } catch (error: unknown) {
      console.error("Erro ao confirmar inscrições:", error);

      const errorMessage = getErrorMessage(
        error,
        "Erro ao confirmar inscrições. Tente novamente."
      );

      toast.error(errorMessage);
    } finally {
      setIsConfirming(false);
      setLoading(false);
    }
  };

  const handlePayment = () => {
    router.replace("/user/MyInscriptions");
  };

  const handleSkipPayment = () => {
    router.push("/user/inscription-group");
  };

  const handleCancel = async () => {
    setIsCancelling(true);
    setLoading(true);

    try {
      await cancelGroupInscription(decodedCacheKey);

      // Limpar dados do localStorage após cancelamento
      localStorage.removeItem(`group-inscription-${decodedCacheKey}`);

      toast.success("Inscrições canceladas com sucesso!");
      router.replace("/user/group-inscription");
    } catch (error: unknown) {
      console.error("Erro ao cancelar inscrições:", error);

      const errorMessage = getErrorMessage(
        error,
        "Erro ao cancelar inscrições. Tente novamente."
      );

      toast.error(errorMessage);
    } finally {
      setIsCancelling(false);
      setLoading(false);
    }
  };

  return {
    confirmationData,
    confirmationResult,
    isConfirming,
    isCancelling,
    timeRemaining,
    handleConfirm,
    handleCancel,
    handlePayment,
    handleSkipPayment,
  };
}
