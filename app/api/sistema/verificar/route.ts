import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST() {
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

    // Verificar tablas
    const tablas = [
      "roles",
      "roles_usuario",
      "clients",
      "vehicles",
      "talleres",
      "aseguradoras",
      "quotations",
      "quotation_parts",
      "orders",
      "order_details",
      "materiales",
      "kanban_columns",
      "kanban_cards",
    ]

    const tablasExistentes = []
    const tablasNoExistentes = []

    for (const tabla of tablas) {
      const { count, error } = await supabase.from(tabla).select("*", { count: "exact", head: true })

      if (error) {
        tablasNoExistentes.push(tabla)
      } else {
        tablasExistentes.push({ nombre: tabla, registros: count })
      }
    }

    // Verificar roles
    const { data: roles, error: rolesError } = await supabase.from("roles").select("nombre")

    // Verificar usuarios con roles
    const { data: usuariosRoles, error: usuariosError } = await supabase
      .from("roles_usuario")
      .select("user_id, roles(nombre)")

    // Verificar políticas
    const { data: politicas, error: politicasError } = await supabase.rpc("get_policies_for_table", {
      table_name: "roles_usuario",
    })

    // Verificar función user_has_role
    const { data: funcionExiste, error: funcionError } = await supabase.rpc("execute_sql", {
      sql_query: `
        SELECT EXISTS (
          SELECT 1
          FROM pg_proc
          WHERE proname = 'user_has_role'
        )
      `,
    })

    return NextResponse.json({
      success: true,
      message: "Verificación completada",
      tablas: tablasExistentes.length,
      tablasExistentes,
      tablasNoExistentes,
      roles: roles?.length || 0,
      rolesDisponibles: roles?.map((r) => r.nombre) || [],
      usuarios: usuariosRoles?.length || 0,
      politicas: politicas?.length || 0,
      funciones: funcionExiste?.[0]?.exists ? 1 : 0,
      estado: tablasNoExistentes.length === 0 ? "completo" : "incompleto",
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Error al verificar sistema",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
