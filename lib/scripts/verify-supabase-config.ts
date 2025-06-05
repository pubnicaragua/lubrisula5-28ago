import { createClient } from "@supabase/supabase-js"

export async function verifySupabaseConfig() {
  try {
    // Verificar que las variables de entorno estén definidas
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return {
        success: false,
        message: "Faltan variables de entorno de Supabase",
        details: {
          url: !!supabaseUrl,
          anonKey: !!supabaseAnonKey,
        },
      }
    }

    // Intentar crear un cliente de Supabase
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Verificar la conexión con una consulta simple
    const { data, error } = await supabase.from("_verify_connection").select("*").limit(1).maybeSingle()

    if (error && error.code !== "PGRST116") {
      // PGRST116 significa que la tabla no existe, lo cual es aceptable
      return {
        success: false,
        message: "Error al conectar con Supabase",
        details: error,
      }
    }

    return {
      success: true,
      message: "Configuración de Supabase verificada correctamente",
      details: {
        url: supabaseUrl,
      },
    }
  } catch (error) {
    return {
      success: false,
      message: "Error al verificar la configuración de Supabase",
      details: error instanceof Error ? error.message : "Error desconocido",
    }
  }
}
