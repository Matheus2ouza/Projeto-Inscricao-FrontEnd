// components/RegisterFormEvent.tsx
"use client";

import React, {
  useMemo,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

import { Button } from "@/shared/components/ui/button";
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
import { Calendar, Upload, X, MapPin } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { toast } from "sonner";

interface RegisterFormEventProps {
  onSubmitSuccess?: () => void;
}

export default function RegisterFormEvent({
  onSubmitSuccess,
}: RegisterFormEventProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { form, onSubmit, dateRange, setDateRange } = useFormCreateEvent();
  const { regions: fetchedRegions } = useRegions();
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Efeito para capturar os parâmetros da URL quando voltamos da página de localização
  useEffect(() => {
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const address = searchParams.get("address");

    if (lat && lng && address) {
      form.setValue("location", {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        address: address,
      });

      // Limpar os parâmetros da URL para evitar repetição
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);

      toast.success("Localização definida com sucesso");
    }
  }, [searchParams, form]);

  // Remover preview da imagem ao resetar o formulário
  useEffect(() => {
    const subscription = form.watch((values: { image?: File | null }) => {
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
    const { success, id } = await onSubmit(event);
    if (success && id) {
      if (onSubmitSuccess) onSubmitSuccess();
      const url = `${window.location.origin}/events/${id}`;
      toast.success("Evento criado!", {
        description: (
          <div className="space-y-2">
            <div className="text-xs break-all">{url}</div>
            <button
              type="button"
              className="px-2 py-1 text-xs rounded bg-primary text-primary-foreground"
              onClick={() => navigator.clipboard.writeText(url)}
            >
              Copiar URL
            </button>
          </div>
        ) as unknown as string,
        duration: 6000,
      });
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
      form.setValue("image", file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
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
        e.target.value = "";
        return;
      }

      if (!isValidFileSize(file)) {
        showSizeError();
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
    toast.info("Imagem removida", {
      description: "Você pode adicionar uma nova imagem.",
      duration: 3000,
    });
  };

  // Função para navegar para a página de seleção de localização
  const handleSelectLocation = () => {
    const locationValue = form.getValues("location");
    const params = new URLSearchParams();

    if (locationValue?.lat && locationValue?.lng) {
      params.append("lat", locationValue.lat.toString());
      params.append("lng", locationValue.lng.toString());
    }
    if (locationValue?.address) {
      params.append("address", locationValue.address);
    }

    router.push(`/super/events/create/location?${params.toString()}`);
  };

  // Limpar todos os dados ao cancelar
  const handleCancel = () => {
    form.reset({ name: "", regionId: "", image: undefined });
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setDateRange({
      from: undefined,
      to: undefined,
    });
    setIsDragging(false);
  };

  const locationValue = form.watch("location");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Criar Novo Evento
          </h1>
          <p className="text-muted-foreground mt-2">
            Preencha as informações abaixo para criar um novo evento
          </p>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="p-6">
            <FormProvider {...form}>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Seção: Informações Básicas */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-foreground">
                    Informações Básicas
                  </h2>

                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Coluna 1: Nome do Evento e Região */}
                    <div className="space-y-6 xl:col-span-2">
                      {/* Campo: Nome do Evento */}
                      <div className="space-y-3">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base font-medium">
                                Nome do Evento *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="text"
                                  autoComplete="off"
                                  placeholder="Digite o nome do evento"
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                              <p className="text-sm text-muted-foreground mt-1">
                                Escolha um nome claro e descritivo para o seu
                                evento.
                              </p>
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Campo: Região */}
                      <div className="space-y-3">
                        <FormField
                          control={form.control}
                          name="regionId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base font-medium">
                                Região do Evento *
                              </FormLabel>
                              <FormControl>
                                <ComboboxRegion
                                  value={field.value as string}
                                  onChange={field.onChange}
                                  options={regionOptions}
                                />
                              </FormControl>
                              <FormMessage />
                              <p className="text-sm text-muted-foreground mt-1">
                                Selecione a região onde o evento será realizado.
                              </p>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Coluna 2: Upload de Imagem */}
                    <div className="space-y-6">
                      {/* Campo: Upload de Imagem */}
                      <div className="space-y-3">
                        <FormLabel className="text-base font-medium">
                          Imagem de Capa do Evento
                        </FormLabel>
                        <FormField
                          control={form.control}
                          name="image"
                          render={() => (
                            <FormItem>
                              <FormControl>
                                <div className="flex flex-col items-center justify-center w-full">
                                  <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                    accept="image/jpeg, image/png, image/webp"
                                    onChange={handleFileChange}
                                  />

                                  {!previewUrl ? (
                                    <div
                                      className={cn(
                                        "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300",
                                        isDragging
                                          ? "border-primary bg-primary/5"
                                          : "border-border bg-background hover:bg-accent/50"
                                      )}
                                      onClick={handleAreaClick}
                                      onDragOver={handleDragOver}
                                      onDragLeave={handleDragLeave}
                                      onDrop={handleDrop}
                                    >
                                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                        <p className="text-sm text-muted-foreground">
                                          <span className="font-semibold">
                                            Clique para upload
                                          </span>{" "}
                                          ou arraste uma imagem
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                          PNG, JPG, WEBP até 5MB
                                        </p>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="w-full space-y-3">
                                      <div className="relative w-full h-48 rounded-lg overflow-hidden border">
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
                                        variant="outline"
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
                              <p className="text-sm text-muted-foreground mt-1">
                                Formatos recomendados: JPG, PNG ou WebP. Tamanho
                                ideal: 1200x600 pixels.
                              </p>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Seção: Data e Localização */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-foreground">
                    Data e Localização
                  </h2>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Coluna 1: Data */}
                    <div className="space-y-6">
                      {/* Campo: Período do Evento */}
                      <div className="space-y-3">
                        <FormLabel className="text-base font-medium">
                          Período do Evento *
                        </FormLabel>
                        <div className="w-full">
                          <CalendarRanger
                            dateRange={dateRange}
                            onDateRangeChange={setDateRange}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Selecione a data inicial e final do evento. Datas
                          passadas estão desabilitadas.
                        </p>
                      </div>
                    </div>

                    {/* Coluna 2: Configurações */}
                    <div className="space-y-6">
                      {/* Campo: Abrir inscrições imediatamente */}
                      <div className="space-y-3">
                        <FormField
                          control={form.control}
                          name="openImmediately"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Input
                                  type="checkbox"
                                  checked={field.value}
                                  onChange={(e) =>
                                    field.onChange(e.target.checked)
                                  }
                                  className="h-4 w-4 mt-1"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-base font-medium">
                                  Abrir inscrições imediatamente
                                </FormLabel>
                                <p className="text-sm text-muted-foreground">
                                  Se marcado, as inscrições ficarão abertas
                                  assim que o evento for criado.
                                </p>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Campo: Localização */}
                  <div className="space-y-3">
                    <FormLabel className="text-base font-medium">
                      Localização do Evento *
                    </FormLabel>
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="space-y-3">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={handleSelectLocation}
                                className="w-full h-12 border-dashed"
                              >
                                <MapPin className="h-4 w-4 mr-2" />
                                {field.value?.address
                                  ? "Alterar Localização"
                                  : "Selecionar Localização"}
                              </Button>

                              {field.value?.address && (
                                <div className="p-4 border rounded-lg bg-muted/50">
                                  <div className="flex items-start gap-3">
                                    <MapPin className="h-4 w-4 text-primary mt-0.5" />
                                    <div className="flex-1">
                                      <p className="text-sm font-medium text-foreground">
                                        Local selecionado:
                                      </p>
                                      <p className="text-sm text-muted-foreground mt-1">
                                        {field.value.address}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <p className="text-sm text-muted-foreground">
                      Clique no botão acima para abrir o mapa e selecionar a
                      localização exata do evento.
                    </p>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex gap-4 justify-start pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="min-w-24"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="min-w-24">
                    Criar Evento
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
