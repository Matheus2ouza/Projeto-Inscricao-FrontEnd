"use client";

import { useGlobalLoading } from "@/components/GlobalLoading";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { confirmGroupInscription } from "../api/confirmGroupInscription";
import { GroupInscriptionConfirmationData } from "../types/inscriptionGrupTypes";

interface UseGroupInscriptionConfirmationProps {
  cacheKey: string;
}

interface ConfirmGroupResponse {
  inscriptionId: string;
  paymentEnabled: boolean;
}

export function useGroupInscriptionConfirmation({
  cacheKey,
}: UseGroupInscriptionConfirmationProps) {
  const router = useRouter();
  const [isConfirming, setIsConfirming] = useState(false);
  const { setLoading } = useGlobalLoading();
  const [timeRemaining, setTimeRemaining] = useState(30); // 30 minutos
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmGroupResponse | null>(null);

  // Decodificar o cacheKey da URL
  const decodedCacheKey = decodeURIComponent(cacheKey);

  // Dados do localStorage
  const [confirmationData, setConfirmationData] =
    useState<GroupInscriptionConfirmationData | null>(null);

  // Timer de 30 minutos com setTimeout único
  useEffect(() => {
    const timeout = setTimeout(() => {
      // Limpar dados do localStorage ao expirar
      localStorage.removeItem(`group-inscription-${decodedCacheKey}`);
      toast.error("Tempo esgotado! A inscrição foi cancelada.");
      router.push("/user/events");
    }, 30 * 60 * 1000); // 30 minutos em milissegundos

    return () => clearTimeout(timeout);
  }, [router, decodedCacheKey]);

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
          router.push("/user/events");
        }
      } catch (error) {
        console.error("Erro ao carregar dados da inscrição:", error);
        toast.error("Erro ao carregar dados da inscrição.");
        router.push("/user/events");
      } finally {
        setLoading(false);
      }
    };

    loadConfirmationData();
  }, [decodedCacheKey, router]);

  const handleConfirm = async () => {
    setIsConfirming(true);

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

      // Type guard para verificar se é um Error padrão
      const isStandardError = (err: unknown): err is Error => {
        return err instanceof Error;
      };

      let errorMessage = "Erro ao confirmar inscrições. Tente novamente.";

      if (isStandardError(error)) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsConfirming(false);
    }
  };

  const handlePayment = () => {
    console.log(
      "Iniciando processo de pagamento para inscrição:",
      confirmationResult?.inscriptionId
    );
    // TODO: Implementar navegação para tela de pagamento
    toast.info("Funcionalidade de pagamento em desenvolvimento");
  };

  const handleSkipPayment = () => {
    router.push("/user/events");
  };

  const handleCancel = () => {
    // Limpar dados do localStorage ao cancelar
    localStorage.removeItem(`group-inscription-${decodedCacheKey}`);
    router.push("/user/events");
  };

  return {
    confirmationData,
    confirmationResult,
    isConfirming,
    timeRemaining,
    handleConfirm,
    handleCancel,
    handlePayment,
    handleSkipPayment,
  };
}
