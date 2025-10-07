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
import { CalendarCheck2, Users, Map, ScrollText } from "lucide-react";

// Itens do menu lateral
const items = [
  {
    title: "Inscrições",
    icon: ScrollText,
    subItems: [
      { title: "Inscrição em Grupo", url: "#" },
      { title: "Inscrição Individual", url: "#" },
    ],
  },
  {
    title: "Usuários",
    url: "/super/accounts",
    icon: Users,
  },
  {
    title: "Regiões",
    url: "/super/regions",
    icon: Map,
  },
  {
    title: "Eventos",
    url: "/super/events",
    icon: CalendarCheck2,
  },
];

export default function AppSidebar({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex w-full">
        <Sidebar>
          <div className="flex flex-col items-center py-4">
            <Logo className="w-10 h-10 mb-2" showTitle={false} />
          </div>
          <SidebarContent>
            <SidebarMenu>
              {items.map((item) => (
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
                        {item.subItems.map((sub) => (
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
            </SidebarMenu>
            <SidebarSeparator />
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 flex flex-col min-h-screen">{children}</div>
      </div>
    </SidebarProvider>
  );
}
