import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Crear tabla de procesos_taller si no existe
    await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS procesos_taller (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          nombre VARCHAR(100) NOT NULL,
          descripcion TEXT,
          tipo VARCHAR(50) NOT NULL,
          tiempo_estimado INTEGER,
          orden INTEGER,
          activo BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    // Crear tabla de materiales si no existe
    await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS materiales (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          proceso_id UUID REFERENCES procesos_taller(id) ON DELETE CASCADE,
          nombre VARCHAR(100) NOT NULL,
          unidad VARCHAR(20) NOT NULL,
          proveedor VARCHAR(100),
          precio_total DECIMAL(10,2) NOT NULL,
          cantidad DECIMAL(10,2) NOT NULL,
          precio_unitario DECIMAL(10,2) GENERATED ALWAYS AS (precio_total / NULLIF(cantidad, 0)) STORED,
          rendimiento_vehiculo DECIMAL(10,2),
          rendimiento_hora_reparar DECIMAL(10,2),
          rendimiento_hora_pintura DECIMAL(10,2),
          inventario_inicial DECIMAL(10,2) DEFAULT 0,
          inventario_final DECIMAL(10,2) DEFAULT 0,
          ajustes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    // Crear tabla de paquetes_servicio si no existe
    await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS paquetes_servicio (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          nombre VARCHAR(100) NOT NULL,
          descripcion TEXT,
          procesos JSONB,
          tiempo_total INTEGER,
          costo_total DECIMAL(10,2),
          precio_venta DECIMAL(10,2),
          activo BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    // Crear tabla de ordenes_trabajo si no existe
    await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS ordenes_trabajo (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          cliente_id UUID REFERENCES auth.users(id),
          vehiculo_id UUID,
          estado VARCHAR(50) DEFAULT 'Pendiente',
          fecha_ingreso DATE NOT NULL,
          fecha_estimada_entrega DATE,
          fecha_entrega DATE,
          procesos JSONB,
          materiales JSONB,
          costo_total DECIMAL(10,2),
          precio_total DECIMAL(10,2),
          notas TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    // Crear tabla de tecnicos si no existe
    await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS tecnicos (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          usuario_id UUID REFERENCES auth.users(id),
          nombre VARCHAR(100) NOT NULL,
          especialidad VARCHAR(100),
          activo BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    // Insertar datos de ejemplo en procesos_taller
    await supabase.rpc("execute_sql", {
      sql_query: `
        INSERT INTO procesos_taller (nombre, descripcion, tipo, tiempo_estimado, orden)
        VALUES 
          ('Ingreso', 'Recepción y diagnóstico inicial del vehículo', 'ingreso', 30, 1),
          ('Desarmado', 'Desmontaje de piezas afectadas', 'reparacion', 60, 2),
          ('Reparación', 'Reparación de piezas dañadas', 'reparacion', 180, 3),
          ('Empapelado', 'Preparación para pintura', 'pintura', 60, 4),
          ('Pintura', 'Aplicación de pintura', 'pintura', 120, 5),
          ('Mecánica', 'Reparaciones mecánicas', 'mecanica', 240, 6),
          ('Armado', 'Montaje de piezas reparadas', 'reparacion', 90, 7),
          ('Control de Calidad', 'Verificación final', 'calidad', 30, 8)
        ON CONFLICT (id) DO NOTHING;
      `,
    })

    return NextResponse.json({ success: true, message: "Tablas de taller inicializadas correctamente" })
  } catch (error) {
    console.error("Error al inicializar tablas de taller:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
