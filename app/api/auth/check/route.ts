import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    // Verificar que las variables de entorno estén definidas
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        {
          success: false,
          message: "Variables de entorno de Supabase no configuradas",
          details: {
            urlDefined: !!supabaseUrl,
            keyDefined: !!supabaseKey,
          },
        },
        { status: 500 },
      )
    }

    // Crear cliente de Supabase
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Verificar que el servicio de autenticación esté disponible
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Error al conectar con el servicio de autenticación",
          error: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Conexión exitosa con el servicio de autenticación",
      hasSession: !!data.session,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error inesperado",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
