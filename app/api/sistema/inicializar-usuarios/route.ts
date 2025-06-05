import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST() {
  try {
    // Verificar que estamos usando las variables de entorno correctas
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Variables de entorno no configuradas",
        },
        { status: 500 },
      )
    }

    // Crear cliente de Supabase con la clave de servicio
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // SQL para asignar usuarios a roles
    const sql = `
    -- Asignar usuarios a roles (versión mejorada)
    DO $$
    DECLARE
      user_record RECORD;
      admin_role_id UUID;
      taller_role_id UUID;
      cliente_role_id UUID;
      aseguradora_role_id UUID;
      superadmin_role_id UUID;
      usuarios_actualizados INTEGER := 0;
    BEGIN
      -- Obtener IDs de roles
      SELECT id INTO admin_role_id FROM public.roles WHERE nombre = 'admin';
      SELECT id INTO taller_role_id FROM public.roles WHERE nombre = 'taller';
      SELECT id INTO cliente_role_id FROM public.roles WHERE nombre = 'cliente';
      SELECT id INTO aseguradora_role_id FROM public.roles WHERE nombre = 'aseguradora';
      SELECT id INTO superadmin_role_id FROM public.roles WHERE nombre = 'superadmin';
      
      -- Procesar todos los usuarios
      FOR user_record IN SELECT * FROM auth.users
      LOOP
        -- Determinar el rol basado en metadatos o asignar cliente por defecto
        DECLARE
          user_role TEXT;
          role_id UUID;
        BEGIN
          -- Extraer rol de metadatos o asignar cliente por defecto
          user_role := COALESCE(user_record.raw_user_meta_data->>'role', 'cliente');
          
          -- Normalizar el rol (convertir a minúsculas)
          user_role := LOWER(user_role);
          
          -- Asignar ID de rol según el nombre
          CASE user_role
            WHEN 'admin' THEN role_id := admin_role_id;
            WHEN 'taller' THEN role_id := taller_role_id;
            WHEN 'cliente' THEN role_id := cliente_role_id;
            WHEN 'aseguradora' THEN role_id := aseguradora_role_id;
            WHEN 'superadmin' THEN role_id := superadmin_role_id;
            ELSE role_id := cliente_role_id; -- Por defecto, asignar rol de cliente
          END CASE;
          
          -- Insertar en roles_usuario si no existe
          IF role_id IS NOT NULL THEN
            INSERT INTO public.roles_usuario (user_id, rol_id)
            VALUES (user_record.id, role_id)
            ON CONFLICT (user_id, rol_id) DO NOTHING;
            
            usuarios_actualizados := usuarios_actualizados + 1;
          END IF;
          
          -- Actualizar metadatos del usuario para asegurar consistencia
          UPDATE auth.users
          SET raw_user_meta_data = jsonb_set(
            COALESCE(raw_user_meta_data, '{}'::jsonb),
            '{role}',
            to_jsonb(user_role)
          )
          WHERE id = user_record.id;
        END;
      END LOOP;
      
      -- Asignar explícitamente usuarios específicos como admin
      UPDATE auth.users
      SET raw_user_meta_data = jsonb_set(
        COALESCE(raw_user_meta_data, '{}'::jsonb),
        '{role}',
        '"admin"'
      )
      WHERE email IN ('dxgabalt@gmail.com', 'dxgabalt2@gmail.com');
      
      -- Asignar rol admin a usuarios específicos
      IF admin_role_id IS NOT NULL THEN
        INSERT INTO public.roles_usuario (user_id, rol_id)
        SELECT u.id, admin_role_id
        FROM auth.users u
        WHERE u.email IN ('dxgabalt@gmail.com', 'dxgabalt2@gmail.com')
        ON CONFLICT (user_id, rol_id) DO NOTHING;
      END IF;
      
      RAISE NOTICE 'Usuarios actualizados: %', usuarios_actualizados;
    END $$;
    `

    // Ejecutar el SQL
    const { error } = await supabase.rpc("execute_sql", { sql_query: sql })

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: "Error al ejecutar SQL para asignar usuarios",
          details: error.message,
        },
        { status: 500 },
      )
    }

    // Contar usuarios con roles asignados
    const { count, error: countError } = await supabase
      .from("roles_usuario")
      .select("*", { count: "exact", head: true })

    if (countError) {
      return NextResponse.json({
        success: true,
        message: "Usuarios inicializados correctamente, pero no se pudo contar los registros",
        details: countError.message,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Usuarios inicializados correctamente",
      usuariosActualizados: count || 0,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Error al inicializar usuarios",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
