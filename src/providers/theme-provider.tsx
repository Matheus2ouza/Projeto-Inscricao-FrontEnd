"use client";

import { useGlobalLoading } from "@/components/GlobalLoading";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import * as React from "react";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const [mounted, setMounted] = React.useState(false);
  const [defaultTheme, setDefaultTheme] = React.useState<"light" | "dark">(
    "light"
  );
  const { setLoading } = useGlobalLoading();

  React.useEffect(() => {
    setLoading(true);
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) setDefaultTheme(savedTheme);
    setMounted(true);
    setLoading(false);
  }, [setLoading]);

  if (!mounted) {
    return null;
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
