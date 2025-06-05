import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "./database.types"

// Re-exportar createClient para que esté disponible como exportación nombrada
// export { createClient }

// Verificamos que las variables de entorno estén disponibles
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Creamos una función que verifica las variables de entorno antes de crear el cliente
export function createClient() {
  // Solo creamos el cliente si estamos en el navegador y tenemos las variables de entorno
  if (typeof window !== "undefined" && supabaseUrl && supabaseAnonKey) {
    return createSupabaseClient(supabaseUrl, supabaseAnonKey)
  }

  // Si estamos en el servidor durante la prerenderización y no tenemos las variables,
  // devolvemos un cliente simulado para evitar errores
  if (typeof window === "undefined") {
    return {
      from: () => ({
        select: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
        }),
      }),
      // Añadir otros métodos simulados según sea necesario
    }
  }

  // Si estamos en el navegador pero faltan las variables, lanzamos un error
  console.error("Supabase URL and Anon Key are required")
  throw new Error("Supabase URL and Anon Key are required")
}

// Re-exportamos createClient de @supabase/supabase-js para mantener compatibilidad from "@supabase/supabase-js"

// URL completa de Supabase como respaldo
const FALLBACK_SUPABASE_URL = "https://wcyvgqbtaimkguaslhom.supabase.co"
const FALLBACK_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjeXZncWJ0YWlta2d1YXNsaG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNzQ5MjMsImV4cCI6MjA2Mjc1MDkyM30.fJAXPGUKaXyK1BgNHJx_M-MM7pswqusZtSK2Ji2KQZQ"

// Función para validar y corregir la URL de Supabase
function getValidSupabaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""

  // Si la URL está completa y es válida, usarla
  if (envUrl && envUrl.includes("supabase.co")) {
    return envUrl
  }

  // Si la URL está truncada pero contiene el inicio correcto, completarla
  if (envUrl && envUrl.includes("wcyvgqbtaimkguaslhom")) {
    return "https://wcyvgqbtaimkguaslhom.supabase.co"
  }

  // Usar URL de respaldo
  console.warn("Using fallback Supabase URL. Please check your environment variables.")
  return FALLBACK_SUPABASE_URL
}

// Singleton pattern para el cliente de Supabase
let supabaseClientInstance: ReturnType<typeof createSupabaseClient<Database>> | null = null

export function getSupabaseClient() {
  if (!supabaseClientInstance) {
    try {
      // Obtener URL válida y clave
      const supabaseUrl = getValidSupabaseUrl()
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY

      console.log("Creating Supabase client with URL:", supabaseUrl)

      supabaseClientInstance = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      })
    } catch (error) {
      console.error("Error al crear cliente de Supabase:", error)
      throw error
    }
  }

  return supabaseClientInstance
}

// Cliente moderno usando auth-helpers-nextjs con manejo de errores mejorado
export const createClientComponent = () => {
  try {
    // Obtener URL válida y clave
    const supabaseUrl = getValidSupabaseUrl()
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY

    return createClientComponentClient<Database>({
      supabaseUrl: supabaseUrl,
      supabaseKey: supabaseAnonKey,
      options: {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      },
    })
  } catch (error) {
    console.error("Error al crear cliente de Supabase:", error)
    throw error
  }
}

// Para mantener compatibilidad con el código existente
export const supabaseClient = getSupabaseClient()
export const supabase = createClientComponent()
