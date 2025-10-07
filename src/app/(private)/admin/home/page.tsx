"use client";

import React from "react";
import { Button } from "@/shared/components/ui/button";
import { useLogout } from "@/shared/hooks/logout/logout";
import { useUserRole } from "@/shared/hooks/useUserRole";
import {
  Users,
  Calendar,
  BarChart3,
  Settings,
  Shield,
  UserCheck,
} from "lucide-react";

export default function AdminManagerHome() {
  const { logout } = useLogout();
  const { role, loading } = useUserRole();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Carregando...</div>
      </div>
    );
  }

  const isAdmin = role === "ADMIN";
  const isManager = role === "MANAGER";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Dashboard {isAdmin ? "Admin" : "Manager"}
              </h1>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-blue-600" />
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
            Bem-vindo, {isAdmin ? "Administrador" : "Gerente"}! 👋
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie usuários, eventos e configurações do sistema
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Gerenciar Usuários
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Visualize e gerencie usuários do sistema
            </p>
            <Button className="w-full">Acessar</Button>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Eventos
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Crie e gerencie eventos e inscrições
            </p>
            <Button className="w-full">Acessar</Button>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                <BarChart3 className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Relatórios
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Visualize relatórios e estatísticas
            </p>
            <Button className="w-full">Acessar</Button>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400">
                <Settings className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Configurações
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Configure o sistema e preferências
            </p>
            <Button className="w-full">Acessar</Button>
          </div>
        </div>

        {/* Admin Only Section */}
        {isAdmin && (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Funcionalidades Exclusivas do Admin
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Como administrador, você tem acesso a funcionalidades avançadas de
              gerenciamento do sistema.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="justify-start">
                <UserCheck className="w-4 h-4 mr-2" />
                Gerenciar Permissões
              </Button>
              <Button variant="outline" className="justify-start">
                <Settings className="w-4 h-4 mr-2" />
                Configurações Avançadas
              </Button>
            </div>
          </div>
        )}

        {/* Manager Only Section */}
        {isManager && (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Users className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Área do Gerente
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Como gerente, você pode gerenciar eventos e usuários dentro do seu
              escopo de responsabilidade.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Meus Eventos
              </Button>
              <Button variant="outline" className="justify-start">
                <BarChart3 className="w-4 h-4 mr-2" />
                Relatórios da Equipe
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
