"use client";

import React from "react";
import PublicNavbar from "@/shared/components/layout/public-navbar";
import { Button } from "@/shared/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navbar */}
      <PublicNavbar />

      {/* Hero Section */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center px-4"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Sistema de
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Inscrições
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Gerencie eventos, conferências e workshops de forma simples e
              eficiente. Uma plataforma completa para organizadores e
              participantes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleLoginClick}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg"
              >
                <i className="bi bi-box-arrow-in-right mr-2"></i>
                Acessar Sistema
              </Button>
              <Button
                variant="outline"
                className="border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 text-lg"
                onClick={() => {
                  const element = document.getElementById("sobre");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                <i className="bi bi-info-circle mr-2"></i>
                Saiba Mais
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre o Sistema Section */}
      <section
        id="sobre"
        className="min-h-screen flex items-center justify-center px-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Sobre o Sistema
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Uma solução completa para gerenciamento de eventos e inscrições
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="bi bi-people text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Gestão de Participantes
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Controle completo de inscrições, dados dos participantes e
                confirmações de presença.
              </p>
            </div>

            <div className="text-center p-6 bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="bi bi-calendar-event text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Organização de Eventos
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Crie e gerencie eventos com facilidade, definindo datas, locais
                e capacidades.
              </p>
            </div>

            <div className="text-center p-6 bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="bi bi-graph-up text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Relatórios e Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Acompanhe métricas importantes e gere relatórios detalhados dos
                seus eventos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Eventos Section */}
      <section
        id="eventos"
        className="min-h-screen flex items-center justify-center px-4"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Próximos Eventos
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Confira os eventos que estão acontecendo e as próximas
              oportunidades
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                <i className="bi bi-calendar-check text-white text-6xl"></i>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm font-semibold px-3 py-1 rounded-full">
                    Em Andamento
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Conferência de Tecnologia 2025
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Evento anual com palestras sobre as últimas tendências em
                  tecnologia.
                </p>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <i className="bi bi-calendar mr-2"></i>
                  <span>15-17 Jan 2025</span>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                <i className="bi bi-laptop text-white text-6xl"></i>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-semibold px-3 py-1 rounded-full">
                    Em Breve
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Workshop de Desenvolvimento
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Workshop prático sobre desenvolvimento web moderno e boas
                  práticas.
                </p>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <i className="bi bi-calendar mr-2"></i>
                  <span>25 Jan 2025</span>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                <i className="bi bi-people text-white text-6xl"></i>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-sm font-semibold px-3 py-1 rounded-full">
                    Planejado
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Networking Empresarial
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Evento de networking para profissionais e empreendedores da
                  região.
                </p>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <i className="bi bi-calendar mr-2"></i>
                  <span>10 Fev 2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">Sistema de Inscrição</h3>
              <p className="text-gray-400 mb-4">
                Uma plataforma completa para gerenciamento de eventos e
                inscrições, desenvolvida para facilitar a organização e
                participação em eventos.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <i className="bi bi-facebook text-xl"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <i className="bi bi-twitter text-xl"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <i className="bi bi-linkedin text-xl"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <i className="bi bi-instagram text-xl"></i>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Links Úteis</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#sobre"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Sobre
                  </a>
                </li>
                <li>
                  <a
                    href="#eventos"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Eventos
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contato
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="/documentation"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Suporte
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contato</h4>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center">
                  <i className="bi bi-envelope mr-2"></i>
                  <span>contato@sistemainscricao.com</span>
                </div>
                <div className="flex items-center">
                  <i className="bi bi-phone mr-2"></i>
                  <span>(91) 99258-7483</span>
                </div>
                <div className="flex items-center">
                  <i className="bi bi-geo-alt mr-2"></i>
                  <span>Belém, PA - Brasil</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; 2025 Sistema de Inscrição. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
