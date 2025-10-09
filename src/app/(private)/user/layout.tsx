import { redirect } from "next/navigation";
import { verifySession } from "@/shared/lib/session";
import PrivateNavbar from "@/shared/components/layout/private-navbar";
import AppSidebarNormal from "@/shared/components/layout/sidebar/Sidebar";

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
    <AppSidebarNormal>
      <PrivateNavbar />
      {children}
    </AppSidebarNormal>
  );
}
