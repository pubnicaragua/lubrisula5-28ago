import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin-client"

export async function GET() {
  try {
    // 1. Verificar conexión a Supabase
    const { data: connectionTest, error: connectionError } = await supabaseAdmin
      .from("roles")
      .select("count(*)")
      .single()

    if (connectionError) {
      return NextResponse.json(
        {
          success: false,
          message: "Error de conexión a Supabase",
          error: connectionError.message,
          fix: "Verifica las variables de entorno SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY",
        },
        { status: 500 },
      )
    }

    // 2. Verificar tablas necesarias
    const requiredTables = ["roles", "roles_usuario", "perfil_usuario"]
    const tableChecks: Record<string, any> = {}

    for (const table of requiredTables) {
      const { data, error } = await supabaseAdmin.from(table).select("count(*)").single()

      tableChecks[table] = {
        exists: !error,
        count: data?.count || 0,
        error: error?.message,
      }
    }

    // 3. Verificar políticas de seguridad (opcional)
    let policies = []
    let policiesError = null

    try {
      const { data: policiesData, error: policiesErr } = await supabaseAdmin.rpc("get_policies_for_table", {
        table_name: "roles_usuario",
      })
      policies = policiesData || []
      policiesError = policiesErr?.message
    } catch (error) {
      // Si la función RPC no existe, continuamos sin error
      policiesError = "Función get_policies_for_table no disponible"
    }

    return NextResponse.json({
      success: true,
      connection: {
        status: "connected",
        message: "Conexión a Supabase establecida correctamente",
      },
      tables: tableChecks,
      policies: policies,
      policiesError: policiesError,
      recommendations: [
        "Visita /fix-users para corregir problemas con usuarios específicos",
        "Ejecuta el script SQL proporcionado para asignar roles correctamente",
        "Verifica que las políticas RLS estén configuradas correctamente",
      ],
    })
  } catch (error) {
    console.error("Error en check-dashboard:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error al verificar el dashboard",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
