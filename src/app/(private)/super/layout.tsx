import PrivateNavbar from "@/shared/components/layout/private-navbar";
import AppSidebarSuper from "@/shared/components/layout/sidebar-super/Sidebar";
import SessionUserProvider from "@/shared/providers/session-user-provider";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionUserProvider>
      <AppSidebarSuper>
        <PrivateNavbar />
        {children}
      </AppSidebarSuper>
    </SessionUserProvider>
  );
}
