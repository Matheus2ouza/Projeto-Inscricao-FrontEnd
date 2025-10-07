"use client";

import React from "react";
import { useTheme } from "next-themes";

interface LogoProps {
  className?: string;
  lightModeSrc?: string;
  darkModeSrc?: string;
  alt?: string;
  showTitle?: boolean;
}

const Logo: React.FC<LogoProps> = ({
  className = "w-48 h-48 object-contain mx-auto mb-8",
  lightModeSrc,
  darkModeSrc,
  alt = "Logo Sistema de Inscrição",
  showTitle = true,
}) => {
  const { theme, resolvedTheme } = useTheme();

  // Determina qual tema está ativo
  const currentTheme = resolvedTheme || theme || "light";

  // Define as imagens baseadas no showTitle
  const defaultLightSrc = showTitle
    ? "/images/logo+title.png"
    : "/images/logo.png";
  const defaultDarkSrc = showTitle
    ? "/images/logo+title-white.png"
    : "/images/logo-white.png";

  // Usa as props se fornecidas, senão usa os defaults
  const finalLightSrc = lightModeSrc || defaultLightSrc;
  const finalDarkSrc = darkModeSrc || defaultDarkSrc;

  // Seleciona a imagem baseada no tema
  const logoSrc = currentTheme === "dark" ? finalDarkSrc : finalLightSrc;

  return <img src={logoSrc} alt={alt} className={className} />;
};

export default Logo;
