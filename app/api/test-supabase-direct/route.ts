import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    // Obtener las variables de entorno
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Verificar si las variables están definidas
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        {
          success: false,
          message: "Variables de entorno no configuradas",
          details: {
            urlDefined: !!supabaseUrl,
            keyDefined: !!supabaseKey,
          },
        },
        { status: 500 },
      )
    }

    // Intentar crear un cliente de Supabase
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Intentar una consulta simple
    const { data, error } = await supabase.from("roles").select("count").limit(1)

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Error al consultar la base de datos",
          error: error.message,
          details: error,
        },
        { status: 500 },
      )
    }

    // Devolver éxito
    return NextResponse.json({
      success: true,
      message: "Conexión exitosa a Supabase",
      data: data,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error inesperado",
        error: error.message,
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}
