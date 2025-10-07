import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";
import { verifySession } from "./shared/lib/session";

const publicRoutes = [
  { path: "/", whenAuthenticated: "next" },
  { path: "/login", whenAuthenticated: "redirect" },
  { path: "/documentation", whenAuthenticated: "next" },
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATED = "/login";

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const publicRoute = publicRoutes.find((route) => route.path === pathname);
  const authToken = request.cookies.get("authToken")?.value;

  // Se não há token e é rota pública, libera
  if (!authToken && publicRoute) {
    return NextResponse.next();
  }

  // Se não há token e não é rota pública, redireciona para login
  if (!authToken && !publicRoute) {
    console.log("No auth token and not a public route");
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED;
    return NextResponse.redirect(redirectUrl);
  }

  // Se há token e está tentando acessar rota pública que deve redirecionar
  if (
    authToken &&
    publicRoute &&
    publicRoute.whenAuthenticated === "redirect"
  ) {
    const session = await verifySession();
    if (session) {
      const role = session.user.role;
      const roleHome: Record<string, string> = {
        SUPER: "/super/home",
        ADMIN: "/admin/home",
        MANAGER: "/admin/home",
        USER: "/user/home",
      };
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = roleHome[role] ?? "/user";
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Se há token e não é rota pública, verifica sessão e role
  if (authToken && !publicRoute) {
    const session = await verifySession();
    if (!session) {
      console.log("No valid session found");
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED;
      return NextResponse.redirect(redirectUrl);
    }

    const role = session.user.role;
    const roleHome: Record<string, string> = {
      SUPER: "/super/",
      ADMIN: "/admin/",
      MANAGER: "/admin/",
      USER: "/user/",
    };
    const requiredPrefix = roleHome[role] ?? "/user/";

    // Se não está acessando a rota do seu role, redireciona
    if (!pathname.startsWith(requiredPrefix)) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = requiredPrefix;
      return NextResponse.redirect(redirectUrl);
    }

    // Se está tentando acessar rota de outro role, redireciona
    const otherRolePrefixes = Object.values(roleHome).filter(
      (prefix) => prefix !== requiredPrefix
    );
    const isAccessingOtherRole = otherRolePrefixes.some((prefix) =>
      pathname.startsWith(prefix)
    );
    if (isAccessingOtherRole) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = requiredPrefix;
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|images/|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
