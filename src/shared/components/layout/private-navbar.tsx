"use client";

import React from "react";
import { Button } from "@/shared/components/ui/button";
import { useRouter } from "next/navigation";
import { ModeToggle } from "@/shared/components/ui/mode-toggle";
import Logo from "@/shared/components/ui/logo";
import { SidebarTrigger } from "@/shared/components/ui/sidebar";
import { useLogout } from "@/shared/hooks/logout/logout";

const PrivateNavbar = () => {
  const router = useRouter();
  const { logout } = useLogout();

  const handleLogoClick = () => {
    router.push("/super/home");
  };

  return (
    <>
      <nav className="flex justify-between items-center px-2 sm:px-4 lg:px-6 py-3 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 w-full overflow-hidden relative z-50">
        {/* Left Section: Sidebar Trigger + Logo + Título */}
        <div className="flex items-center space-x-3">
          {/* Botão para abrir/fechar sidebar */}
          <SidebarTrigger />
          {/* Logo + Título - clicável para voltar à home */}
          <div
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity duration-200"
            onClick={handleLogoClick}
          >
            <Logo className="w-12 h-12 object-contain" showTitle={false} />
            <h1 className="hidden sm:block text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white truncate tracking-[0.2em] uppercase">
              Sistema de Inscrições
            </h1>
          </div>
        </div>

        {/* Right Section: Desktop Navigation + Actions + Toggle de Tema */}
        <div className="flex items-center space-x-6">
          <div className="hidden md:flex items-center">
            <Button variant="outline" onClick={logout}>
              Sair
            </Button>
          </div>
          {/* Toggle de Tema */}
          <ModeToggle />
        </div>
      </nav>
    </>
  );
};

export default PrivateNavbar;
