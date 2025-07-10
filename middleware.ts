import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  // Verificar sesión

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (session) console.log("Middleware - Session =====>:", session)

  // Rutas públicas que no requieren autenticación
  const publicRoutes = [
    "/",
    "/auth/login",
    "/auth/registro",
    "/auth/recuperar-password",
    "/auth/actualizar-password",
    "/auth/callback",
    "/auth/debug",
    "/test-supabase",
    "/test-connection",
    "/env-check",
    "/api/initialize-database",
    "/api/sync-auth-roles",
    "/debug-session",
    "/set-superadmin",
    "/debug-role",
    "/initialize-database",
    "/admin/sync-roles",
  ]
  console.log("Middleware - Request Pathname =====>", request.nextUrl.pathname)
  const isPublicRoute = publicRoutes.some(
    (route) => request.nextUrl.pathname === route,
  )

  console.log("Middleware - Is Public Route =====>", isPublicRoute)

  // Si no hay sesión y no es ruta pública, redirigir a login
  if (
    !session &&
    isPublicRoute === false
  ) {
    console.log("Middleware - No session, redirecting to login ======>")
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // Si hay sesión, verificar rol para rutas protegidas
  if (session) {
    // Obtener rol del usuario desde los metadatos
    let userRole = session.user.user_metadata?.role?.toLowerCase() || ""

    // Verificar si el rol es SuperAdmin y normalizarlo
    if (userRole === "superadmin" || userRole === "SuperAdmin") {
      userRole = "superadmin"
    }

    console.log(
      "Middleware - User Role:",
      userRole,
      "User Email:",
      session.user.email,
      "Path:",
      request.nextUrl.pathname,
    )

    const pathname = request.nextUrl.pathname

    // SuperAdmin tiene acceso a todas las rutas
    if (userRole === "superadmin") {
      // No redirigir, permitir acceso a cualquier ruta
      return res
    }

    // Verificar acceso según rol para otros roles
    // // IMPORTANTE: Permitir que el rol "taller" acceda a todas las rutas de /taller/
    // if (
    //   (pathname.startsWith("/admin") && userRole !== "admin") ||
    //   (pathname.startsWith("/taller") && userRole !== "taller" && userRole !== "admin") ||
    //   (pathname.startsWith("/aseguradora") && userRole !== "aseguradora" && userRole !== "admin") ||
    //   (pathname.startsWith("/cliente") && userRole !== "cliente" && userRole !== "admin")
    // ) {
    //   // Añadir un console.log para depurar
    //   console.log("Middleware - Acceso denegado a ruta:", pathname, "para usuario con rol:", userRole)

    //   // Redirigir a dashboard según rol
    //   if (userRole === "admin") {
    //     return NextResponse.redirect(new URL("/admin/dashboard", request.url))
    //   } else if (userRole === "taller") {
    //     return NextResponse.redirect(new URL("/taller/dashboard", request.url))
    //   } else if (userRole === "aseguradora") {
    //     return NextResponse.redirect(new URL("/aseguradora/dashboard", request.url))
    //   } else if (userRole === "cliente") {
    //     return NextResponse.redirect(new URL("/cliente/dashboard", request.url))
    //   } else {
    //     // Si no tiene un rol específico, redirigir a una página general
    //     return NextResponse.redirect(new URL("/aseguradora/dashboard", request.url))
    //   }
    // }

    // // Redirección para la ruta raíz según el rol
    // if (pathname === "/") {
    //   if (userRole === "superadmin") {
    //     return NextResponse.redirect(new URL("/admin/dashboard", request.url))
    //   } else if (userRole === "admin") {
    //     return NextResponse.redirect(new URL("/admin/dashboard", request.url))
    //   } else if (userRole === "taller") {
    //     return NextResponse.redirect(new URL("/taller/dashboard", request.url))
    //   } else if (userRole === "aseguradora") {
    //     return NextResponse.redirect(new URL("/aseguradora/dashboard", request.url))
    //   } else if (userRole === "cliente") {
    //     return NextResponse.redirect(new URL("/cliente/dashboard", request.url))
    //   }
    // }

    // // Si el usuario está autenticado y está intentando acceder a rutas de autenticación, redirigir al dashboard según rol
    // if (request.nextUrl.pathname === "/auth/login" || request.nextUrl.pathname === "/auth/registro") {
    //   if (userRole === "superadmin") {
    //     return NextResponse.redirect(new URL("/admin/dashboard", request.url))
    //   } else if (userRole === "admin") {
    //     return NextResponse.redirect(new URL("/admin/dashboard", request.url))
    //   } else if (userRole === "taller") {
    //     return NextResponse.redirect(new URL("/taller/dashboard", request.url))
    //   } else if (userRole === "aseguradora") {
    //     await supabase.auth.signOut()

    //     return NextResponse.redirect(new URL("/aseguradora/dashboard", request.url))
    //   } else if (userRole === "cliente") {
    //     return NextResponse.redirect(new URL("/cliente/dashboard", request.url))
    //   } else {
    //     return NextResponse.redirect(new URL("/dashboard", request.url))
    //   }
    // }
  }

  return res
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
