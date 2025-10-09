"use client";

import { Button } from "@/shared/components/ui/button";
import { useLogout } from "@/shared/hooks/logout/logout";
import { useUserRole } from "@/shared/hooks/useUserRole";
import { Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserHome() {
  const { logout } = useLogout();
  const { role, loading } = useUserRole();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Bem-vindo! 🎉
          </h2>
          <p className="text-muted-foreground">
            Faça suas inscrições em eventos
          </p>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Eventos */}
          <div className="bg-card rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Eventos
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Explore todos os eventos disponíveis
            </p>
            <Button
              className="w-full dark: text-white"
              onClick={() => router.push("/user/events")}
            >
              Ver Eventos
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
