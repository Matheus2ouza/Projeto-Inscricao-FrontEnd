"use client";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/lib/utils";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import React, { useEffect, useState } from "react";

export interface DismissibleAlertProps {
  /**
   * ID único do aviso. Usado para identificar no localStorage.
   * Importante: use um ID único para cada aviso diferente.
   */
  id: string;
  /**
   * Título do aviso
   */
  title: string;
  /**
   * Texto/descrição do aviso
   */
  children: React.ReactNode;
  /**
   * Variante do alerta
   * - default: Azul (informativo)
   * - destructive: Vermelho (erro/alerta)
   * - warning: Amarelo (aviso)
   * - success: Verde (sucesso)
   */
  variant?: "default" | "destructive" | "warning" | "success";
  /**
   * Classe CSS adicional para o container
   */
  className?: string;
  /**
   * Ícone personalizado (opcional). Se não fornecido, será usado um ícone padrão baseado na variante.
   */
  icon?: React.ReactNode;
  /**
   * Callback quando o aviso é fechado
   */
  onClose?: () => void;
  /**
   * Se true, o aviso pode ser fechado manualmente (padrão: true)
   */
  dismissible?: boolean;
  /**
   * Se true, o aviso será renderizado como modal centralizado com overlay (padrão: false)
   */
  asModal?: boolean;
}

/**
 * Componente de aviso que pode ser ocultado permanentemente
 * usando a opção "Não mostrar novamente". O estado é salvo no localStorage.
 *
 * @example
 * // Aviso informativo
 * <DismissibleAlert
 *   id="welcome-notice"
 *   title="Bem-vindo!"
 *   variant="default"
 * >
 *   Este é um aviso importante que pode ser ocultado permanentemente.
 * </DismissibleAlert>
 *
 * @example
 * // Aviso de erro
 * <DismissibleAlert
 *   id="error-notice"
 *   title="Atenção!"
 *   variant="destructive"
 * >
 *   Ocorreu um erro ao processar sua solicitação.
 * </DismissibleAlert>
 */
