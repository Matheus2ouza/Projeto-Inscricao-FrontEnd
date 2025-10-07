import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../providers/theme-provider";
import { Toaster } from "@/shared/components/ui/sonner";
import { HeroUIProviderWrapper } from "../providers/heroui-provider";
import { GlobalLoadingProvider } from "@/components/GlobalLoading";

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
        <HeroUIProviderWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <GlobalLoadingProvider>
              <main className="h-screen">
                {children}
                <Toaster
                  richColors={true}
                  position="top-right"
                  swipeDirections={["right", "left"]}
                  closeButton
                />
              </main>
            </GlobalLoadingProvider>
          </ThemeProvider>
        </HeroUIProviderWrapper>
      </body>
    </html>
  );
}
