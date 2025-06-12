import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin-client"

export async function GET() {
  try {
    // 1. Verificar si la tabla roles existe
    const { error: tableCheckError } = await supabaseAdmin.rpc("execute_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS roles (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          nombre VARCHAR(50) NOT NULL UNIQUE,
          descripcion TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    if (tableCheckError) {
      throw new Error(`Error al crear tabla roles: ${tableCheckError.message}`)
    }

    // Crear tabla roles_usuario
    const { error: rolesUsuarioError } = await supabaseAdmin.rpc("execute_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS roles_usuario (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL,
          rol_id UUID NOT NULL REFERENCES roles(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(user_id, rol_id)
        );
      `,
    })

    if (rolesUsuarioError) {
      throw new Error(`Error al crear tabla roles_usuario: ${rolesUsuarioError.message}`)
    }

    // Crear índices
    const { error: indicesError } = await supabaseAdmin.rpc("execute_sql", {
      sql_query: `
        CREATE INDEX IF NOT EXISTS idx_roles_usuario_user_id ON roles_usuario(user_id);
        CREATE INDEX IF NOT EXISTS idx_roles_usuario_rol_id ON roles_usuario(rol_id);
      `,
    })

    if (indicesError) {
      throw new Error(`Error al crear índices: ${indicesError.message}`)
    }

    // 2. Insertar roles básicos usando SQL directo para evitar problemas de RLS
    const { error: insertRolesError } = await supabaseAdmin.rpc("execute_sql", {
      sql_query: `
        INSERT INTO roles (id, nombre, descripcion, created_at, updated_at)
        VALUES 
          (uuid_generate_v4(), 'superadmin', 'Acceso completo a todas las funcionalidades del sistema', NOW(), NOW()),
          (uuid_generate_v4(), 'admin', 'Administrador del sistema con acceso a la mayoría de funcionalidades', NOW(), NOW()),
          (uuid_generate_v4(), 'taller', 'Usuario de taller con acceso a funcionalidades de reparación y mantenimiento', NOW(), NOW()),
          (uuid_generate_v4(), 'aseguradora', 'Usuario de aseguradora con acceso a cotizaciones y seguimiento', NOW(), NOW()),
          (uuid_generate_v4(), 'cliente', 'Cliente con acceso limitado a sus vehículos y cotizaciones', NOW(), NOW())
        ON CONFLICT (nombre) DO NOTHING;
      `,
    })

    if (insertRolesError) {
      throw new Error(`Error al insertar roles básicos: ${insertRolesError.message}`)
    }

    return NextResponse.json({
      success: true,
      message: "Inicialización de roles completada con éxito",
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
