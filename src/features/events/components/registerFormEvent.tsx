// components/RegisterFormEvent.tsx
"use client";

import React, {
  useMemo,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import Image from "next/image";

import { Button } from "@/shared/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/shared/components/ui/dialog";
import { DialogClose, DialogTitle } from "@radix-ui/react-dialog";
import { FormProvider } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import useFormCreateEvent from "../hooks/useFormCreateEvent";
import { CalendarRanger } from "@/shared/components/calendar-ranger";
import { useRegions } from "@/features/regions/hooks/useRegions";
import { ComboboxRegion } from "@/features/regions/components/ComboboxRegion";
import { Calendar, Upload, X } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { toast } from "sonner";

interface RegisterFormEventProps {
  onSubmitSuccess: () => void;
}

export default function RegisterFormEvent({
  onSubmitSuccess,
}: RegisterFormEventProps) {
  const { form, onSubmit, dateRange, setDateRange } = useFormCreateEvent();
  const { regions: fetchedRegions } = useRegions();
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Remover preview da imagem ao resetar o formulário
  React.useEffect(() => {
    const subscription = form.watch((values: { image?: File | null }) => {
      if (!values.image && previewUrl) {
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    });
    return () => subscription.unsubscribe();
  }, [form, previewUrl]);

  // Remover preview da imagem ao resetar o formulário
  useEffect(() => {
    // Se o campo image do formulário estiver vazio, remove o preview
    const subscription = form.watch((values) => {
      if (!values.image && previewUrl) {
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    });
    return () => subscription.unsubscribe();
  }, [form, previewUrl]);

  const regionOptions = useMemo(() => {
    return fetchedRegions.map((r) => ({
      label: r.name.toUpperCase(),
      value: r.id,
    }));
  }, [fetchedRegions]);

  const handleSubmit = async (event: React.FormEvent) => {
    const success = await onSubmit(event);
    if (success) {
      onSubmitSuccess();
    }
  };

  // Função para validar o tipo de arquivo
  const isValidImageType = (file: File): boolean => {
    const acceptedTypes = ["image/jpeg", "image/png", "image/webp"];
    return acceptedTypes.includes(file.type);
  };

  // Função para validar o tamanho do arquivo (5MB)
  const isValidFileSize = (file: File): boolean => {
    const maxSize = 5 * 1024 * 1024; // 5MB em bytes
    return file.size <= maxSize;
  };

  // Função para mostrar erro de formato
  const showFormatError = () => {
    toast.error("Formato não suportado", {
      description:
        "Por favor, selecione uma imagem nos formatos JPG, PNG ou WebP.",
      duration: 5000,
    });
  };

  // Função para mostrar erro de tamanho
  const showSizeError = () => {
    toast.error("Arquivo muito grande", {
      description: "A imagem deve ter no máximo 5MB.",
      duration: 5000,
    });
  };

  // Função para lidar com o drag over
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  // Função para lidar com a seleção de arquivo
  const handleFileSelect = useCallback(
    (file: File) => {
      // Atualizar o formulário
      form.setValue("image", file);

      // Criar preview
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Mostrar toast de sucesso
      toast.success("Imagem carregada com sucesso", {
        description: `Arquivo: ${file.name}`,
        duration: 3000,
      });
    },
    [form]
  );

  // Função para lidar com o drag leave
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  // Função para lidar com o drop
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        const file = files[0];

        if (!isValidImageType(file)) {
          showFormatError();
          return;
        }

        if (!isValidFileSize(file)) {
          showSizeError();
          return;
        }

        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  // Função para lidar com o clique na área de upload
  const handleAreaClick = () => {
    fileInputRef.current?.click();
  };

  // Função para lidar com a mudança no input de arquivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!isValidImageType(file)) {
        showFormatError();
        // Limpar o input
        e.target.value = "";
        return;
      }

      if (!isValidFileSize(file)) {
        showSizeError();
        // Limpar o input
        e.target.value = "";
        return;
      }

      handleFileSelect(file);
    }
  };

  // Função para remover a imagem
  const handleRemoveImage = () => {
    form.setValue("image", undefined);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Mostrar toast informativo
    toast.info("Imagem removida", {
      description: "Você pode adicionar uma nova imagem.",
      duration: 3000,
    });
  };

  return (
    <DialogContent className="min-w-2xl max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-primary font-bold text-xl">
          Criar Novo Evento
        </DialogTitle>
      </DialogHeader>

      <FormProvider {...form}>
        <form onSubmit={handleSubmit} className="space-y-6 mt-2">
          {/* Campo: Nome do Evento */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <i className="bi bi-calendar-event text-indigo-500 dark:text-blue-500"></i>
                Nome do Evento
              </FormLabel>
            </div>
            <p className="text-xs text-muted-foreground -mt-2">
              Escolha um nome claro e descritivo para o seu evento. Este será o
              título principal que os participantes verão.
            </p>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      autoComplete="off"
                      className="w-full rounded-xl border-gray-300 bg-white/50 dark:bg-gray-800/50 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-60 focus:shadow-md dark:border-gray-600 dark:text-white backdrop-blur-sm transition-all duration-300 pl-4 pr-4 py-3"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Campo: Upload de Imagem */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <i className="bi bi-image text-indigo-500 dark:text-blue-500"></i>
                Imagem de Capa do Evento
              </FormLabel>
            </div>
            <p className="text-xs text-muted-foreground -mt-2">
              Adicione uma imagem para representar seu evento. Ela será usada
              como capa. Formatos recomendados: JPG, PNG ou WebP. Tamanho ideal:
              1200x600 pixels.
            </p>

            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <FormControl>
                    <div className="flex flex-col items-center justify-center w-full">
                      {/* Input de arquivo escondido */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept="image/jpeg, image/png, image/webp"
                        onChange={handleFileChange}
                      />

                      {/* Área de Drag & Drop */}
                      {!previewUrl ? (
                        <div
                          className={cn(
                            "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300",
                            isDragging
                              ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                              : "border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                          )}
                          onClick={handleAreaClick}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="h-8 w-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">
                                Clique para upload
                              </span>{" "}
                              ou arraste uma imagem
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              PNG, JPG, WEBP até 5MB
                            </p>
                          </div>
                        </div>
                      ) : (
                        // Preview da imagem com botão de remover
                        <div className="w-full space-y-3">
                          <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                            <Image
                              src={previewUrl}
                              alt="Preview"
                              fill
                              className="object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-xs">
                              Imagem selecionada
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="w-full"
                            onClick={handleRemoveImage}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Remover Imagem
                          </Button>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Campo: Período do Evento */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-500 dark:text-blue-500" />
                Período do Evento
              </FormLabel>
            </div>
            <p className="text-xs text-muted-foreground -mt-2">
              Selecione as datas de início e término do seu evento usando o
              calendário. Você pode selecionar um período de vários dias para
              eventos que duram mais de um dia.
            </p>
            <div className="w-full">
              <CalendarRanger
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
              />
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Selecione a data inicial e final do evento. Datas passadas estão
              desabilitadas.
            </div>
          </div>

          {/* Campo: Região */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <i className="bi bi-geo-alt text-indigo-500 dark:text-blue-500"></i>
                Região do Evento
              </FormLabel>
            </div>
            <p className="text-xs text-muted-foreground -mt-2">
              Selecione a região onde o evento será realizado. Isso ajuda na
              organização e filtragem dos eventos por localidade.
            </p>
            <FormField
              control={form.control}
              name="regionId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ComboboxRegion
                      value={field.value as string}
                      onChange={field.onChange}
                      options={regionOptions}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/80"
            >
              Criar
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </FormProvider>
    </DialogContent>
  );
}
