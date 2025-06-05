import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"

export async function GET() {
  try {
    // Crear cliente de Supabase con la clave de servicio para acceso administrativo
    const supabaseAdmin = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    )

    // 1. Verificar si la tabla roles existe
    const { data: rolesTableExists, error: tableCheckError } = await supabaseAdmin.from("roles").select("id").limit(1)

    if (tableCheckError) {
      // La tabla no existe, necesitamos crearla
      const createRolesTableSQL = `
        CREATE TABLE IF NOT EXISTS roles (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          nombre VARCHAR(50) NOT NULL UNIQUE,
          descripcion TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `

      await supabaseAdmin.rpc("execute_sql", { sql_query: createRolesTableSQL })

      // Crear tabla roles_usuario
      const createRolesUsuarioTableSQL = `
        CREATE TABLE IF NOT EXISTS roles_usuario (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL,
          role_id UUID NOT NULL REFERENCES roles(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(user_id, role_id)
        );
      `

      await supabaseAdmin.rpc("execute_sql", { sql_query: createRolesUsuarioTableSQL })

      // Crear índices
      const createIndicesSQL = `
        CREATE INDEX IF NOT EXISTS idx_roles_usuario_user_id ON roles_usuario(user_id);
        CREATE INDEX IF NOT EXISTS idx_roles_usuario_role_id ON roles_usuario(role_id);
      `

      await supabaseAdmin.rpc("execute_sql", { sql_query: createIndicesSQL })
    }

    // 2. Insertar roles básicos
    const roles = [
      { nombre: "superadmin", descripcion: "Acceso completo a todas las funcionalidades del sistema" },
      { nombre: "admin", descripcion: "Administrador del sistema con acceso a la mayoría de funcionalidades" },
      { nombre: "taller", descripcion: "Usuario de taller con acceso a funcionalidades de reparación y mantenimiento" },
      { nombre: "aseguradora", descripcion: "Usuario de aseguradora con acceso a cotizaciones y seguimiento" },
      { nombre: "cliente", descripcion: "Cliente con acceso limitado a sus vehículos y cotizaciones" },
    ]

    for (const role of roles) {
      const { error: insertError } = await supabaseAdmin.from("roles").upsert(role, { onConflict: "nombre" })

      if (insertError) {
        console.error(`Error al insertar rol ${role.nombre}:`, insertError)
      }
    }

    // 3. Sincronizar usuarios existentes con sus roles
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers()

    if (authError) {
      throw new Error(`Error al obtener usuarios de Auth: ${authError.message}`)
    }

    // Obtener todos los roles para mapear nombres a IDs
    const { data: rolesData, error: rolesError } = await supabaseAdmin.from("roles").select("id, nombre")

    if (rolesError) {
      throw new Error(`Error al obtener roles: ${rolesError.message}`)
    }

    const roleMap = new Map(rolesData.map((role) => [role.nombre, role.id]))

    // Obtener usuarios existentes en roles_usuario
    const { data: existingRoleUsers, error: existingError } = await supabaseAdmin
      .from("roles_usuario")
      .select("user_id, role_id")

    if (existingError) {
      throw new Error(`Error al obtener roles de usuario existentes: ${existingError.message}`)
    }

    const existingUserIds = new Set(existingRoleUsers.map((ru) => ru.user_id))

    // Sincronizar roles para cada usuario
    const rolesToInsert = []

    for (const user of authUsers.users) {
      // Si el usuario ya tiene un rol asignado en la tabla, omitirlo
      if (existingUserIds.has(user.id)) {
        continue
      }

      // Obtener el rol de los metadatos del usuario o asignar 'cliente' por defecto
      const userRole = (user.user_metadata?.role || "cliente").toLowerCase()

      // Obtener el ID del rol correspondiente
      const roleId = roleMap.get(userRole)

      if (roleId) {
        rolesToInsert.push({
          user_id: user.id,
          role_id: roleId,
          created_at: new Date().toISOString(),
        })
      } else {
        console.warn(`Rol "${userRole}" no encontrado para usuario ${user.id}`)
      }
    }

    // Insertar nuevos registros de roles de usuario
    if (rolesToInsert.length > 0) {
      const { error: insertError } = await supabaseAdmin.from("roles_usuario").insert(rolesToInsert)

      if (insertError) {
        throw new Error(`Error al insertar roles de usuario: ${insertError.message}`)
      }
    }

    return NextResponse.json({
      success: true,
      message: "Inicialización de roles completada con éxito",
      details: {
        rolesCreated: roles.length,
        usersProcessed: authUsers.users.length,
        rolesAssigned: rolesToInsert.length,
      },
    })
  } catch (error) {
    console.error("Error en la inicialización de roles:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Error desconocido en la inicialización de roles",
      },
      { status: 500 },
    )
  }
}
