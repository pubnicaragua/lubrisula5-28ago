import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    // Verificar que las variables de entorno estén definidas
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error("Variables de entorno faltantes:", {
        urlExists: !!supabaseUrl,
        keyExists: !!supabaseKey,
      })
      return NextResponse.json(
        {
          success: false,
          message: "Las variables de entorno de Supabase no están configuradas correctamente",
          debug: {
            urlExists: !!supabaseUrl,
            keyExists: !!supabaseKey,
          },
        },
        { status: 500 },
      )
    }

    // Crear cliente de Supabase en el servidor
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Realizar una consulta simple para verificar la conexión
    const { data, error } = await supabase.from("roles").select("*").limit(1)

    if (error) {
      console.error("Error de Supabase:", error)
      throw error
    }

    return NextResponse.json({
      success: true,
      message: "Conexión exitosa a Supabase",
      debug: { hasData: !!data, dataLength: data?.length || 0 },
    })
  } catch (error: any) {
    console.error("Error al verificar la conexión a Supabase:", error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error al conectar con Supabase",
        errorDetails: JSON.stringify(error),
      },
      { status: 500 },
    )
  }
}
