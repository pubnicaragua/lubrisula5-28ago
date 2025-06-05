import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const supabase = createClient()
  const url = new URL(request.url)
  const tablesParam = url.searchParams.get("tables")

  if (!tablesParam) {
    return NextResponse.json({ error: 'Parámetro "tables" requerido' }, { status: 400 })
  }

  const tables = tablesParam.split(",")
  const results: Record<string, boolean> = {}
  let allExist = true

  try {
    for (const table of tables) {
      const { data, error } = await supabase.rpc("execute_sql", {
        sql_query: `
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public'
            AND table_name = '${table}'
          );
        `,
      })

      if (error) {
        console.error(`Error al verificar tabla ${table}:`, error)
        return NextResponse.json({ error: `Error al verificar tabla ${table}` }, { status: 500 })
      }

      const exists = data && data.length > 0 && data[0].exists
      results[table] = exists

      if (!exists) {
        allExist = false
      }
    }

    return NextResponse.json({
      success: allExist,
      results,
    })
  } catch (error) {
    console.error("Error al verificar tablas:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
