"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import type { Database } from "@/lib/supabase/database.types"

// Cliente de Supabase
export const supabase = createClientComponentClient<Database>()

// Tipos
export type User = {
  id: string
  email: string | null
  role?: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  signUp: (email: string, password: string, role?: string) => Promise<void>
  hasRole: (role: string) => boolean
  hasPermission: (permission: string) => boolean
  updateUserRole: (userId: string, role: string) => Promise<void>
}

// Contexto de autenticación
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  signIn: async () => {},
  signOut: async () => {},
  signUp: async () => {},
  hasRole: () => false,
  hasPermission: () => false,
  updateUserRole: async () => {},
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

// Funciones de autenticación
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function signOutUser() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error(error.message)
  }
}

export const signUpWithEmail = async (email: string, password: string, role = "cliente") => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
      },
    },
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession()

  if (error) {
    throw new Error(error.message)
  }

  return data.session
}

export async function getUser() {
  const { data, error } = await supabase.auth.getUser()

  if (error) {
    throw new Error(error.message)
  }

  return data.user
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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const session = await getSession()
        if (session) {
          const currentUser = await getUser()
          const normalizedRole = normalizeRole(currentUser.user_metadata?.role)

          setUser({
            id: currentUser.id,
            email: currentUser.email,
            role: normalizedRole,
          })

          console.log("AuthProvider - User Role:", normalizedRole)
        }
      } catch (err) {
        console.error("Error al cargar el usuario:", err)
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const currentUser = session.user
        const normalizedRole = normalizeRole(currentUser.user_metadata?.role)

        setUser({
          id: currentUser.id,
          email: currentUser.email,
          role: normalizedRole,
        })

        console.log("AuthProvider - Auth State Change - User Role:", normalizedRole)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      const data = await signInWithEmail(email, password)

      if (data.user) {
        // Obtener el usuario actualizado para asegurarnos de tener los metadatos más recientes
        const {
          data: { user: updatedUser },
        } = await supabase.auth.getUser()

        const normalizedRole = normalizeRole(updatedUser?.user_metadata?.role)
        console.log("SignIn - User Role:", normalizedRole)

        setUser({
          id: data.user.id,
          email: data.user.email,
          role: normalizedRole,
        })

        // Redirigir según el rol - asegurándonos de que las rutas sean correctas
        if (normalizedRole === "superadmin" || normalizedRole === "admin") {
          router.push("/admin/dashboard")
        } else if (normalizedRole === "taller") {
          router.push("/taller/dashboard")
        } else if (normalizedRole === "aseguradora") {
          router.push("/aseguradora/dashboard")
        } else if (normalizedRole === "cliente") {
          router.push("/cliente/dashboard")
        } else {
          router.push("/dashboard")
        }
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err)
      setError(err instanceof Error ? err.message : "Error al iniciar sesión")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      await signOutUser()
      setUser(null)
      router.push("/auth/login")
    } catch (err) {
      console.error("Error al cerrar sesión:", err)
      setError(err instanceof Error ? err.message : "Error al cerrar sesión")
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, role = "cliente") => {
    try {
      setLoading(true)
      setError(null)
      await signUpWithEmail(email, password, role)
    } catch (err) {
      console.error("Error al registrar usuario:", err)
      setError(err instanceof Error ? err.message : "Error al registrar usuario")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const hasRole = (role: string) => {
    if (!user) return false

    // Normalizar el rol solicitado
    const normalizedRequestedRole = normalizeRole(role)

    // Permitir que superadmin tenga acceso a todo
    if (user.role === "superadmin") {
      return true
    }

    // Para admin, permitir acceso a taller y aseguradora
    if (user.role === "admin" && (normalizedRequestedRole === "taller" || normalizedRequestedRole === "aseguradora")) {
      return true
    }

    return user.role === normalizedRequestedRole
  }

  const hasPermission = (permission: string) => {
    // Implementar lógica de permisos según sea necesario
    // Por defecto, superadmin tiene todos los permisos
    if (user?.role === "superadmin") return true
    return false
  }

  const updateUserRoleHandler = async (userId: string, role: string) => {
    try {
      setLoading(true)
      await updateUserRole(userId, role)
    } catch (err) {
      console.error("Error al actualizar el rol del usuario:", err)
      setError(err instanceof Error ? err.message : "Error al actualizar el rol del usuario")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    error,
    signIn,
    signOut,
    signUp,
    hasRole,
    hasPermission,
    updateUserRole: updateUserRoleHandler,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook para usar el contexto de autenticación
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}

export default AuthContext
