'use client'

import React from "react";
import { ModeToggle } from "../../../components/theme/mode-toggle";
import Logo from "./logo";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-2 sm:px-4 lg:px-6 py-6 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 w-full overflow-hidden">
      {/* Left Section: Logo + Título */}
      <div className="flex items-center min-w-0 flex-1 space-x-3">
        <Logo className="w-8 h-8 object-contain" showTitle={false} />
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white truncate tracking-[0.2em] uppercase">
          Sistema de Inscrições - R2
        </h1>
      </div>

      {/* Right Section: Toggle de Tema */}
      <div className="flex items-center flex-shrink-0 ml-2">
        <ModeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
