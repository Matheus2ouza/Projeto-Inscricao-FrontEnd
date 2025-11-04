import PrivateNavbar from "@/shared/components/layout/private-navbar";
import AppSidebarNormal from "@/shared/components/layout/sidebar/Sidebar";
import { verifySession } from "@/shared/lib/session";
import SessionUserProvider from "@/shared/providers/session-user-provider";
import { redirect } from "next/navigation";

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession();

  // Verificar se o usuário está autenticado
  if (!session) {
    redirect("/login");
  }

  return (
    <SessionUserProvider>
      <AppSidebarNormal>
        <PrivateNavbar />
        {children}
      </AppSidebarNormal>
    </SessionUserProvider>
  );
}
