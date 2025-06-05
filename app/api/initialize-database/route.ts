import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    console.log("Iniciando proceso de inicialización de la base de datos...")

    // Crear cliente de Supabase con la clave de servicio
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    )

    // Verificar conexión
    const { data: connectionTest, error: connectionError } = await supabase.from("_test").select("*").limit(1)
    if (connectionError && !connectionError.message.includes('relation "_test" does not exist')) {
      throw new Error(`Error de conexión: ${connectionError.message}`)
    }

    console.log("Conexión exitosa con Supabase")

    // Lista de tablas a crear
    const tablas = [
      {
        name: "clients",
        query: `
          CREATE TABLE IF NOT EXISTS clients (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            nombre TEXT NOT NULL,
            apellido TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            telefono TEXT,
            direccion TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `,
      },
      {
        name: "vehicles",
        query: `
          CREATE TABLE IF NOT EXISTS vehicles (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
            marca TEXT NOT NULL,
            modelo TEXT NOT NULL,
            ano INTEGER NOT NULL,
            color TEXT,
            placa TEXT NOT NULL UNIQUE,
            vin TEXT,
            kilometraje INTEGER,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `,
      },
      {
        name: "quotations",
        query: `
          CREATE TABLE IF NOT EXISTS quotations (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
            vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
            fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            estado TEXT DEFAULT 'pendiente', -- pendiente, aprobada, rechazada, completada
            total DECIMAL(12,2) DEFAULT 0,
            descripcion TEXT,
            notas TEXT
          );
        `,
      },
      {
        name: "quotation_parts",
        query: `
          CREATE TABLE IF NOT EXISTS quotation_parts (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            quotation_id UUID REFERENCES quotations(id) ON DELETE CASCADE,
            descripcion TEXT NOT NULL,
            cantidad INTEGER NOT NULL,
            precio_unitario DECIMAL(12,2) NOT NULL,
            subtotal DECIMAL(12,2) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `,
      },
      {
        name: "orders",
        query: `
          CREATE TABLE IF NOT EXISTS orders (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            quotation_id UUID REFERENCES quotations(id) ON DELETE SET NULL,
            client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
            vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
            fecha_inicio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            fecha_estimada_fin TIMESTAMP WITH TIME ZONE,
            fecha_real_fin TIMESTAMP WITH TIME ZONE,
            estado TEXT DEFAULT 'en_progreso', -- en_progreso, completada, cancelada
            total DECIMAL(12,2) DEFAULT 0,
            descripcion TEXT,
            notas TEXT
          );
        `,
      },
      {
        name: "order_parts",
        query: `
          CREATE TABLE IF NOT EXISTS order_parts (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
            descripcion TEXT NOT NULL,
            cantidad INTEGER NOT NULL,
            precio_unitario DECIMAL(12,2) NOT NULL,
            subtotal DECIMAL(12,2) NOT NULL,
            estado TEXT DEFAULT 'pendiente', -- pendiente, en_proceso, completada
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `,
      },
      {
        name: "inventory_categories",
        query: `
          CREATE TABLE IF NOT EXISTS inventory_categories (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            nombre TEXT NOT NULL UNIQUE,
            descripcion TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `,
      },
      {
        name: "inventory",
        query: `
          CREATE TABLE IF NOT EXISTS inventory (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            category_id UUID REFERENCES inventory_categories(id) ON DELETE SET NULL,
            nombre TEXT NOT NULL,
            descripcion TEXT,
            codigo TEXT UNIQUE,
            cantidad INTEGER NOT NULL DEFAULT 0,
            precio_compra DECIMAL(12,2),
            precio_venta DECIMAL(12,2),
            ubicacion TEXT,
            punto_reorden INTEGER DEFAULT 5,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `,
      },
      {
        name: "kanban_columns",
        query: `
          CREATE TABLE IF NOT EXISTS kanban_columns (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            titulo TEXT NOT NULL,
            orden INTEGER NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `,
      },
      {
        name: "kanban_cards",
        query: `
          CREATE TABLE IF NOT EXISTS kanban_cards (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            column_id UUID REFERENCES kanban_columns(id) ON DELETE CASCADE,
            order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
            titulo TEXT NOT NULL,
            descripcion TEXT,
            fecha_vencimiento TIMESTAMP WITH TIME ZONE,
            prioridad TEXT DEFAULT 'normal', -- baja, normal, alta, urgente
            orden INTEGER NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `,
      },
      {
        name: "invoices",
        query: `
          CREATE TABLE IF NOT EXISTS invoices (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
            client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
            numero_factura TEXT UNIQUE,
            fecha_emision TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            fecha_vencimiento TIMESTAMP WITH TIME ZONE,
            subtotal DECIMAL(12,2) NOT NULL,
            impuesto DECIMAL(12,2) DEFAULT 0,
            total DECIMAL(12,2) NOT NULL,
            pagado BOOLEAN DEFAULT FALSE,
            estado TEXT DEFAULT 'pendiente', -- pendiente, pagada, anulada, vencida
            notas TEXT
          );
        `,
      },
      {
        name: "payments",
        query: `
          CREATE TABLE IF NOT EXISTS payments (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
            fecha_pago TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            monto DECIMAL(12,2) NOT NULL,
            metodo_pago TEXT NOT NULL, -- efectivo, tarjeta, transferencia
            referencia TEXT,
            notas TEXT
          );
        `,
      },
      {
        name: "roles",
        query: `
          CREATE TABLE IF NOT EXISTS roles (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            nombre TEXT NOT NULL UNIQUE,
            descripcion TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `,
      },
      {
        name: "roles_usuario",
        query: `
          CREATE TABLE IF NOT EXISTS roles_usuario (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(user_id, role_id)
          );
        `,
      },
    ]

    // Crear extensión UUID si no existe
    console.log("Creando extensión UUID...")
    await supabase.rpc("create_uuid_extension").catch((error) => {
      console.log("Extensión UUID ya existe o no se pudo crear:", error.message)
    })

    // Crear tablas
    for (const tabla of tablas) {
      console.log(`Creando tabla ${tabla.name}...`)
      try {
        // Intentar ejecutar la consulta directamente
        const { error } = await supabase.rpc("execute_sql", { sql: tabla.query })

        if (error) {
          console.error(`Error al crear tabla ${tabla.name}:`, error)
          // Si hay error, intentar otro método
          const { error: error2 } = await supabase.rpc("create_table", { tabla_nombre: tabla.name })
          if (error2 && !error2.message.includes("already exists")) {
            console.error(`Error al usar create_table para ${tabla.name}:`, error2)
          }
        }
      } catch (err) {
        console.error(`Error en la tabla ${tabla.name}:`, err)
      }
    }

    // Insertar roles básicos
    const roles = [
      { nombre: "superadmin", descripcion: "Super Administrador con permisos completos" },
      { nombre: "admin", descripcion: "Administrador del sistema" },
      { nombre: "taller", descripcion: "Usuario de taller" },
      { nombre: "aseguradora", descripcion: "Usuario de aseguradora" },
      { nombre: "cliente", descripcion: "Cliente del taller" },
    ]

    console.log("Insertando roles básicos...")
    for (const rol of roles) {
      const { error } = await supabase.from("roles").upsert([rol], { onConflict: "nombre" })

      if (error) {
        console.error(`Error al insertar rol ${rol.nombre}:`, error)
      }
    }

    console.log("Base de datos inicializada correctamente")

    return NextResponse.json({
      success: true,
      message: "Base de datos inicializada correctamente",
      details: {
        tablas: tablas.map((t) => t.name),
      },
    })
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error al inicializar la base de datos",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
