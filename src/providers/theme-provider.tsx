"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const [mounted, setMounted] = React.useState(false);
  const [defaultTheme, setDefaultTheme] = React.useState<"light" | "dark">(
    "light"
  );

  React.useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) setDefaultTheme(savedTheme);
    setMounted(true);
  }, []);

  if (!mounted) {
    // mostra um loading enquanto o tema é carregado
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <span className="text-gray-500">Carregando...</span>
      </div>
    );
  }

  return (
    <NextThemesProvider
      {...props}
      defaultTheme={defaultTheme}
      enableSystem={true}
      attribute="class"
    >
      {children}
    </NextThemesProvider>
  );
}
