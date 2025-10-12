import { GlobalLoadingProvider } from "@/components/GlobalLoading";
import { Toaster } from "@/shared/components/ui/sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import { HeroUIProviderWrapper } from "../providers/heroui-provider";
import { QueryProvider } from "../providers/query-provider";
import { ThemeProvider } from "../providers/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Sistema de Inscrição",
  description: "Sistema de Inscrição para conferências",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <QueryProvider>
          <GlobalLoadingProvider>
            <HeroUIProviderWrapper>
              <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
                disableTransitionOnChange
              >
                <main className="h-screen">
                  {children}
                  <Toaster
                    richColors={true}
                    position="top-right"
                    swipeDirections={["right", "left"]}
                    closeButton
                  />
                </main>
              </ThemeProvider>
            </HeroUIProviderWrapper>
          </GlobalLoadingProvider>
        </QueryProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
