import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  try {
    const options = await request.json()

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

    // SQL para crear todas las tablas
    let sql = `
    -- Habilitar extensión UUID si no está habilitada
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `

    // Crear tablas si la opción está habilitada
    if (options.crearTablas) {
      sql += `
      -- Crear tabla de roles
      CREATE TABLE IF NOT EXISTS roles (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        nombre TEXT NOT NULL,
        descripcion TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        CONSTRAINT roles_nombre_key UNIQUE (nombre)
      );

      -- Crear tabla de roles_usuario
      CREATE TABLE IF NOT EXISTS roles_usuario (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL,
        rol_id UUID NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        CONSTRAINT roles_usuario_user_rol_key UNIQUE (user_id, rol_id)
      );

      -- Crear tabla de clientes
      CREATE TABLE IF NOT EXISTS clients (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID,
        name TEXT NOT NULL,
        company TEXT,
        phone TEXT,
        email TEXT,
        client_type TEXT DEFAULT 'Individual',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Crear tabla de vehículos
      CREATE TABLE IF NOT EXISTS vehicles (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        client_id UUID,
        marca TEXT NOT NULL,
        modelo TEXT NOT NULL,
        ano INTEGER,
        color TEXT,
        placa TEXT,
        vin TEXT,
        kilometraje INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Crear tabla de talleres
      CREATE TABLE IF NOT EXISTS talleres (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID,
        nombre TEXT NOT NULL,
        direccion TEXT,
        especialidades TEXT[],
        descripcion TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Crear tabla de aseguradoras
      CREATE TABLE IF NOT EXISTS aseguradoras (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID,
        nombre TEXT NOT NULL,
        direccion TEXT,
        nivel_servicio TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Crear tabla de cotizaciones
      CREATE TABLE IF NOT EXISTS quotations (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        client_id UUID,
        vehicle_id UUID,
        fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        estado TEXT DEFAULT 'pendiente',
        total DECIMAL(12,2) DEFAULT 0,
        descripcion TEXT,
        notas TEXT
      );

      -- Crear tabla de partes de cotización
      CREATE TABLE IF NOT EXISTS quotation_parts (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        quotation_id UUID,
        descripcion TEXT NOT NULL,
        cantidad INTEGER NOT NULL,
        precio_unitario DECIMAL(12,2) NOT NULL,
        subtotal DECIMAL(12,2) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Crear tabla de órdenes
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        quotation_id UUID,
        client_id UUID,
        vehicle_id UUID,
        fecha_inicio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        fecha_estimada_fin TIMESTAMP WITH TIME ZONE,
        fecha_real_fin TIMESTAMP WITH TIME ZONE,
        estado TEXT DEFAULT 'en_progreso',
        total DECIMAL(12,2) DEFAULT 0,
        descripcion TEXT,
        notas TEXT
      );

      -- Crear tabla de detalles de orden
      CREATE TABLE IF NOT EXISTS order_details (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        order_id UUID,
        descripcion TEXT NOT NULL,
        cantidad INTEGER NOT NULL,
        precio_unitario DECIMAL(12,2) NOT NULL,
        subtotal DECIMAL(12,2) NOT NULL,
        estado TEXT DEFAULT 'pendiente',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Crear tabla de materiales
      CREATE TABLE IF NOT EXISTS materiales (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        nombre TEXT NOT NULL,
        descripcion TEXT,
        categoria TEXT,
        precio DECIMAL(12,2) DEFAULT 0,
        stock INTEGER DEFAULT 0,
        unidad TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Crear tabla de columnas Kanban
      CREATE TABLE IF NOT EXISTS kanban_columns (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title TEXT NOT NULL,
        description TEXT,
        color TEXT DEFAULT '#1890ff',
        position INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Crear tabla de tarjetas Kanban
      CREATE TABLE IF NOT EXISTS kanban_cards (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        column_id UUID,
        title TEXT NOT NULL,
        description TEXT,
        client_name TEXT,
        vehicle_id UUID,
        priority TEXT DEFAULT 'normal',
        position INTEGER DEFAULT 0,
        created_by UUID,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        due_date TIMESTAMP WITH TIME ZONE
      );

      -- Añadir restricciones de clave foránea después de crear todas las tablas
      ALTER TABLE roles_usuario 
        ADD CONSTRAINT roles_usuario_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
        ADD CONSTRAINT roles_usuario_rol_id_fkey FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE CASCADE;

      ALTER TABLE vehicles 
        ADD CONSTRAINT vehicles_client_id_fkey FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

      ALTER TABLE quotation_parts 
        ADD CONSTRAINT quotation_parts_quotation_id_fkey FOREIGN KEY (quotation_id) REFERENCES quotations(id) ON DELETE CASCADE;

      ALTER TABLE order_details 
        ADD CONSTRAINT order_details_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;

      ALTER TABLE kanban_cards 
        ADD CONSTRAINT kanban_cards_column_id_fkey FOREIGN KEY (column_id) REFERENCES kanban_columns(id) ON DELETE CASCADE;
      `
    }

    // Crear roles si la opción está habilitada
    if (options.crearRoles) {
      sql += `
      -- Insertar roles básicos
      INSERT INTO roles (nombre, descripcion) 
      VALUES 
        ('admin', 'Administrador del sistema'),
        ('taller', 'Usuario de taller'),
        ('cliente', 'Cliente del taller'),
        ('aseguradora', 'Usuario de aseguradora'),
        ('superadmin', 'Super administrador')
      ON CONFLICT (nombre) DO NOTHING;

      -- Insertar columnas Kanban predeterminadas
      INSERT INTO kanban_columns (id, title, description, color, position)
      VALUES 
        (uuid_generate_v4(), 'Por Hacer', 'Tareas pendientes', '#1890ff', 1),
        (uuid_generate_v4(), 'En Progreso', 'Tareas en curso', '#faad14', 2),
        (uuid_generate_v4(), 'En Revisión', 'Tareas en revisión', '#722ed1', 3),
        (uuid_generate_v4(), 'Completado', 'Tareas finalizadas', '#52c41a', 4);
      `
    }

    // Configurar políticas RLS si la opción está habilitada
    if (options.politicasRLS) {
      sql += `
      -- Crear políticas RLS para permitir acceso a las tablas
      -- Política para roles
      ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
      CREATE POLICY IF NOT EXISTS "Permitir acceso a roles para usuarios autenticados" ON roles
        FOR ALL USING (auth.role() = 'authenticated');

      -- Política para roles_usuario
      ALTER TABLE roles_usuario ENABLE ROW LEVEL SECURITY;
      CREATE POLICY IF NOT EXISTS "Permitir acceso a roles_usuario para usuarios autenticados" ON roles_usuario
        FOR ALL USING (auth.role() = 'authenticated');

      -- Política para clients
      ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
      CREATE POLICY IF NOT EXISTS "Permitir acceso a clients para usuarios autenticados" ON clients
        FOR ALL USING (auth.role() = 'authenticated');

      -- Política para vehicles
      ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
      CREATE POLICY IF NOT EXISTS "Permitir acceso a vehicles para usuarios autenticados" ON vehicles
        FOR ALL USING (auth.role() = 'authenticated');

      -- Política para talleres
      ALTER TABLE talleres ENABLE ROW LEVEL SECURITY;
      CREATE POLICY IF NOT EXISTS "Permitir acceso a talleres para usuarios autenticados" ON talleres
        FOR ALL USING (auth.role() = 'authenticated');

      -- Política para aseguradoras
      ALTER TABLE aseguradoras ENABLE ROW LEVEL SECURITY;
      CREATE POLICY IF NOT EXISTS "Permitir acceso a aseguradoras para usuarios autenticados" ON aseguradoras
        FOR ALL USING (auth.role() = 'authenticated');

      -- Política para quotations
      ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
      CREATE POLICY IF NOT EXISTS "Permitir acceso a quotations para usuarios autenticados" ON quotations
        FOR ALL USING (auth.role() = 'authenticated');

      -- Política para quotation_parts
      ALTER TABLE quotation_parts ENABLE ROW LEVEL SECURITY;
      CREATE POLICY IF NOT EXISTS "Permitir acceso a quotation_parts para usuarios autenticados" ON quotation_parts
        FOR ALL USING (auth.role() = 'authenticated');

      -- Política para orders
      ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
      CREATE POLICY IF NOT EXISTS "Permitir acceso a orders para usuarios autenticados" ON orders
        FOR ALL USING (auth.role() = 'authenticated');

      -- Política para order_details
      ALTER TABLE order_details ENABLE ROW LEVEL SECURITY;
      CREATE POLICY IF NOT EXISTS "Permitir acceso a order_details para usuarios autenticados" ON order_details
        FOR ALL USING (auth.role() = 'authenticated');

      -- Política para materiales
      ALTER TABLE materiales ENABLE ROW LEVEL SECURITY;
      CREATE POLICY IF NOT EXISTS "Permitir acceso a materiales para usuarios autenticados" ON materiales
        FOR ALL USING (auth.role() = 'authenticated');

      -- Política para kanban_columns
      ALTER TABLE kanban_columns ENABLE ROW LEVEL SECURITY;
      CREATE POLICY IF NOT EXISTS "Permitir acceso a kanban_columns para usuarios autenticados" ON kanban_columns
        FOR ALL USING (auth.role() = 'authenticated');

      -- Política para kanban_cards
      ALTER TABLE kanban_cards ENABLE ROW LEVEL SECURITY;
      CREATE POLICY IF NOT EXISTS "Permitir acceso a kanban_cards para usuarios autenticados" ON kanban_cards
        FOR ALL USING (auth.role() = 'authenticated');
      `
    }

    // Crear funciones de BD si la opción está habilitada
    if (options.funcionesDB) {
      sql += `
      -- Crear función para verificar rol de usuario
      CREATE OR REPLACE FUNCTION public.user_has_role(role_name text)
      RETURNS boolean AS $$
      DECLARE
        has_role boolean;
      BEGIN
        SELECT EXISTS (
          SELECT 1
          FROM public.roles_usuario ru
          JOIN public.roles r ON ru.rol_id = r.id
          WHERE ru.user_id = auth.uid() AND r.nombre = role_name
        ) INTO has_role;
        
        RETURN has_role;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;

      -- Otorgar permisos para ejecutar la función
      GRANT EXECUTE ON FUNCTION public.user_has_role TO authenticated;
      GRANT EXECUTE ON FUNCTION public.user_has_role TO service_role;

      -- Crear función para obtener políticas de una tabla
      CREATE OR REPLACE FUNCTION public.get_policies_for_table(table_name text)
      RETURNS TABLE (
        policyname text,
        tablename text,
        schemaname text,
        operation text,
        permissive text,
        roles text,
        cmd text
      ) AS $$
      BEGIN
        RETURN QUERY
        SELECT
          p.policyname,
          p.tablename,
          p.schemaname,
          p.operation,
          p.permissive,
          p.roles::text,
          p.cmd
        FROM
          pg_policies p
        WHERE
          p.tablename = table_name;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;

      -- Otorgar permisos para ejecutar la función
      GRANT EXECUTE ON FUNCTION public.get_policies_for_table TO authenticated;
      GRANT EXECUTE ON FUNCTION public.get_policies_for_table TO service_role;
      `
    }

    // Ejecutar el SQL
    const { error } = await supabase.rpc("execute_sql", { sql_query: sql })

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: "Error al ejecutar SQL",
          details: error.message,
        },
        { status: 500 },
      )
    }

    // Contar tablas creadas
    const { data: tablesCount, error: countError } = await supabase.rpc("execute_sql", {
      sql_query: `
        SELECT COUNT(*) FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      `,
    })

    if (countError) {
      return NextResponse.json({
        success: true,
        message: "Estructura inicializada correctamente, pero no se pudo contar las tablas",
        details: countError.message,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Estructura inicializada correctamente",
      tablas: tablesCount?.[0]?.count || 0,
      opciones: options,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Error al inicializar estructura",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
