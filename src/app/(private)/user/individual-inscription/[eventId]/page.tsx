"use client";

import { useParams } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft } from "lucide-react";
import IndividualInscriptionForm from "@/features/individualInscription/components/IndividualInscriptionForm";
import { IndividualInscriptionInfo } from "@/features/individualInscription/components/IndividualInscriptionInfo";

export default function IndividualInscriptionPage() {
  const params = useParams();
  const eventId = params.eventId as string;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          size="icon"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Inscrição Individual
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Inscreva uma pessoa de forma rápida e simples
          </p>
        </div>
      </div>

      {/* Formulário ocupando toda a largura */}
      <div className="mb-8">
        <IndividualInscriptionForm eventId={eventId} />
      </div>

      {/* Informações abaixo do formulário */}
      <div>
        <IndividualInscriptionInfo />
      </div>
    </div>
  );
}
