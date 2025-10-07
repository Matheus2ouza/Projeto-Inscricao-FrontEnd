import { redirect } from "next/navigation";
import { verifySession } from "@/shared/lib/session";

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

  return <>{children}</>;
}
