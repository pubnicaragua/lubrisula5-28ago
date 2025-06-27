"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import type { Database } from "@/lib/supabase/database.types"

// Cliente de Supabase con configuración fija
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wcyvgqbtaimkguaslhom.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjeXZncWJ0YWlta2d1YXNsaG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNzQ5MjMsImV4cCI6MjA2Mjc1MDkyM30.fJAXPGUKaXyK1BgNHJx_M-MM7pswqusZtSK2Ji2KQZQ"

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Tipos
export type User = {
  id: string
  email: string | null
  role?: string
  dbRole?: string | null
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
  refreshUserRole: () => Promise<void>
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
  refreshUserRole: async () => {},
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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Función para actualizar el rol del usuario desde la base de datos
  const refreshUserRole = async () => {
    if (!user) return

    try {
      const dbRole = await getUserRoleFromDB(user.id)

      setUser((prev) => {
        if (!prev) return null
        return {
          ...prev,
          dbRole,
        }
      })
    } catch (err) {
      console.error("Error al actualizar rol de usuario:", err)
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const session = await getSession()
        if (session) {
          const currentUser = await getUser()
          const normalizedRole = normalizeRole(currentUser.user_metadata?.role)

          // Obtener el rol desde la base de datos
          const dbRole = await getUserRoleFromDB(currentUser.id)

          setUser({
            id: currentUser.id,
            email: currentUser.email,
            role: normalizedRole,
            dbRole,
          })

          console.log("AuthProvider - User Role:", normalizedRole, "DB Role:", dbRole)
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

        // Obtener el rol desde la base de datos
        const dbRole = await getUserRoleFromDB(currentUser.id)

        setUser({
          id: currentUser.id,
          email: currentUser.email,
          role: normalizedRole,
          dbRole,
        })

        console.log("AuthProvider - Auth State Change - User Role:", normalizedRole, "DB Role:", dbRole)
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

        // Obtener el rol desde la base de datos
        const dbRole = await getUserRoleFromDB(data.user.id)

        setUser({
          id: data.user.id,
          email: data.user.email,
          role: normalizedRole,
          dbRole,
        })

        // Usar preferentemente el rol de la base de datos si está disponible
        const effectiveRole = dbRole || normalizedRole

        // Redirigir según el rol - asegurándonos de que las rutas sean correctas
        if (effectiveRole === "superadmin" || effectiveRole === "admin") {
          router.push("/admin/dashboard")
        } else if (effectiveRole === "taller") {
          router.push("/taller/dashboard")
        } else if (effectiveRole === "aseguradora") {
          router.push("/aseguradora/dashboard")
        } else if (effectiveRole === "cliente") {
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

    // Usar preferentemente el rol de la base de datos si está disponible
    const effectiveRole = user.dbRole || user.role

    // Permitir que superadmin tenga acceso a todo
    if (effectiveRole === "superadmin") {
      return true
    }

    // Para admin, permitir acceso a taller y aseguradora
    if (
      effectiveRole === "admin" &&
      (normalizedRequestedRole === "taller" || normalizedRequestedRole === "aseguradora")
    ) {
      return true
    }

    return effectiveRole === normalizedRequestedRole
  }

  const hasPermission = (permission: string) => {
    // Implementar lógica de permisos según sea necesario
    // Por defecto, superadmin tiene todos los permisos
    if (user?.role === "superadmin" || user?.dbRole === "superadmin") return true
    return false
  }

  const updateUserRoleHandler = async (userId: string, role: string) => {
    try {
      setLoading(true)
      await updateUserRole(userId, role)

      // Si es el usuario actual, actualizar el estado
      if (user && user.id === userId) {
        setUser({
          ...user,
          role: normalizeRole(role),
        })

        // Actualizar también el rol en la base de datos
        await refreshUserRole()
      }
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
    refreshUserRole,
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
