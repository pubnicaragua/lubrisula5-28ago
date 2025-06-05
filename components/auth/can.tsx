"use client"

import type React from "react"

import { useAuth } from "@/lib/supabase/auth"

interface CanProps {
  children: React.ReactNode
  perform: string
  roles?: string[]
}

export function Can({ children, perform, roles = [] }: CanProps) {
  const { user } = useAuth()

  // Si no hay usuario, no mostrar nada
  if (!user) return null

  // SuperAdmin siempre tiene acceso a todo
  if (user.role === "superadmin") {
    return <>{children}</>
  }

  // Verificar si el rol del usuario está en los roles permitidos
  const hasRole = roles.includes(user.role || "")

  // Si no tiene el rol necesario, no mostrar nada
  if (!hasRole) return null

  // Implementar lógica de permisos específicos si es necesario
  // Por ahora, simplemente verificamos el rol

  return <>{children}</>
}

export default Can
