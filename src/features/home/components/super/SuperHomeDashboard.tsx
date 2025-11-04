"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Activity,
  CalendarCheck2,
  Database,
  Map,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function SuperHomeDashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 w-full">
      <div className="py-8 px-4 sm:px-8 md:px-12 w-full">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Bem-vindo, Administrador!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Controle total do sistema com acesso a todas as funcionalidades
          </p>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                <Activity className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                99.9%
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Sistema Online
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Uptime do sistema nos últimos 30 dias
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                2,847
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Usuários Ativos
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Total de usuários no sistema
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                <Database className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                156
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Eventos Ativos
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Eventos em andamento
            </p>
          </div>
        </div>

        {/* Super Admin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                <Shield className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Gerenciar Usuários
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Criar e gerenciar Usuários
            </p>
            <Button
              variant="default"
              className="w-full dark:text-secondary-foreground"
              onClick={() => router.push("/super/accounts")}
            >
              Acessar
            </Button>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400">
                <Map className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Regiões
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Criar e gerenciar Regiões
            </p>
            <Button
              variant="default"
              className="w-full dark:text-secondary-foreground"
              onClick={() => router.push("/super/regions")}
            >
              Acessar
            </Button>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
                <CalendarCheck2 className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Eventos
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Criar e gerenciar Eventos
            </p>
            <Button
              variant="default"
              className="w-full dark:text-secondary-foreground"
              onClick={() => router.push("/super/events")}
            >
              Acessar
            </Button>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                <Settings className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Manutenção
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Ferramentas de manutenção
            </p>
            <Button
              variant="default"
              className="w-full dark:text-secondary-foreground"
            >
              Acessar
            </Button>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Activity className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Status do Sistema
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                API
              </span>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                Operacional
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Banco de Dados
              </span>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Operacional
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Email
              </span>
              <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                Operacional
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Notificações Push
              </span>
              <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                Operacional
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
