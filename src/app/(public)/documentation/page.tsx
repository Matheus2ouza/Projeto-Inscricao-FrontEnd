"use client";

import React from "react";
import PublicNavbar from "@/shared/components/layout/public-navbar";

export default function Documentation() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Documentação do Sistema
          </h1>

          <div className="prose dark:prose-invert max-w-none">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Como usar o sistema
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Esta é a página de documentação do Sistema de Inscrições. Aqui
              você encontrará informações sobre como usar todas as
              funcionalidades disponíveis.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
              Funcionalidades Principais
            </h3>

            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2 mb-6">
              <li>Gerenciamento de usuários</li>
              <li>Criação e gestão de eventos</li>
              <li>Sistema de inscrições</li>
              <li>Relatórios e analytics</li>
              <li>Configurações do sistema</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
              Suporte
            </h3>

            <p className="text-gray-600 dark:text-gray-400">
              Para mais informações ou suporte, entre em contato conosco através
              do WhatsApp: (91) 99258-7483
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
