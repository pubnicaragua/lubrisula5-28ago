"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/supabase/auth"

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    // Función para verificar si la ruta está autorizada
    const checkAuth = () => {
      // Si está cargando, no hacemos nada todavía
      if (loading) return

      // Rutas públicas que no requieren autenticación
      const publicPaths = ["/auth/login", "/auth/registro", "/auth/recuperar-password"]
      const isPublicPath = publicPaths.includes(pathname)

      // Si no hay usuario y no es una ruta pública, redirigir a login
      if (!user && !isPublicPath) {
        setAuthorized(false)
        router.push("/auth/login")
        return
      }

      // Si hay usuario y es una ruta pública, redirigir según el rol
      if (user && isPublicPath) {
        setAuthorized(false)
        const role = user.role || "cliente"
        if (role === "admin") {
          router.push("/admin/dashboard")
        } else if (role === "taller") {
          router.push("/taller/dashboard")
        } else if (role === "aseguradora") {
          router.push("/aseguradora/dashboard")
        } else {
          router.push("/cliente/dashboard")
        }
        return
      }

      // En cualquier otro caso, está autorizado
      setAuthorized(true)
    }

    checkAuth()
  }, [user, loading, pathname, router])

  // Mientras carga o no está autorizado, mostramos un indicador de carga
  if (loading || !authorized) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
      </div>
    )
  }

  // Si está autorizado, mostramos los hijos
  return <>{children}</>
}

export default RouteGuard
