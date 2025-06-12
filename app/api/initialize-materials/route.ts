import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin-client"

export async function GET() {
  try {
    // Crear tablas de materiales usando SQL directo
    const { error: createTablesError } = await supabaseAdmin.rpc("execute_sql", {
      sql_query: `
        -- Crear tabla de categorías de materiales
        CREATE TABLE IF NOT EXISTS categorias_materiales (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          nombre TEXT NOT NULL UNIQUE,
          descripcion TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Crear tabla de materiales
        CREATE TABLE IF NOT EXISTS materiales (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          categoria_id UUID REFERENCES categorias_materiales(id) ON DELETE SET NULL,
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
    })

    if (createTablesError) {
      return NextResponse.json({ error: `Error al crear tablas: ${createTablesError.message}` }, { status: 500 })
    }

    // Insertar categorías de materiales
    const categorias = [
      { nombre: "Pintura", descripcion: "Materiales de pintura" },
      { nombre: "Carrocería", descripcion: "Materiales para carrocería" },
      { nombre: "Mecánica", descripcion: "Materiales para mecánica" },
      { nombre: "Eléctrica", descripcion: "Materiales eléctricos" },
    ]

    // Insertar categorías de materiales
    for (const categoria of categorias) {
      const { data, error } = await supabaseAdmin.from("categorias_materiales").insert([categoria]).select()

      if (error) {
        return NextResponse.json({ error: `Error al insertar categorías: ${error.message}` }, { status: 500 })
      }
    }

    return NextResponse.json({ message: "Tablas de materiales inicializadas correctamente" })
  } catch (error) {
    console.error("Error al inicializar tablas de materiales:", error)
    return NextResponse.json({ error: "Error al inicializar tablas de materiales" }, { status: 500 })
  }
}
