"use server"
import { revalidatePath } from "next/cache"
import { supabaseAdmin } from "@/lib/supabase/admin-client" // Importación correcta de supabaseAdmin

// Tipo para el usuario
export type UserWithDetails = {
  id: string
  email: string
  role: {
    id: number
    nombre: string
  }
  profile: {
    nombre: string
    apellido: string
    telefono: string
  } | null
  created_at: string
  last_sign_in_at: string | null
  is_active: boolean
}

// Obtener todos los usuarios
export async function getUsers() {
  try {
    // Usar supabaseAdmin que ya está configurado correctamente
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers()

    if (authError) {
      throw authError
    }

    // Obtener roles de usuarios
    const { data: userRoles, error: rolesError } = await supabaseAdmin
      .from("roles_usuario")
      .select("user_id, rol_id, roles(id, nombre)")

    if (rolesError) {
      throw rolesError
    }

    // Obtener perfiles de usuarios
    const { data: userProfiles, error: profilesError } = await supabaseAdmin
      .from("perfil_usuario")
      .select("auth_id, nombre, apellido, telefono")

    if (profilesError) {
      throw profilesError
    }

    // Combinar datos
    const combinedUsers = authUsers.users.map((user) => {
      const userRole = userRoles?.find((role) => role.user_id === user.id)
      const userProfile = userProfiles?.find((profile) => profile.auth_id === user.id)

      return {
        id: user.id,
        email: user.email,
        role: userRole?.roles || { id: 0, nombre: "Sin rol" },
        profile: userProfile || null,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        is_active: !user.banned_until,
      }
    })

    return { success: true, data: combinedUsers }
  } catch (error) {
    console.error("Error al obtener usuarios:", error)
    return {
      success: false,
      error: (error as Error).message,
      data: [],
    }
  }
}

// Eliminar un usuario
export async function deleteUser(userId: string) {
  try {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (error) {
      throw error
    }

    revalidatePath("/admin/usuarios")
    return { success: true }
  } catch (error) {
    console.error("Error al eliminar usuario:", error)
    return {
      success: false,
      error: (error as Error).message,
    }
  }
}

// Cambiar estado de un usuario (activar/desactivar)
export async function toggleUserStatus(userId: string, isCurrentlyActive: boolean) {
  try {
    if (isCurrentlyActive) {
      // Desactivar usuario
      const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        banned_until: "2100-01-01T00:00:00Z",
      })

      if (error) throw error
    } else {
      // Activar usuario
      const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, { banned_until: null })

      if (error) throw error
    }

    revalidatePath("/admin/usuarios")
    return { success: true }
  } catch (error) {
    console.error("Error al cambiar estado del usuario:", error)
    return {
      success: false,
      error: (error as Error).message,
    }
  }
}

// Enviar correo de restablecimiento de contraseña
export async function sendPasswordResetEmail(email: string, redirectUrl: string) {
  try {
    const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    })

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Error al enviar correo de restablecimiento:", error)
    return {
      success: false,
      error: (error as Error).message,
    }
  }
}
