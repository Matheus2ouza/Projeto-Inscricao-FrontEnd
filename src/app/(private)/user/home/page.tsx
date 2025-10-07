"use client";

import React from "react";
import { Button } from "@/shared/components/ui/button";
import { useLogout } from "@/shared/hooks/logout/logout";
import { useUserRole } from "@/shared/hooks/useUserRole";
import {
  User,
  Calendar,
  BookOpen,
  Bell,
  Settings,
  Clock,
  CheckCircle,
  Star,
} from "lucide-react";

export default function UserHome() {
  const { logout } = useLogout();
  const { role, loading } = useUserRole();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Meu Dashboard
              </h1>
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {role}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={logout}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Bem-vindo de volta! 👋
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie suas inscrições e participe de eventos
          </p>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                <Calendar className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                12
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Eventos Inscritos
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Total de inscrições
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                <CheckCircle className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                8
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Eventos Concluídos
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Eventos finalizados
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400">
                <Clock className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                4
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Próximos Eventos
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Eventos agendados
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                <Star className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                4.8
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Avaliação Média
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Suas avaliações
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Explorar Eventos
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Descubra novos eventos disponíveis
            </p>
            <Button className="w-full">Explorar</Button>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Minhas Inscrições
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Visualize suas inscrições ativas
            </p>
            <Button className="w-full">Ver Inscrições</Button>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400">
                <Bell className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Notificações
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Suas notificações e lembretes
            </p>
            <Button className="w-full">Ver Notificações</Button>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                <Settings className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Configurações
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Preferências e configurações
            </p>
            <Button className="w-full">Configurar</Button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Atividade Recente
          </h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="w-2 h-2 rounded-full mt-2 bg-green-500"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 dark:text-white font-medium">
                  Inscrição confirmada no evento &quot;Workshop de React&quot;
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Há 2 horas
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="w-2 h-2 rounded-full mt-2 bg-blue-500"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 dark:text-white font-medium">
                  Novo evento disponível: &quot;Conferência de Tecnologia
                  2025&quot;
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Há 1 dia
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="w-2 h-2 rounded-full mt-2 bg-purple-500"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 dark:text-white font-medium">
                  Certificado emitido para &quot;Curso de JavaScript&quot;
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Há 3 dias
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
