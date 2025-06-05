import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = createClient()
  const tablas = ["procesos_taller", "materiales", "material_orden", "material_cotizacion", "suppliers"]

  const resultados: Record<string, boolean> = {}
  let todasExisten = true

  try {
    // Verificar conexión a Supabase
    const { data: connectionTest, error: connectionError } = await supabase
      .from("clients")
      .select("count()", { count: "exact", head: true })

    if (connectionError) {
      return NextResponse.json(
        {
          success: false,
          error: "Error de conexión a Supabase",
          detalle: connectionError.message,
        },
        { status: 500 },
      )
    }

    // Verificar existencia de tablas
    for (const tabla of tablas) {
      const { data, error } = await supabase.rpc("execute_sql", {
        sql_query: `
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public'
            AND table_name = '${tabla}'
          );
        `,
      })

      if (error) {
        return NextResponse.json(
          {
            success: false,
            error: `Error al verificar tabla ${tabla}`,
            detalle: error.message,
          },
          { status: 500 },
        )
      }

      const existe = data && data.length > 0 && data[0].exists
      resultados[tabla] = existe

      if (!existe) {
        todasExisten = false
      }
    }

    // Crear tabla suppliers si no existe
    if (!resultados["suppliers"]) {
      const { error: createError } = await supabase.rpc("execute_sql", {
        sql_query: `
          CREATE TABLE IF NOT EXISTS suppliers (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL,
            contact_name TEXT,
            email TEXT,
            phone TEXT,
            address TEXT,
            notes TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `,
      })

      if (createError) {
        return NextResponse.json(
          {
            success: false,
            error: "Error al crear tabla suppliers",
            detalle: createError.message,
          },
          { status: 500 },
        )
      }

      resultados["suppliers"] = true
    }

    return NextResponse.json({
      success: true,
      conexion: "OK",
      tablas: resultados,
      todasExisten,
      mensaje: todasExisten
        ? "Todo está listo para las pruebas"
        : "Algunas tablas no existen. Ejecute la inicialización de tablas.",
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
