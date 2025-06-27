"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "./client"
import { useRouter } from "next/navigation"
import type { User, Session } from "@supabase/supabase-js"

// Tipos
export type AuthContextType = {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
}

// Contexto de autenticación
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
})

// Función para normalizar roles (convertir SuperAdmin a superadmin, etc.)
function normalizeRole(role: string | undefined): string {
  if (!role) return "cliente"

  // Convertir a minúsculas para normalizar
  const normalizedRole = role.toLowerCase()

  // Verificar si es un rol válido
  if (["admin", "superadmin", "taller", "aseguradora", "cliente"].includes(normalizedRole)) {
    return normalizedRole
  }

  return "cliente" // Rol por defecto
}

// Función corregida para obtener el rol del usuario desde la base de datos
export async function getUserRoleFromDB(userId: string) {
  try {
    // Primero verificamos si el usuario existe en la tabla roles_usuario
    const { data: userRoles, error: userRolesError } = await supabase
      .from("roles_usuario")
      .select("rol_id")
      .eq("user_id", userId)

    if (userRolesError || !userRoles || userRoles.length === 0) {
      console.log("No se encontraron roles para el usuario:", userId)
      return null
    }

    // Obtenemos el primer rol del usuario (asumiendo que un usuario puede tener múltiples roles)
    const rolId = userRoles[0].rol_id

    // Obtenemos el nombre del rol
    const { data: role, error: roleError } = await supabase.from("roles").select("nombre").eq("id", rolId).single()

    if (roleError) {
      console.error("Error al obtener nombre del rol:", roleError)
      return null
    }

    return role?.nombre || null
  } catch (err) {
    console.error("Error en getUserRoleFromDB:", err)
    return null
  }
}

// Función para actualizar el rol de un usuario
export async function updateUserRole(userId: string, role: string) {
  const { error } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: { role },
  })

  if (error) {
    throw new Error(error.message)
  }
}

// Función para establecer el rol de administrador para el usuario actual
export async function setAdminRole() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("No hay usuario autenticado")
    }

    // Actualizar el rol en los metadatos del usuario
    const { error } = await supabase.auth.updateUser({
      data: { role: "admin" },
    })

    if (error) {
      throw error
    }

    console.log("Rol de administrador establecido correctamente")
    return { success: true }
  } catch (error) {
    console.error("Error al establecer rol de administrador:", error)
    return { success: false, error }
  }
}

// Proveedor de autenticación
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push("/auth/login")
  }

  const value = {
    user,
    session,
    loading,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook para usar el contexto de autenticación
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export default AuthContext