export default function DismissibleAlert({
  id,
  title,
  children,
  variant = "default",
  className,
  icon,
  onClose,
  dismissible = true,
  asModal = false,
}: DismissibleAlertProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storageKey = `dismissible-alert-${id}`;
      const dismissed = localStorage.getItem(storageKey);
      if (!dismissed) {
        setIsVisible(true);
        setOpen(true);
      }
    }
  }, [id]);

  const handleClose = () => {
    if (dontShowAgain && typeof window !== "undefined") {
      const storageKey = `dismissible-alert-${id}`;
      localStorage.setItem(storageKey, "true");
    }
    setIsVisible(false);
    setOpen(false);
    onClose?.();
  };

  if (!isVisible) return null;

  // Ícone padrão baseado na variante
  const defaultIcon =
    icon ||
    (variant === "destructive" ? (
      <AlertCircle className="h-5 w-5" />
    ) : variant === "warning" ? (
      <AlertCircle className="h-5 w-5" />
    ) : variant === "success" ? (
      <CheckCircle2 className="h-5 w-5" />
    ) : (
      <Info className="h-5 w-5" />
    ));

  // Classes de estilo baseadas na variante
  const variantStyles = {
    default:
      "border-l-blue-500 bg-blue-50 dark:border-l-blue-400 dark:bg-blue-950",
    destructive:
      "border-l-red-500 bg-red-50 dark:border-l-red-400 dark:bg-red-950",
    warning:
      "border-l-yellow-500 bg-yellow-50 dark:border-l-yellow-400 dark:bg-yellow-900",
    success:
      "border-l-green-500 bg-green-50 dark:border-l-green-400 dark:bg-green-950",
  };

  const iconColor = {
    default: "text-blue-600 dark:text-blue-400",
    destructive: "text-red-600 dark:text-red-400",
    warning: "text-amber-600 dark:text-amber-400",
    success: "text-green-600 dark:text-green-400",
  };

  const textColor = {
    default: "text-blue-900 dark:text-blue-100",
    destructive: "text-red-900 dark:text-red-100",
    warning: "text-amber-900 dark:text-amber-100",
    success: "text-green-900 dark:text-green-100",
  };

  const descriptionColor = {
    default: "text-blue-700 dark:text-blue-200",
    destructive: "text-red-700 dark:text-red-200",
    warning: "text-amber-700 dark:text-amber-200",
    success: "text-green-700 dark:text-green-200",
  };

  // Conteúdo do aviso para modal
  const modalAlertContent = (
    <>
      <div className="flex items-start gap-3">
        <div className={cn("flex-shrink-0 mt-0.5", iconColor[variant])}>
          {defaultIcon}
        </div>
        <div className="flex-1 min-w-0">
          <div className={cn("font-semibold mb-2 text-lg", textColor[variant])}>
            {title}
          </div>
          <div
            className={cn(
              "mb-4 text-sm leading-relaxed",
              descriptionColor[variant]
            )}
          >
            {children}
          </div>
          {dismissible && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4">
              <Label
                htmlFor={`dont-show-modal-${id}`}
                className="flex items-center gap-2 text-sm cursor-pointer transition-colors hover:opacity-80"
              >
                <input
                  id={`dont-show-modal-${id}`}
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  tabIndex={-1}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:focus:ring-blue-400 cursor-pointer"
                />
                <span>Não mostrar novamente</span>
              </Label>
              <Button
                onClick={handleClose}
                className="flex-shrink-0 w-full sm:w-auto text-white"
                variant={variant === "destructive" ? "destructive" : "default"}
              >
                Entendi
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );

  // Renderizar como modal
  if (asModal) {
    const handleDialogClose = (newOpen: boolean) => {
      if (!newOpen) {
        handleClose();
      }
    };

    return (
      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogContent
          className={cn(
            "sm:max-w-md",
            variantStyles[variant],
            "border-l-4",
            className
          )}
          showCloseButton={false}
          onOpenAutoFocus={(e) => {
            // Prevenir autofocus em qualquer elemento
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle className={cn("sr-only", textColor[variant])}>
              {title}
            </DialogTitle>
          </DialogHeader>
          {modalAlertContent}
        </DialogContent>
      </Dialog>
    );
  }

  // Renderizar inline
  return (
    <Alert
      variant={variant === "destructive" ? "destructive" : "default"}
      className={cn(
        "relative border-l-4 shadow-sm dark:shadow-none",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3 sm:gap-4">
          <div className={cn("flex-shrink-0 mt-0.5", iconColor[variant])}>
            {defaultIcon}
          </div>
          <div className="flex-1 min-w-0">
            <AlertTitle
              className={cn("font-semibold mb-1", textColor[variant])}
            >
              {title}
            </AlertTitle>
            <AlertDescription
              className={cn("mb-3 text-sm", descriptionColor[variant])}
            >
              {children}
            </AlertDescription>
            {dismissible && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 pt-3">
                <Label
                  htmlFor={`dont-show-${id}`}
                  className="flex items-center gap-2 text-sm cursor-pointer transition-colors hover:opacity-80"
                >
                  <input
                    id={`dont-show-${id}`}
                    type="checkbox"
                    checked={dontShowAgain}
                    onChange={(e) => setDontShowAgain(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:focus:ring-blue-400 cursor-pointer"
                  />
                  <span>Não mostrar novamente</span>
                </Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClose}
                  className="w-full sm:w-auto"
                >
                  Fechar
                </Button>
              </div>
            )}
          </div>
        </div>
        {dismissible && (
          <button
            onClick={handleClose}
            className="self-start rounded-md p-1 transition-colors opacity-70 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Fechar aviso"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </Alert>
  );
}

/**
 * Função helper para resetar um aviso (útil para testes ou reset manual)
 * @param id - ID do aviso a ser resetado
 */
export function resetDismissibleAlert(id: string) {
  if (typeof window !== "undefined") {
    const storageKey = `dismissible-alert-${id}`;
    localStorage.removeItem(storageKey);
  }
}
