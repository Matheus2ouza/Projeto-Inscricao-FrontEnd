"use client";

import DismissibleAlert from "@/shared/components/DismissibleAlert";
import { Button } from "@/shared/components/ui/button";
import { CalendarCheck2, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserHomeDashboard() {
  const router = useRouter();

  return (
    <>
      {/* Aviso sobre desenvolvimento */}
      <DismissibleAlert
        id="system-development-warning"
        title="Sistema em Desenvolvimento"
        variant="warning"
        asModal={true}
      >
        O sistema ainda está em fase de desenvolvimento, e algumas
        funcionalidades podem não estar finalizadas ou funcionar de forma
        diferente do esperado. Recomendamos utilizá-lo em um{" "}
        <strong>computador (desktop)</strong> para uma melhor experiência, mas
        ele também pode ser acessado pelo celular.
      </DismissibleAlert>

      {/* Main Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {/* Eventos */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-shadow flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
              <CalendarCheck2 className="w-6 h-6" />
            </div>
          </div>
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Eventos
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Explore todos os eventos disponiveis
            </p>
          </div>
          <Button
            variant="default"
            className="w-full dark:text-secondary-foreground mt-auto"
            onClick={() => router.push("/user/events")}
          >
            Acessar
          </Button>
        </div>

        {/* Minhas Inscrições */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-shadow flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
              <FileText className="w-6 h-6" />
            </div>
          </div>
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Minhas Inscrições
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Gerencia todas suas Inscrições
            </p>
          </div>
          <Button
            variant="default"
            className="w-full dark:text-secondary-foreground mt-auto"
            onClick={() => router.push("/user/MyInscriptions")}
          >
            Acessar
          </Button>
        </div>
      </div>
    </>
  );
}
