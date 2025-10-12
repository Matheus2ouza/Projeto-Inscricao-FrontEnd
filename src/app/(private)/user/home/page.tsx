"use client";

import { Button } from "@/shared/components/ui/button";
import { useLogout } from "@/shared/hooks/logout/logout";
import { useUserRole } from "@/shared/hooks/useUserRole";
import { CalendarCheck2, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserHome() {
  const { logout } = useLogout();
  const { role, loading } = useUserRole();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Bem-vindo! 🎉
          </h2>
          <p className="text-muted-foreground">
            Faça suas inscrições em eventos
          </p>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

          {/* Pagamentos */}
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
      </div>
    </div>
  );
}
