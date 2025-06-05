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
          details: {
            url: supabaseUrl ? "Configurada" : "No configurada",
            serviceKey: supabaseServiceKey ? "Configurada" : "No configurada",
          },
        },
        { status: 500 },
      )
    }

    // Crear cliente de Supabase con la clave de servicio
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Intentar una operación simple para verificar la conexión
    const { data, error } = await supabase.from("roles").select("count").single()

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: "Error de conexión a Supabase",
          details: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Conexión a Supabase verificada correctamente",
      details: {
        url: supabaseUrl,
        keyLength: supabaseServiceKey.length,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Error al verificar la conexión",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
