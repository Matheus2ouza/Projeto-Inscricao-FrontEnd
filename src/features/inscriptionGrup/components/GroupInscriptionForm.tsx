"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/lib/utils";
import {
  AlertCircle,
  Download,
  Phone,
  Trash2,
  Upload,
  User,
  X,
} from "lucide-react";
import { UseFormInscriptionGrupReturn } from "../types/inscriptionGrupTypes";

interface GroupInscriptionFormProps {
  hookData: UseFormInscriptionGrupReturn;
}

export function GroupInscriptionForm({ hookData }: GroupInscriptionFormProps) {
  const {
    formData,
    file,
    isSubmitting,
    isDragging,
    validationErrors,
    showErrorModal,
    fileInputRef,
    handleInputChange,
    downloadTemplate,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileChange,
    handleRemoveFile,
    handleAreaClick,
    handleSubmit,
    handleCloseErrorModal,
    register,
    formErrors,
  } = hookData;

  return (
    <>
      <Card className="w-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl">Dados do Responsável</CardTitle>
          <CardDescription className="text-base">
            Preencha os dados do responsável pelas inscrições
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Responsável */}
              <div className="space-y-3 md:col-span-2">
                <Label htmlFor="responsible" className="text-base font-medium">
                  <User className="w-4 h-4 inline mr-2" />
                  Nome do Responsável *
                </Label>
                <Input
                  id="responsible"
                  {...register("responsible")}
                  value={formData.responsible}
                  onChange={handleInputChange}
                  placeholder="Digite o nome completo do responsável"
                  required
                  className={cn(
                    "h-12 text-base",
                    formErrors.responsible &&
                      "border-red-500 focus:border-red-500"
                  )}
                />
                {formErrors.responsible && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.responsible.message}
                  </p>
                )}
              </div>

              {/* E-mail */}
              <div className="space-y-3">
                <Label htmlFor="email" className="text-base font-medium">
                  E-mail do Responsável
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  value={formData.email ?? ""}
                  onChange={handleInputChange}
                  placeholder="exemplo@dominio.com"
                  className={cn(
                    "h-12 text-base",
                    formErrors.email && "border-red-500 focus:border-red-500"
                  )}
                />
                <p className="text-[13px] text-muted-foreground">
                  Opcional — usado apenas para atualizações da inscrição.
                </p>
                {formErrors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.email.message}
                  </p>
                )}
              </div>

              {/* Telefone */}
              <div className="space-y-3">
                <Label htmlFor="phone" className="text-base font-medium">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Telefone do Responsável *
                </Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(11) 99999-9999"
                  required
                  className={cn(
                    "h-12 text-base",
                    formErrors.phone && "border-red-500 focus:border-red-500"
                  )}
                />
                {formErrors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.phone.message}
                  </p>
                )}
              </div>

              {/* Template Download */}
              <div className="space-y-3">
                <Label className="text-base font-medium">
                  Template de Inscrição
                </Label>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    onClick={downloadTemplate}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white h-12 px-6"
                  >
                    <Download className="w-5 h-5" />
                    Baixar Planilha
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Baixe o template, preencha com os dados dos inscritos.
                </p>
              </div>
            </div>

            {/* Upload da Planilha Preenchida */}
            <div className="space-y-4 border-t pt-4">
              <div className="space-y-3">
                <Label
                  htmlFor="file"
                  className="text-sm md:text-base font-medium"
                >
                  Planilha Preenchida *
                </Label>

                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                />

                {!file ? (
                  <div
                    className={cn(
                      "flex flex-col items-center justify-center w-full h-32 md:h-40 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300",
                      isDragging
                        ? "border-primary bg-primary/5"
                        : "border-border bg-background hover:bg-accent/50"
                    )}
                    onClick={handleAreaClick}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="flex flex-col items-center justify-center p-4 text-center">
                      <Upload className="h-8 w-8 md:h-10 md:w-10 text-muted-foreground mb-2" />
                      <p className="text-sm md:text-base text-muted-foreground">
                        <span className="font-semibold">
                          Clique para upload
                        </span>{" "}
                        ou arraste a planilha
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        XLSX, XLS até 10MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full space-y-3">
                    <div className="flex items-center justify-between p-4 md:p-6 border-2 rounded-lg bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center">
                            <Upload className="h-5 w-5 md:h-6 md:w-6 text-green-600 dark:text-green-400" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-green-800 dark:text-green-400 truncate text-sm md:text-base">
                            {file.name}
                          </p>
                          <p className="text-xs md:text-sm text-green-600 dark:text-green-300">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveFile}
                        className="flex items-center gap-1 md:gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:hover:bg-red-900/20 ml-2"
                      >
                        <Trash2 className="h-4 w-4 md:h-5 md:w-5" />
                        <span className="hidden sm:inline">Remover</span>
                      </Button>
                    </div>

                    {/* Botão adicional para trocar arquivo */}
                    <div className="flex justify-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAreaClick}
                        className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900/20 px-4 md:px-8"
                      >
                        <Upload className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                        Trocar Arquivo
                      </Button>
                    </div>
                  </div>
                )}

                <p className="text-xs md:text-sm text-gray-500">
                  Faça o upload da planilha preenchida com os dados dos
                  participantes.
                </p>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-14 text-lg font-bold transform uppercase text-white"
              disabled={
                isSubmitting ||
                !file ||
                !!formErrors.responsible ||
                !!formErrors.phone
              }
            >
              {isSubmitting
                ? "Enviando para análise..."
                : "Enviar para Análise"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Modal de Erros de Validação */}
      <Dialog open={showErrorModal} onOpenChange={handleCloseErrorModal}>
        <DialogContent className="max-w-3xl h-[95vh] sm:max-h-[90vh] overflow-hidden rounded-lg sm:rounded-2xl mx-2 sm:mx-0 flex flex-col">
          <DialogHeader className="space-y-3 pb-4 sm:pb-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-amber-100 dark:bg-amber-900/20 rounded-full flex-shrink-0 mt-1">
                <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  Ajustes Necessários na Planilha
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Encontramos alguns pontos que precisam de sua atenção antes de
                  continuar. O arquivo atual será removido automaticamente para
                  que você possa fazer upload da versão corrigida
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 min-h-0 overflow-hidden">
            <div className="space-y-4 sm:space-y-6 py-2 h-full overflow-y-auto custom-scrollbar px-1">
              {/* Resumo dos erros */}
              <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                        Itens para revisar
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Verifique cada ponto abaixo cuidadosamente
                      </p>
                    </div>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-700 self-start sm:self-auto">
                    <span className="text-amber-600 dark:text-amber-400 text-xs sm:text-sm font-medium">
                      {validationErrors.length}{" "}
                      {validationErrors.length === 1 ? "item" : "itens"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Lista de erros */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <div className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0"></div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm uppercase tracking-wide">
                    Detalhes para Correção
                  </h3>
                </div>

                <div className="grid gap-2 sm:gap-3">
                  {validationErrors.map((error, index) => (
                    <div
                      key={index}
                      className="group flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-amber-200 dark:hover:border-amber-600 transition-all duration-200 hover:shadow-sm"
                    >
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center shadow-sm">
                            <span className="text-white text-xs sm:text-sm font-bold">
                              {error.line}
                            </span>
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-white dark:bg-gray-800 rounded-full border border-amber-200 dark:border-amber-700 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-500 rounded-full"></div>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm mb-1">
                              Linha {error.line}
                            </p>
                            <p className="text-amber-700 dark:text-amber-300 text-xs sm:text-sm leading-relaxed break-words">
                              {error.reason}
                            </p>
                          </div>
                          <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-400 rounded-full animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card de instruções */}
              <div className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800/20 dark:to-gray-800/20 border border-slate-200 dark:border-slate-700 rounded-xl p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-slate-100 dark:bg-slate-800/30 rounded-lg flex items-center justify-center mt-0.5">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600 dark:text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm mb-2 sm:mb-3">
                      Próximos passos
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                      <div className="flex items-center gap-2 sm:gap-3 text-slate-700 dark:text-slate-300">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-slate-600 dark:text-slate-400 text-xs font-bold">
                            1
                          </span>
                        </div>
                        <span className="break-words">
                          Baixe o template atualizado
                        </span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 text-slate-700 dark:text-slate-300">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-slate-600 dark:text-slate-400 text-xs font-bold">
                            2
                          </span>
                        </div>
                        <span className="break-words">
                          Revise as linhas indicadas
                        </span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 text-slate-700 dark:text-slate-300">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-slate-600 dark:text-slate-400 text-xs font-bold">
                            3
                          </span>
                        </div>
                        <span className="break-words">
                          Ajuste os dados conforme necessário
                        </span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 text-slate-700 dark:text-slate-300">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-slate-600 dark:text-slate-400 text-xs font-bold">
                            4
                          </span>
                        </div>
                        <span className="break-words">
                          Faça o upload do arquivo corrigido
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-shrink-0 flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 pb-3 sm:pb-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row w-full sm:w-auto justify-center sm:justify-end">
              <Button
                type="button"
                onClick={handleCloseErrorModal}
                className="w-full sm:w-auto bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white shadow-sm px-6 py-3 text-sm sm:text-base"
              >
                <X className="h-4 w-4 mr-2" />
                Entendi, Vou Corrigir
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
