import PublicNavbar from "@/shared/components/layout/public-navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <PublicNavbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
