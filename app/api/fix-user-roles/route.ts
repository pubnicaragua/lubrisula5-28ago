import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  try {
    // Verificar que estamos usando las variables de entorno correctas
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        {
          success: false,
          message: "Variables de entorno no configuradas",
        },
        { status: 500 },
      )
    }

    // Crear cliente de Supabase con la clave de servicio
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // SQL para corregir roles de usuario
    const sql = `
    -- Asignar roles a usuarios que no tienen roles asignados
    DO $$
    DECLARE
      user_record RECORD;
      cliente_role_id UUID;
      admin_role_id UUID;
      usuarios_corregidos INTEGER := 0;
    BEGIN
      -- Obtener IDs de roles
      SELECT id INTO cliente_role_id FROM public.roles WHERE nombre = 'cliente';
      SELECT id INTO admin_role_id FROM public.roles WHERE nombre = 'admin';
      
      -- Verificar si los roles existen
      IF cliente_role_id IS NULL THEN
        RAISE EXCEPTION 'El rol "cliente" no existe en la tabla roles';
      END IF;
      
      IF admin_role_id IS NULL THEN
        RAISE EXCEPTION 'El rol "admin" no existe en la tabla roles';
      END IF;
      
      -- Procesar usuarios sin roles asignados
      FOR user_record IN 
        SELECT 
          u.id, 
          u.email, 
          u.raw_user_meta_data->>'role' as metadata_role
        FROM 
          auth.users u
        LEFT JOIN 
          public.roles_usuario ru ON u.id = ru.user_id
        WHERE 
          ru.id IS NULL
      LOOP
        -- Determinar qué rol asignar
        DECLARE
          role_id UUID;
        BEGIN
          -- Si el usuario tiene 'admin' en sus metadatos, asignar rol admin
          IF user_record.metadata_role = 'admin' OR user_record.metadata_role = 'superadmin' THEN
            role_id := admin_role_id;
          ELSE
            -- Por defecto, asignar rol cliente
            role_id := cliente_role_id;
          END IF;
          
          -- Insertar en roles_usuario
          INSERT INTO public.roles_usuario (user_id, rol_id)
          VALUES (user_record.id, role_id);
          
          usuarios_corregidos := usuarios_corregidos + 1;
        END;
      END LOOP;
      
      -- Asignar explícitamente rol admin a usuarios específicos
      UPDATE auth.users
      SET raw_user_meta_data = jsonb_set(
        COALESCE(raw_user_meta_data, '{}'::jsonb),
        '{role}',
        '"admin"'
      )
      WHERE email IN ('dxgabalt@gmail.com', 'dxgabalt2@gmail.com');
      
      -- Asignar rol admin a usuarios específicos en roles_usuario
      IF admin_role_id IS NOT NULL THEN
        WITH inserted AS (
          INSERT INTO public.roles_usuario (user_id, rol_id)
          SELECT u.id, admin_role_id
          FROM auth.users u
          WHERE u.email IN ('dxgabalt@gmail.com', 'dxgabalt2@gmail.com')
          ON CONFLICT (user_id, rol_id) DO NOTHING
          RETURNING 1
        )
        SELECT COUNT(*) INTO usuarios_corregidos FROM inserted;
      END IF;
      
      RAISE NOTICE 'Usuarios corregidos: %', usuarios_corregidos;
    END $$;
    `

    // Ejecutar el SQL
    const { error } = await supabase.rpc("execute_sql", { sql_query: sql })

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Error al ejecutar SQL para corregir roles",
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
        message: "Roles de usuario corregidos, pero no se pudo contar los registros",
        details: countError.message,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Roles de usuario corregidos correctamente",
      usuariosConRoles: count || 0,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error al corregir roles de usuario",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
