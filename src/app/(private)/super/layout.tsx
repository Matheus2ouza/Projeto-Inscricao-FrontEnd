import PrivateNavbar from "@/shared/components/layout/private-navbar";

import AppSidebar from "@/shared/components/layout/sidebar-super/Sidebar";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppSidebar>
      <PrivateNavbar />
      {children}
    </AppSidebar>
  );
}
