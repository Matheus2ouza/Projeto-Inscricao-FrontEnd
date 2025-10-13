"use client";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { cn } from "@/shared/lib/utils";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  MessageCircle,
  User,
} from "lucide-react";

interface IndividualPaymentConfirmationProps {
  inscriptionId: string;
  paymentEnabled: boolean;
  onPayment: () => void;
  onSkipPayment: () => void;
}

export function IndividualPaymentConfirmation({
  inscriptionId,
  paymentEnabled,
  onPayment,
  onSkipPayment,
}: IndividualPaymentConfirmationProps) {
  const formatInscriptionId = (id: string) => {
    return `${id.slice(0, 8)}...${id.slice(-4)}`;
  };

  const handleContactSupport = () => {
    const phoneNumber = "5591992587483";
    const message = "Olá, preciso de ajuda com minha inscrição individual";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
      {/* Header de sucesso */}
      <Card className="border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-800">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base sm:text-lg text-green-800 dark:text-green-200">
                Inscrição Confirmada com Sucesso!
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-green-700 dark:text-green-300 mt-1">
                Sua inscrição individual foi realizada. ID:{" "}
                <strong className="break-all">
                  {formatInscriptionId(inscriptionId)}
                </strong>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Informações sobre pagamento */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            {paymentEnabled ? (
              <>
                <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                Pagamento Disponível
              </>
            ) : (
              <>
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                Pagamentos em Breve
              </>
            )}
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            {paymentEnabled
              ? "Os pagamentos já estão liberados pela organização"
              : "A organização ainda não liberou os pagamentos para este evento"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          {/* Status do pagamento */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 gap-3 sm:gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div
                className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0",
                  paymentEnabled
                    ? "bg-blue-100 dark:bg-blue-900/20"
                    : "bg-amber-100 dark:bg-amber-900/20"
                )}
              >
                {paymentEnabled ? (
                  <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                ) : (
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 dark:text-amber-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                  Status dos Pagamentos
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {paymentEnabled
                    ? "Liberado pela organização - Você pode pagar agora"
                    : "Aguardando liberação dos organizadores"}
                </p>
              </div>
            </div>
            <Badge
              variant={paymentEnabled ? "default" : "outline"}
              className={cn(
                "w-fit text-xs sm:text-sm",
                paymentEnabled
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800"
              )}
            >
              {paymentEnabled ? "Liberado" : "Em Breve"}
            </Badge>
          </div>

          {/* Informações importantes */}
          <Card
            className={cn(
              "border-2",
              paymentEnabled
                ? "border-blue-200 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-800"
                : "border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-800"
            )}
          >
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0">
                  <div
                    className={cn(
                      "w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center",
                      paymentEnabled
                        ? "bg-blue-100 dark:bg-blue-900/20"
                        : "bg-amber-100 dark:bg-amber-900/20"
                    )}
                  >
                    <AlertCircle
                      className={cn(
                        "h-4 w-4 sm:h-5 sm:w-5",
                        paymentEnabled
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-amber-600 dark:text-amber-400"
                      )}
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4
                    className={cn(
                      "font-semibold mb-2 sm:mb-3 text-sm sm:text-base",
                      paymentEnabled
                        ? "text-blue-800 dark:text-blue-200"
                        : "text-amber-800 dark:text-amber-200"
                    )}
                  >
                    {paymentEnabled
                      ? "Próximos Passos"
                      : "Informações Importantes"}
                  </h4>
                  <ul
                    className={cn(
                      "text-xs sm:text-sm space-y-1 sm:space-y-2",
                      paymentEnabled
                        ? "text-blue-700 dark:text-blue-300"
                        : "text-amber-700 dark:text-amber-300"
                    )}
                  >
                    {paymentEnabled ? (
                      <>
                        <li className="flex items-start gap-2">
                          <span className="mt-1 flex-shrink-0">•</span>
                          <span>
                            Você pode realizar o pagamento agora ou depois
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1 flex-shrink-0">•</span>
                          <span>
                            O pagamento poderá ser feito via pix ou depósito
                            bancário
                          </span>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-start gap-2">
                          <span className="mt-1 flex-shrink-0">•</span>
                          <span>
                            <strong>
                              Os organizadores ainda não liberaram
                            </strong>{" "}
                            os pagamentos para este evento
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1 flex-shrink-0">•</span>
                          <span>
                            Esta é uma decisão da organização, não há pendências
                            do seu lado
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1 flex-shrink-0">•</span>
                          <span>
                            Você será{" "}
                            <strong>notificado automaticamente</strong> quando
                            os pagamentos forem liberados
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1 flex-shrink-0">•</span>
                          <span>
                            Sua inscrição já está{" "}
                            <strong>garantida e reservada</strong>
                          </span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lembrete importante */}
          <div className="flex items-start sm:items-center gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-700">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5 sm:mt-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                {paymentEnabled
                  ? "Lembrete importante"
                  : "Sua inscrição está confirmada"}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                {paymentEnabled
                  ? "Realize o pagamento antes da data limite"
                  : "Aguarde a liberação dos pagamentos pelos organizadores para realizar o pagamento"}
              </p>
            </div>
          </div>

          {/* Card adicional quando pagamento não está liberado */}
          {!paymentEnabled && (
            <Card className="border-gray-200 bg-gray-50 dark:bg-gray-800/30 dark:border-gray-700">
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 text-sm sm:text-base">
                      O que acontece agora?
                    </h4>
                    <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 space-y-1 sm:space-y-2">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Sua vaga está reservada com sucesso</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>
                          Você pode continua normalmente fazendo suas inscrições
                          e quando o pagamento for liberado você sera notificado
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Suporte - ANTES dos botões */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-800">
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 text-sm sm:text-base">
                Precisa de ajuda?
              </h4>
              <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 mb-3">
                Qualquer dúvida entre em contato com nosso suporte via WhatsApp
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <Button
                  onClick={handleContactSupport}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm w-fit"
                >
                  <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  <span className="hidden sm:inline">Falar com Suporte</span>
                  <span className="sm:hidden">Suporte</span>
                </Button>
                <div className="text-xs sm:text-sm text-blue-600 dark:text-blue-400">
                  (91) 99258-7483 - Matheus Furtado
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botões de ação */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        {paymentEnabled ? (
          <>
            <Button
              onClick={onSkipPayment}
              variant="outline"
              className="flex-1 h-12 sm:h-14 text-sm sm:text-base order-2 sm:order-1"
            >
              <span className="hidden sm:inline">Pagar Depois</span>
              <span className="sm:hidden">Depois</span>
            </Button>
            <Button
              onClick={onPayment}
              className="flex-1 h-12 sm:h-14 text-sm sm:text-base bg-blue-600 hover:bg-blue-700 text-white order-1 sm:order-2"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Ir para Pagamento</span>
              <span className="sm:hidden">Pagar</span>
            </Button>
          </>
        ) : (
          <Button
            onClick={onSkipPayment}
            className="flex-1 h-12 sm:h-14 text-sm sm:text-base bg-gray-900 hover:bg-gray-800 text-white"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            OK
          </Button>
        )}
      </div>
    </div>
  );
}
