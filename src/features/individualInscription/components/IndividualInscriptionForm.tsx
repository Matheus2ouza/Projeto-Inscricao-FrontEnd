// IndividualInscriptionForm.tsx - Componente simplificado
"use client";

import { useFormIndividualInscription } from "../hooks/useFormIndividualInscription";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { cn } from "@/shared/lib/utils";

export default function IndividualInscriptionForm({
  eventId,
}: {
  eventId: string;
}) {
  const {
    formData,
    typeInscriptions,
    loading,
    submitting,
    submitError,
    errors,
    onSubmit,
    updateResponsibleData,
    updatePersonalData,
    setTypeInscriptionId,
    handlePhoneChange,
    handleDateChange,
  } = useFormIndividualInscription(eventId);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Carregando tipos de inscrição...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Formulário de Inscrição</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-8">
          {/* Seção 1: Dados do Responsável */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              Dados do Responsável
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="responsibleName">
                  Nome completo do responsável *
                </Label>
                <Input
                  id="responsibleName"
                  placeholder="Ex: João Silva"
                  value={formData.responsibleData?.fullName || ""}
                  onChange={(e) =>
                    updateResponsibleData("fullName", e.target.value)
                  }
                  className={cn(
                    errors.responsibleData?.fullName &&
                      "border-red-500 focus:border-red-500"
                  )}
                />
                {errors.responsibleData?.fullName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.responsibleData.fullName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="responsiblePhone">
                  Telefone do responsável *
                </Label>
                <Input
                  id="responsiblePhone"
                  placeholder="(11) 99999-9999"
                  value={formData.responsibleData?.phone || ""}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  maxLength={15}
                  className={cn(
                    errors.responsibleData?.phone &&
                      "border-red-500 focus:border-red-500"
                  )}
                />
                {errors.responsibleData?.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.responsibleData.phone.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Seção 2: Dados do Inscrito */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              Dados do Inscrito
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="inscribedName">
                  Nome completo do inscrito *
                </Label>
                <Input
                  id="inscribedName"
                  placeholder="Ex: Maria Santos"
                  value={formData.personalData?.fullName || ""}
                  onChange={(e) =>
                    updatePersonalData("fullName", e.target.value)
                  }
                  className={cn(
                    errors.personalData?.fullName &&
                      "border-red-500 focus:border-red-500"
                  )}
                />
                {errors.personalData?.fullName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.personalData.fullName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate">Data de nascimento *</Label>
                <Input
                  id="birthDate"
                  placeholder="DD/MM/AAAA"
                  value={formData.personalData?.birthDate || ""}
                  onChange={(e) => handleDateChange(e.target.value)}
                  maxLength={10}
                  className={cn(
                    errors.personalData?.birthDate &&
                      "border-red-500 focus:border-red-500"
                  )}
                />
                {errors.personalData?.birthDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.personalData.birthDate.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gênero *</Label>
                <Select
                  value={formData.personalData?.gender || ""}
                  onValueChange={(value) => updatePersonalData("gender", value)}
                >
                  <SelectTrigger
                    id="gender"
                    className={cn(
                      errors.personalData?.gender &&
                        "border-red-500 focus:border-red-500"
                    )}
                  >
                    <SelectValue placeholder="Selecione o gênero" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                  </SelectContent>
                </Select>
                {errors.personalData?.gender && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.personalData.gender.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="inscriptionType">Tipo de inscrição *</Label>
                <Select
                  value={formData.typeInscriptionId || ""}
                  onValueChange={setTypeInscriptionId}
                >
                  <SelectTrigger
                    id="inscriptionType"
                    className={cn(
                      errors.typeInscriptionId &&
                        "border-red-500 focus:border-red-500"
                    )}
                  >
                    <SelectValue placeholder="Selecione o tipo de inscrição" />
                  </SelectTrigger>
                  <SelectContent>
                    {typeInscriptions.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.description} - R${" "}
                        {type.value?.toFixed(2) || "0.00"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.typeInscriptionId && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.typeInscriptionId.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={submitting || Object.keys(errors).length > 0}
            className="w-full md:w-auto px-8 py-3 text-lg dark:text-white"
          >
            {submitting ? "Enviando..." : "Finalizar Inscrição"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
