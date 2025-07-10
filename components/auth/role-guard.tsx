"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/supabase/auth"

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: string[]
  fallbackPath?: string
}

export function RoleGuard({ children, allowedRoles, fallbackPath = "/auth/login" }: RoleGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    // Función para verificar si el rol está autorizado
    const checkRole = () => {
      // Si está cargando, no hacemos nada todavía
      if (loading) return

      // Si no hay usuario, redirigir al login
      if (!user) {
        setAuthorized(false)
        router.push(fallbackPath)
        return
      }

      // Verificar si el rol del usuario está en los roles permitidos
      // Usar preferentemente el rol de la base de datos si está disponible
      const userRole = user?.user_metadata?.role || user?.user_metadata?.role || "cliente"

      // Superadmin siempre tiene acceso a todas las rutas
      if (userRole === "superadmin") {
        setAuthorized(true)
        return
      }

      if (allowedRoles.includes(userRole)) {
        setAuthorized(true)
      } else {
        setAuthorized(false)
        // Redirigir según el rol
        if (userRole === "admin" || userRole === "superadmin") {
          router.push("/admin/dashboard")
        } else if (userRole === "taller") {
          router.push("/taller/dashboard")
        } else if (userRole === "aseguradora") {
          router.push("/aseguradora/dashboard")
        } else if (userRole === "cliente") {
          router.push("/cliente/dashboard")
        } else {
          router.push("/aseguradora/dashboard")
        }
      }
    }

    checkRole()
  }, [user, loading, allowedRoles, router, fallbackPath])

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

export default RoleGuard
