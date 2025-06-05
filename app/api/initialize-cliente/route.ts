import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Crear tabla de vehículos de cliente si no existe
    await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS client_vehicles (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          make VARCHAR(100) NOT NULL,
          model VARCHAR(100) NOT NULL,
          year INTEGER NOT NULL,
          color VARCHAR(50),
          license_plate VARCHAR(20),
          vin VARCHAR(50),
          status VARCHAR(50) DEFAULT 'Activo',
          last_service_date DATE,
          alerts TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    // Crear tabla de citas de cliente si no existe
    await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS client_appointments (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          vehicle_id UUID REFERENCES client_vehicles(id) ON DELETE SET NULL,
          service_type VARCHAR(100) NOT NULL,
          appointment_date DATE NOT NULL,
          appointment_time TIME NOT NULL,
          status VARCHAR(50) DEFAULT 'Pendiente',
          location VARCHAR(100),
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    // Crear tabla de historial de servicios si no existe
    await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS service_history (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          vehicle_id UUID REFERENCES client_vehicles(id) ON DELETE SET NULL,
          service_type VARCHAR(100) NOT NULL,
          service_date DATE NOT NULL,
          status VARCHAR(50) DEFAULT 'Completado',
          technician VARCHAR(100),
          warranty VARCHAR(50),
          cost DECIMAL(10,2),
          services JSONB,
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    return NextResponse.json({ success: true, message: "Tablas de cliente inicializadas correctamente" })
  } catch (error) {
    console.error("Error al inicializar tablas de cliente:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
