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
          error: "Variables de entorno no configuradas",
        },
        { status: 500 },
      )
    }

    // Crear cliente de Supabase con la clave de servicio
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // SQL para crear todas las tablas
    const sql = `
    -- Habilitar extensión UUID si no está habilitada
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    -- Crear tabla de roles
    CREATE TABLE IF NOT EXISTS roles (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      nombre TEXT NOT NULL UNIQUE,
      descripcion TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Insertar roles básicos
    INSERT INTO roles (nombre, descripcion) VALUES
      ('admin', 'Administrador del sistema'),
      ('taller', 'Usuario de taller'),
      ('cliente', 'Cliente del taller'),
      ('aseguradora', 'Usuario de aseguradora'),
      ('superadmin', 'Super administrador')
    ON CONFLICT (nombre) DO NOTHING;

    -- Crear tabla de roles_usuario
    CREATE TABLE IF NOT EXISTS roles_usuario (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
      rol_id UUID REFERENCES roles(id) ON DELETE CASCADE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(user_id, rol_id)
    );

    -- Crear tabla de clientes
    CREATE TABLE IF NOT EXISTS clients (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
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
      client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
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
      user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
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
      user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
      nombre TEXT NOT NULL,
      direccion TEXT,
      nivel_servicio TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Crear tabla de cotizaciones
    CREATE TABLE IF NOT EXISTS quotations (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
      vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
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
      quotation_id UUID REFERENCES quotations(id) ON DELETE CASCADE,
      descripcion TEXT NOT NULL,
      cantidad INTEGER NOT NULL,
      precio_unitario DECIMAL(12,2) NOT NULL,
      subtotal DECIMAL(12,2) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Crear tabla de órdenes
    CREATE TABLE IF NOT EXISTS orders (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      quotation_id UUID REFERENCES quotations(id) ON DELETE SET NULL,
      client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
      vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
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
      order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
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
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Insertar columnas Kanban predeterminadas
    INSERT INTO kanban_columns (title, description, color, position) VALUES
      ('Por Hacer', 'Tareas pendientes', '#1890ff', 1),
      ('En Progreso', 'Tareas en curso', '#faad14', 2),
      ('En Revisión', 'Tareas en revisión', '#722ed1', 3),
      ('Completado', 'Tareas finalizadas', '#52c41a', 4)
    ON CONFLICT DO NOTHING;

    -- Crear tabla de tarjetas Kanban
    CREATE TABLE IF NOT EXISTS kanban_cards (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      column_id UUID REFERENCES kanban_columns(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT,
      client_name TEXT,
      vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
      priority TEXT DEFAULT 'normal',
      position INTEGER DEFAULT 0,
      created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      due_date TIMESTAMP WITH TIME ZONE
    );

    -- Crear políticas RLS para permitir acceso a las tablas
    -- Política para roles
    ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Permitir acceso a roles para usuarios autenticados" ON roles
      FOR ALL USING (auth.role() = 'authenticated');

    -- Política para roles_usuario
    ALTER TABLE roles_usuario ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Permitir acceso a roles_usuario para usuarios autenticados" ON roles_usuario
      FOR ALL USING (auth.role() = 'authenticated');

    -- Política para clients
    ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Permitir acceso a clients para usuarios autenticados" ON clients
      FOR ALL USING (auth.role() = 'authenticated');

    -- Política para vehicles
    ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Permitir acceso a vehicles para usuarios autenticados" ON vehicles
      FOR ALL USING (auth.role() = 'authenticated');

    -- Política para talleres
    ALTER TABLE talleres ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Permitir acceso a talleres para usuarios autenticados" ON talleres
      FOR ALL USING (auth.role() = 'authenticated');

    -- Política para aseguradoras
    ALTER TABLE aseguradoras ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Permitir acceso a aseguradoras para usuarios autenticados" ON aseguradoras
      FOR ALL USING (auth.role() = 'authenticated');

    -- Política para quotations
    ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Permitir acceso a quotations para usuarios autenticados" ON quotations
      FOR ALL USING (auth.role() = 'authenticated');

    -- Política para quotation_parts
    ALTER TABLE quotation_parts ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Permitir acceso a quotation_parts para usuarios autenticados" ON quotation_parts
      FOR ALL USING (auth.role() = 'authenticated');

    -- Política para orders
    ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Permitir acceso a orders para usuarios autenticados" ON orders
      FOR ALL USING (auth.role() = 'authenticated');

    -- Política para order_details
    ALTER TABLE order_details ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Permitir acceso a order_details para usuarios autenticados" ON order_details
      FOR ALL USING (auth.role() = 'authenticated');

    -- Política para materiales
    ALTER TABLE materiales ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Permitir acceso a materiales para usuarios autenticados" ON materiales
      FOR ALL USING (auth.role() = 'authenticated');

    -- Política para kanban_columns
    ALTER TABLE kanban_columns ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Permitir acceso a kanban_columns para usuarios autenticados" ON kanban_columns
      FOR ALL USING (auth.role() = 'authenticated');

    -- Política para kanban_cards
    ALTER TABLE kanban_cards ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Permitir acceso a kanban_cards para usuarios autenticados" ON kanban_cards
      FOR ALL USING (auth.role() = 'authenticated');

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
    `

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

    // Asignar usuarios a roles
    const assignUsersSQL = `
    -- Asignar usuarios a roles
    DO $$
    DECLARE
      user_id_1 UUID;
      user_id_2 UUID;
      admin_role_id UUID;
    BEGIN
      -- Obtener IDs de usuarios
      SELECT id INTO user_id_1 FROM auth.users WHERE email = 'dxgabalt@gmail.com';
      SELECT id INTO user_id_2 FROM auth.users WHERE email = 'dxgabalt2@gmail.com';
      
      -- Obtener ID del rol admin
      SELECT id INTO admin_role_id FROM public.roles WHERE nombre = 'admin';
      
      -- Asignar usuarios al rol admin
      IF user_id_1 IS NOT NULL AND admin_role_id IS NOT NULL THEN
        INSERT INTO public.roles_usuario (user_id, rol_id)
        VALUES (user_id_1, admin_role_id)
        ON CONFLICT (user_id, rol_id) DO NOTHING;
      END IF;
      
      IF user_id_2 IS NOT NULL AND admin_role_id IS NOT NULL THEN
        INSERT INTO public.roles_usuario (user_id, rol_id)
        VALUES (user_id_2, admin_role_id)
        ON CONFLICT (user_id, rol_id) DO NOTHING;
      END IF;
      
      -- Actualizar metadatos de usuario
      UPDATE auth.users
      SET raw_user_meta_data = jsonb_set(
        COALESCE(raw_user_meta_data, '{}'::jsonb),
        '{role}',
        '"admin"'
      )
      WHERE email IN ('dxgabalt@gmail.com', 'dxgabalt2@gmail.com');
    END $$;
    `

    const { error: assignError } = await supabase.rpc("execute_sql", { sql_query: assignUsersSQL })

    if (assignError) {
      return NextResponse.json(
        {
          success: false,
          error: "Error al asignar usuarios a roles",
          details: assignError.message,
        },
        { status: 500 },
      )
    }

    // Insertar datos de ejemplo
    const sampleDataSQL = `
    -- Insertar cliente de ejemplo
    INSERT INTO clients (name, phone, email, client_type)
    VALUES ('Cliente Demo', '123456789', 'cliente@demo.com', 'Individual')
    ON CONFLICT DO NOTHING;

    -- Obtener ID del cliente
    DO $$
    DECLARE
      client_id UUID;
    BEGIN
      SELECT id INTO client_id FROM clients WHERE name = 'Cliente Demo' LIMIT 1;
      
      -- Insertar vehículo de ejemplo
      IF client_id IS NOT NULL THEN
        INSERT INTO vehicles (client_id, marca, modelo, ano, color, placa)
        VALUES (client_id, 'Toyota', 'Corolla', 2020, 'Rojo', 'ABC123')
        ON CONFLICT DO NOTHING;
      END IF;
    END $$;

    -- Insertar materiales de ejemplo
    INSERT INTO materiales (nombre, descripcion, categoria, precio, stock, unidad)
    VALUES 
      ('Pintura Automotriz', 'Pintura de alta calidad', 'Pintura', 150.00, 20, 'Litro'),
      ('Lija Fina', 'Lija para acabados', 'Herramientas', 5.00, 100, 'Unidad'),
      ('Masilla', 'Masilla para reparaciones', 'Reparación', 25.00, 30, 'Kilo')
    ON CONFLICT DO NOTHING;
    `

    const { error: dataError } = await supabase.rpc("execute_sql", { sql_query: sampleDataSQL })

    if (dataError) {
      return NextResponse.json(
        {
          success: false,
          error: "Error al insertar datos de ejemplo",
          details: dataError.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Base de datos inicializada correctamente",
      details: {
        tablas: [
          "roles",
          "roles_usuario",
          "clients",
          "vehicles",
          "talleres",
          "aseguradoras",
          "quotations",
          "orders",
          "materiales",
          "kanban_columns",
        ],
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Error al inicializar la base de datos",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
