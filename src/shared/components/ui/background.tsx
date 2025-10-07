"use client";

import React from "react";

interface BackgroundProps {
  children: React.ReactNode;
  className?: string;
}

const Background: React.FC<BackgroundProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Gradiente de fundo principal - mais sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-700"></div>

      {/* Gradiente radial animado - mais sutil */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-blue-50/20 dark:to-blue-900/10 animate-pulse"></div>

      {/* Bolhas flutuantes animadas - cores mais suaves */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-200/20 to-indigo-200/20 dark:from-blue-800/10 dark:to-indigo-800/10 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-gradient-to-r from-gray-200/20 to-blue-200/20 dark:from-gray-700/10 dark:to-blue-800/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-indigo-200/20 to-purple-200/20 dark:from-indigo-800/10 dark:to-purple-800/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

      {/* Gradiente cônico sutil - ainda mais sutil */}
      <div className="absolute inset-0 bg-gradient-conic from-transparent via-gray-200/10 to-transparent dark:from-transparent dark:via-gray-700/5 dark:to-transparent animate-spin-slow"></div>

      {/* Linhas decorativas - mais suaves */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300/30 to-transparent dark:via-gray-600/20"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300/30 to-transparent dark:via-gray-600/20"></div>

      {/* Overlay sutil para melhorar legibilidade do conteúdo */}
      <div className="absolute inset-0 bg-white/10 dark:bg-black/5 backdrop-blur-[1px]"></div>

      {/* Conteúdo */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default Background;
