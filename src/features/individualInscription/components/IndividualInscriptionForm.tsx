"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { cn } from "@/shared/lib/utils";
import { useFormIndividualInscription } from "../hooks/useFormIndividualInscription";

interface IndividualInscriptionFormProps {
  eventId: string;
}

export default function IndividualInscriptionForm({
  eventId,
}: IndividualInscriptionFormProps) {
  const {
    formData,
    typeInscriptions,
    isSubmitting,
    formErrors,
    handleInputChange,
    handleSubmit,
    register,
  } = useFormIndividualInscription({ eventId });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Formulário de Inscrição</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Seção 1: Dados do Responsável */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              Dados do Responsável
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="responsible">
                  Nome completo do responsável *
                </Label>
                <Input
                  id="responsible"
                  {...register("responsible")}
                  value={formData.responsible}
                  onChange={handleInputChange}
                  placeholder="Ex: João Silva"
                  className={cn(
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
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone do responsável *</Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(11) 99999-9999"
                  maxLength={15}
                  className={cn(
                    formErrors.phone && "border-red-500 focus:border-red-500"
                  )}
                />
                {formErrors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.phone.message}
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
                <Label htmlFor="participantName">
                  Nome completo do inscrito *
                </Label>
                <Input
                  id="participantName"
                  {...register("participantName")}
                  value={formData.participantName}
                  onChange={handleInputChange}
                  placeholder="Ex: Maria Santos"
                  className={cn(
                    formErrors.participantName &&
                      "border-red-500 focus:border-red-500"
                  )}
                />
                {formErrors.participantName && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.participantName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate">Data de nascimento *</Label>
                <Input
                  id="birthDate"
                  {...register("birthDate")}
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  placeholder="DD/MM/AAAA"
                  maxLength={10}
                  className={cn(
                    formErrors.birthDate &&
                      "border-red-500 focus:border-red-500"
                  )}
                />
                {formErrors.birthDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.birthDate.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gênero *</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => {
                    // Simular onChange para o react-hook-form
                    const event = {
                      target: { name: "gender", value },
                    } as React.ChangeEvent<HTMLInputElement>;
                    handleInputChange(event);
                  }}
                >
                  <SelectTrigger
                    id="gender"
                    className={cn(
                      formErrors.gender && "border-red-500 focus:border-red-500"
                    )}
                  >
                    <SelectValue placeholder="Selecione o gênero" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.gender && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.gender.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="typeInscriptionId">Tipo de inscrição *</Label>
                <Select
                  value={formData.typeInscriptionId}
                  onValueChange={(value) => {
                    // Simular onChange para o react-hook-form
                    const event = {
                      target: { name: "typeInscriptionId", value },
                    } as React.ChangeEvent<HTMLInputElement>;
                    handleInputChange(event);
                  }}
                >
                  <SelectTrigger
                    id="typeInscriptionId"
                    className={cn(
                      formErrors.typeInscriptionId &&
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
                {formErrors.typeInscriptionId && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.typeInscriptionId.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || Object.keys(formErrors).length > 0}
            className="w-full md:w-auto px-8 py-3 text-lg dark:text-white"
          >
            {isSubmitting ? "Enviando..." : "Finalizar Inscrição"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
