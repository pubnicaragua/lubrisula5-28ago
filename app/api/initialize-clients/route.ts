import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST() {
  const supabase = createClient()

  try {
    // Verificar si la tabla clients existe
    const { error: checkError } = await supabase.rpc("execute_sql", {
      sql_query: `
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public'
          AND table_name = 'clients'
        );
      `,
    })

    if (checkError) {
      return NextResponse.json(
        {
          success: false,
          error: "Error al verificar tabla clients",
          detalle: checkError.message,
        },
        { status: 500 },
      )
    }

    // Crear tabla clients si no existe
    const { error: createError } = await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS clients (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          company TEXT,
          phone TEXT NOT NULL,
          email TEXT,
          client_type TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    if (createError) {
      return NextResponse.json(
        {
          success: false,
          error: "Error al crear tabla clients",
          detalle: createError.message,
        },
        { status: 500 },
      )
    }

    // Insertar datos de ejemplo
    const clientesEjemplo = [
      {
        name: "Juan Pérez",
        company: "Empresa A",
        phone: "555-1234",
        email: "juan.perez@ejemplo.com",
        client_type: "Particular",
      },
      {
        name: "María López",
        company: "Empresa B",
        phone: "555-5678",
        email: "maria.lopez@ejemplo.com",
        client_type: "Empresa",
      },
      {
        name: "Carlos Rodríguez",
        company: null,
        phone: "555-9012",
        email: "carlos.rodriguez@ejemplo.com",
        client_type: "Particular",
      },
      {
        name: "Ana Martínez",
        company: "Empresa C",
        phone: "555-3456",
        email: "ana.martinez@ejemplo.com",
        client_type: "Empresa",
      },
      {
        name: "Pedro Sánchez",
        company: null,
        phone: "555-7890",
        email: "pedro.sanchez@ejemplo.com",
        client_type: "Particular",
      },
    ]

    // Insertar clientes de ejemplo
    const { error: insertError } = await supabase.from("clients").upsert(clientesEjemplo, {
      onConflict: "name, phone",
    })

    if (insertError) {
      return NextResponse.json(
        {
          success: false,
          error: "Error al insertar datos de ejemplo",
          detalle: insertError.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Tabla clients inicializada correctamente",
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Error interno del servidor",
        detalle: error.message,
      },
      { status: 500 },
    )
  }
}
