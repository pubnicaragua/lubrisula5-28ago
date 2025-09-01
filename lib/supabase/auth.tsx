
"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "./client"
import { useRouter } from "next/navigation"
import type { User, Session } from "@supabase/supabase-js"
import TALLER_SERVICES from "@/services/TALLER_SERVICES.SERVICE"

// Tipos
export type AuthContextType = {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
  signUpTaller: (
    email: string,
    password: string,
    nombre?: string,
    apellido?: string,
    telefono?: string,
    newTallerData?: {
      // user_auth_id: string
      nombre_taller: string
      direccion: string
      ciudad: string
      estado: string
      codigo_postal: string
      nombre_contacto: string
      telefono: string
      email: string
      descripcion?: string | null
      modulos_seleccionados?: any[]
    }
  ) => Promise<{ success: boolean, error: string | null }>
  signUp: (
    email: string,
    password: string,
    role: string,
    taller_id?: string,
    nombre?: string,
    apellido?: string,
    telefono?: string,
    newRegister?: boolean,
    newTallerData?: {
      // user_auth_id: string
      nombre_taller: string
      direccion: string
      ciudad: string
      estado: string
      codigo_postal: string
      nombre_contacto: string
      telefono: string
      email: string
      descripcion?: string | null
      modulos_seleccionados?: any[]
    }
  ) => Promise<{ error: string | null }>

}

// Contexto de autenticación
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => { },
  signUp: async () => ({ error: "Not implemented" }),
  signUpTaller: async () => ({ success: false, error: "Not implemented" }),

})

// Función para normalizar roles
function normalizeRole(role: string | undefined): string {
  if (!role) return "cliente"
  const normalizedRole = role.toLowerCase()
  if (["admin", "superadmin", "taller", "aseguradora", "cliente"].includes(normalizedRole)) {
    return normalizedRole
  }
  return "cliente"
}

// Obtener el rol del usuario desde la base de datos
export async function getUserRoleFromDB(userId: string) {
  try {
    const { data: userRoles, error: userRolesError } = await supabase
      .from("roles_usuario")
      .select("rol_id")
      .eq("user_id", userId)

    if (userRolesError || !userRoles || userRoles.length === 0) {
      return null
    }

    const rolId = userRoles[0].rol_id

    const { data: role, error: roleError } = await supabase
      .from("roles")
      .select("nombre")
      .eq("id", rolId)
      .single()

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

// Actualizar el rol del usuario (en los metadatos)
export async function updateUserRole(userId: string, role: string) {
  const { error } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: { role },
  })

  if (error) {
    throw new Error(error.message)
  }
}

// Establecer el rol de administrador para el usuario actual
export async function setAdminRole() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("No hay usuario autenticado")
    }

    const { error } = await supabase.auth.updateUser({
      data: { role: "admin" },
    })

    if (error) {
      throw error
    }

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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

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
    try {
      const res = await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
    }
  }

  const signUpTaller = async (
    email: string,
    password: string,
    nombre?: string,
    apellido?: string,
    telefono?: string,
    newTallerData?: {
      user_auth_id: string
      nombre_taller: string
      direccion: string
      ciudad: string
      estado: string
      codigo_postal: string
      nombre_contacto: string
      telefono: string
      email: string
      descripcion?: string | null
      modulos_seleccionados?: any[]
    }
  ): Promise<{ success: boolean, error: string | null }> => {
    try {
      // 1. Crear el usuario

      const { data, error: ErrorUserAuth } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role: 'taller' }, // metadata opcional
        },
      })
      if (ErrorUserAuth) {
        return { success: false, error: ErrorUserAuth.message }
      }

      if (!ErrorUserAuth) {
        const taller = await TALLER_SERVICES.INSERT_TALLER({
          direccion: newTallerData?.direccion,
          email: newTallerData?.email,
          nombre: newTallerData?.nombre_taller,
          pais: newTallerData?.estado,
          telefono: newTallerData?.telefono,
          logo: '',
          hora_apertura: '08:00',
          hora_cierre: '17:00'
        })
        await supabase.from('usuarios_taller').insert([{ user_id: data?.user?.id, taller_id: taller.id }])
        await supabase.from("solicitudes_talleres").insert({ ...newTallerData, user_auth_id: data?.user?.id })
        await supabase.from('perfil_usuario').insert([{ auth_id: data?.user?.id, nombre, apellido, telefono, correo: email, estado: true, taller_id: taller.id, rol_id: 3, role: 'taller' }])
      }
      const userId = data.user?.id
      if (!userId) {
        return { success: false, error: "No se pudo obtener el ID del usuario" }
      }

      // 2. Obtener ID del rol
      const { data: rolData, error: rolError } = await supabase
        .from("roles")
        .select("id")
        .eq("nombre", 'taller')
        .single()

      if (rolError || !rolData) {
        console.error("Error al obtener rol:", rolError?.message)
        return { success: false, error: "Rol no válido o no encontrado" }
      }

      const rolId = rolData.id

      // 3. Insertar en roles_usuario
      const { error: insertError } = await supabase
        .from("roles_usuario")
        .insert([{ user_id: userId, rol_id: rolId }])

      if (insertError) {
        console.error("Error al insertar en roles_usuario:", insertError.message)
        return { success: false, error: "No se pudo asignar el rol al usuario" }
      }

      return { success: true, error: null }
    } catch (err: any) {
      console.error("Error inesperado en signUp:", err)
      return { success: false, error: "Error inesperado en el registro" }
    }
  }
  const signUp = async (
    email: string,
    password: string,
    role: string,
    taller_id?: string,
    nombre?: string,
    apellido?: string,
    telefono?: string

  ): Promise<{ error: string | null }> => {
    try {
      // 1. Crear el usuario

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role }, // metadata opcional
        },
      })
      if (error) {
        return { error: error.message }
      }


      await supabase.from('perfil_usuario').insert([{ auth_id: data?.user?.id, nombre, apellido, telefono, correo: email, estado: true }])

      if (error) {
        console.error("Error en signUp:", error.message)
        return { error: error.message }
      }

      const userId = data.user?.id
      if (!userId) {
        return { error: "No se pudo obtener el ID del usuario" }
      }

      // 2. Obtener ID del rol
      const { data: rolData, error: rolError } = await supabase
        .from("roles")
        .select("id")
        .eq("nombre", role)
        .single()

      if (rolError || !rolData) {
        console.error("Error al obtener rol:", rolError?.message)
        return { error: "Rol no válido o no encontrado" }
      }

      const rolId = rolData.id

      // 3. Insertar en roles_usuario
      const { error: insertError } = await supabase
        .from("roles_usuario")
        .insert([{ user_id: userId, rol_id: rolId }])

      if (insertError) {
        console.error("Error al insertar en roles_usuario:", insertError.message)
        return { error: "No se pudo asignar el rol al usuario" }
      }

      return null
    } catch (err: any) {
      console.error("Error inesperado en signUp:", err)
      return { error: "Error inesperado en el registro" }
    }
  }

  const value = {
    user,
    session,
    loading,
    signOut,
    signUp,
    signUpTaller,
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

