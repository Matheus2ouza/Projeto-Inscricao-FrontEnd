"use client";

import TypeInscriptionDialog from "@/features/typeInscription/components/TypeInscriptionDialog";
import { useTypeInscriptions } from "@/features/typeInscription/hook/useTypeInscriptions";
import { TypeInscriptions } from "@/features/typeInscription/types/typesInscriptionsTypes";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Edit3,
  Eye,
  EyeClosed,
  MapPin,
  Plus,
  Save,
  Tag,
  Trash2,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useFormEditEvent } from "../hooks/useFormEditEvent";
import { Event } from "../types/eventTypes";

interface EventManagementProps {
  event: Event;
  refetch: () => void;
}

export default function EventManagement({
  event,
  refetch,
}: EventManagementProps) {
  const [showAmount, setShowAmount] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentType, setCurrentType] = useState<TypeInscriptions | null>(null);

  const {
    isEditing,
    setIsEditing,
    loading,
    formData,
    handleInputChange,
    handleSave,
    handleDelete,
    handleCancel,
    handleUpdatePayment,
    handleUpdateInscription,
  } = useFormEditEvent(event);

  const {
    loading: typeInscriptionLoading,
    create,
    update,
    remove,
  } = useTypeInscriptions(event.id);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getEventStatus = () => {
    const today = new Date();
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);

    if (today < start) return { label: "Agendado", color: "bg-green-600" };
    if (today > end) return { label: "Realizado", color: "bg-red-600" };
    return { label: "Em Andamento", color: "bg-blue-600" };
  };

  const statusBadge = getEventStatus();
  const totalRevenue = event.amountCollected;
  const hasTypeInscriptions = event.typesInscriptions.length > 0;

  // Funções para gerenciar tipos de inscrição
  const handleCreateType = () => {
    setCurrentType(null);
    setDialogOpen(true);
  };

  const handleEditType = (type: TypeInscriptions) => {
    setCurrentType(type);
    setDialogOpen(true);
  };

  const handleDeleteType = async (type: TypeInscriptions) => {
    if (
      confirm(`Tem certeza que deseja excluir o tipo "${type.description}"?`)
    ) {
      try {
        await remove(type.id);
        refetch(); // Recarrega os dados do evento
      } catch (error) {
        // Erro já tratado no hook
      }
    }
  };

  const handleSubmitType = async (data: {
    description: string;
    value: number;
  }) => {
    try {
      if (currentType) {
        // Edição
        await update(currentType.id, data);
      } else {
        // Criação
        await create({ ...data, eventId: event.id });
      }
      refetch(); // Recarrega os dados do evento
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/super/events">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Gerenciar Evento
              </h1>
              <p className="text-muted-foreground mt-1">
                Edite e visualize os detalhes do evento
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isEditing ? (
              <>
                <Button
                  variant={event.status === "OPEN" ? "destructive" : "outline"}
                  onClick={() =>
                    handleUpdateInscription(
                      event.status === "OPEN" ? "CLOSE" : "OPEN"
                    )
                  }
                  className="flex items-center gap-2"
                  disabled={loading}
                >
                  {event.status === "OPEN"
                    ? "Fechar Inscrições"
                    : "Abrir Inscrições"}
                </Button>
                <Button
                  variant={event.paymentEneble ? "destructive" : "outline"}
                  onClick={() => handleUpdatePayment(!event.paymentEneble)}
                  className="flex items-center gap-2"
                  disabled={loading}
                >
                  {event.paymentEneble
                    ? "Fechar Pagamentos"
                    : "Abrir Pagamentos"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2"
                  disabled={loading}
                >
                  <Edit3 className="h-4 w-4" />
                  Editar Evento
                </Button>
                <Button
                  variant="destructive"
                  className="flex items-center gap-2"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  <Trash2 className="h-4 w-4" />
                  Excluir
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex items-center gap-2"
                  disabled={loading}
                >
                  <Save className="h-4 w-4" />
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card de Informações Básicas */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Informações Básicas
                </h2>
                <Badge className={statusBadge.color + " text-white"}>
                  {statusBadge.label}
                </Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nome do Evento
                  </label>
                  {isEditing ? (
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Nome do evento"
                    />
                  ) : (
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {event.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descrição
                  </label>
                  {isEditing ? (
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Descrição do evento"
                      rows={4}
                    />
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400">
                      {event.description || "Nenhuma descrição fornecida"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Card de Datas e Horários */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Datas e Horários
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Data de Início
                  </label>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                      />
                      <Input
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleInputChange}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(event.startDate)}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Data de Término
                  </label>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                      />
                      <Input
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleInputChange}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(event.endDate)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Card de Localização */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Localização
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Endereço
                </label>
                {isEditing ? (
                  <Input
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Endereço do evento"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location || "Local não definido"}</span>
                  </div>
                )}
              </div>

              {/* Mapa será implementado posteriormente */}
              <div className="mt-4 h-48 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">
                  Mapa será implementado aqui
                </p>
              </div>
            </div>

            {/* Card de Tipos de Inscrição */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Tipos de Inscrição
                </h2>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {event.typesInscriptions.length} tipos
                </Badge>
              </div>

              {!hasTypeInscriptions ? (
                <div className="text-center py-8">
                  <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Nenhum tipo de inscrição configurado
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Adicione tipos de inscrição para permitir que participantes
                    se inscrevam no evento.
                  </p>
                  <Button
                    className="flex items-center gap-2"
                    onClick={handleCreateType}
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar Primeiro Tipo
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {event.typesInscriptions.map((type) => (
                    <div
                      key={type.id}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {type.description}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatCurrency(type.value)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditType(type)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteType(type)}
                        >
                          Excluir
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full flex items-center gap-2"
                    onClick={handleCreateType}
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar Novo Tipo
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Card de Estatísticas */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Estatísticas
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium">Participantes</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {event.quantityParticipants}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium">Arrecadado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                      {showAmount ? "****" : formatCurrency(totalRevenue)}
                    </span>
                    <button
                      onClick={() => setShowAmount(!showAmount)}
                      className="focus:outline-none"
                    >
                      {showAmount ? (
                        <EyeClosed className="h-4 w-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-green-600 dark:text-green-400" />
                      )}
                    </button>
                  </div>
                </div>

                {event.maxParticipants && (
                  <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm font-medium">Vagas Totais</span>
                    </div>
                    <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      {event.maxParticipants}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Card de Configurações */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Configurações
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preço do Ingresso
                  </label>
                  {isEditing ? (
                    <Input
                      type="number"
                      name="ticketPrice"
                      value={formData.ticketPrice}
                      onChange={handleInputChange}
                      placeholder="0,00"
                      step="0.01"
                    />
                  ) : (
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {event.ticketPrice
                        ? formatCurrency(event.ticketPrice)
                        : "Gratuito"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Limite de Participantes
                  </label>
                  {isEditing ? (
                    <Input
                      type="number"
                      name="maxParticipants"
                      value={formData.maxParticipants}
                      onChange={handleInputChange}
                      placeholder="Número ilimitado"
                    />
                  ) : (
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {event.maxParticipants || "Ilimitado"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status das Inscrições
                  </label>
                  {isEditing ? (
                    <select
                      name="status"
                      value={formData.status}
                      onChange={(e) =>
                        handleInputChange({
                          target: {
                            name: "status",
                            value: e.target.value,
                            type: "text",
                          },
                        } as unknown as React.ChangeEvent<HTMLInputElement>)
                      }
                      className="border rounded p-2 bg-background"
                    >
                      <option value="OPEN">Aberto</option>
                      <option value="CLOSE">Fechado</option>
                      <option value="FINALIZED">Finalizado</option>
                    </select>
                  ) : (
                    <Badge
                      className={
                        event.status === "OPEN"
                          ? "bg-green-600 dark:text-white"
                          : event.status === "FINALIZED"
                            ? "bg-gray-600 dark:text-white"
                            : "bg-red-600 dark:text-white"
                      }
                    >
                      {event.status === "OPEN"
                        ? "Inscrições Abertas"
                        : event.status === "FINALIZED"
                          ? "Evento Finalizado"
                          : "Inscrições Fechadas"}
                    </Badge>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status dos Pagamentos
                  </label>
                  <Badge
                    className={
                      event.paymentEneble
                        ? "bg-green-600 dark:text-white"
                        : "bg-red-600 dark:text-white"
                    }
                  >
                    {event.paymentEneble
                      ? "Pagamentos Ativos"
                      : "Pagamentos Inativos"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Card de Imagem do Evento */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Imagem do Evento
              </h2>

              <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden mb-4">
                {event.imageUrl ? (
                  <Image
                    src={event.imageUrl}
                    alt={event.name}
                    width={400}
                    height={225}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      Sem imagem
                    </p>
                  </div>
                )}
              </div>

              {isEditing && (
                <Button variant="outline" className="w-full">
                  Alterar Imagem
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Diálogo para tipos de inscrição */}
        <TypeInscriptionDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          typeInscription={currentType}
          eventId={event.id}
          onSubmit={handleSubmitType}
          loading={typeInscriptionLoading}
        />
      </div>
    </div>
  );
}
