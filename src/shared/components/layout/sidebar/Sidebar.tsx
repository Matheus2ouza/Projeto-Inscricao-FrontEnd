"use client";

import React from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/shared/components/ui/sidebar";
import Logo from "@/shared/components/ui/logo";
import {
  CalendarCheck2,
  Users,
  Map,
  ScrollText,
  House,
  LogOut,
} from "lucide-react";
import { useLogout } from "@/shared/hooks/logout/logout";

// Itens do menu lateral
const items = [
  {
    title: "Inicio",
    icon: House,
    url: "/user/home",
    visible: true,
  },
  {
    title: "Inscrições",
    icon: ScrollText,
    visible: false,
    subItems: [
      { title: "Inscrição em Grupo", url: "#", visible: true },
      { title: "Inscrição Individual", url: "#", visible: false },
    ],
  },
  {
    title: "Usuários",
    url: "/super/accounts",
    icon: Users,
    visible: false,
  },
  {
    title: "Eventos",
    url: "/user/events",
    icon: CalendarCheck2,
    visible: true,
  },
];

export default function AppSidebarNormal({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { logout } = useLogout();

  return (
    <SidebarProvider>
      <div className="flex w-full">
        <Sidebar>
          <div className="flex flex-col items-center py-4">
            <Logo className="w-10 h-10 mb-2" showTitle={false} />
          </div>
          <SidebarContent>
            <SidebarMenu>
              {items
                .filter((item) => item.visible) // só mostra os visíveis
                .map((item) => (
                  <SidebarMenuItem key={item.title}>
                    {item.subItems ? (
                      <>
                        <SidebarMenuButton asChild>
                          <div className="flex items-center gap-2 cursor-default select-none">
                            <item.icon className="mr-2" />
                            {item.title}
                          </div>
                        </SidebarMenuButton>
                        <div className="ml-6 mt-1 flex flex-col gap-1">
                          {item.subItems
                            .filter((sub) => sub.visible)
                            .map((sub) => (
                              <SidebarMenuButton asChild key={sub.title}>
                                <a
                                  href={sub.url}
                                  className="pl-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                  {sub.title}
                                </a>
                              </SidebarMenuButton>
                            ))}
                        </div>
                      </>
                    ) : (
                      <SidebarMenuButton asChild>
                        <a href={item.url} className="flex items-center gap-2">
                          <item.icon className="mr-2" />
                          {item.title}
                        </a>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                ))}

              {/* Item Logout no final */}
              <SidebarSeparator />
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 w-full text-left cursor-pointer"
                  >
                    <LogOut className="mr-2" />
                    Sair
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 flex flex-col min-h-screen">{children}</div>
      </div>
    </SidebarProvider>
  );
}
