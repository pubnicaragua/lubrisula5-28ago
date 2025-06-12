import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin-client"

export async function GET() {
  try {
    // 1. Verificar si la tabla roles existe y crearla con el tipo correcto
    const { error: tableCheckError } = await supabaseAdmin.rpc("execute_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS roles (
          id BIGSERIAL PRIMARY KEY,
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
          id BIGSERIAL PRIMARY KEY,
          user_id UUID NOT NULL,
          rol_id BIGINT NOT NULL REFERENCES roles(id),
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

    // 2. Insertar roles básicos usando SQL directo con BIGSERIAL
    const { error: insertRolesError } = await supabaseAdmin.rpc("execute_sql", {
      sql_query: `
        INSERT INTO roles (nombre, descripcion, created_at, updated_at)
        VALUES 
          ('superadmin', 'Acceso completo a todas las funcionalidades del sistema', NOW(), NOW()),
          ('admin', 'Administrador del sistema con acceso a la mayoría de funcionalidades', NOW(), NOW()),
          ('taller', 'Usuario de taller con acceso a funcionalidades de reparación y mantenimiento', NOW(), NOW()),
          ('aseguradora', 'Usuario de aseguradora con acceso a cotizaciones y seguimiento', NOW(), NOW()),
          ('cliente', 'Cliente con acceso limitado a sus vehículos y cotizaciones', NOW(), NOW())
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
