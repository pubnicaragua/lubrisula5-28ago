import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// Variables de entorno con valores por defecto seguros
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wcyvgqbtaimkguaslhom.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjeXZncWJ0YWlta2d1YXNsaG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNzQ5MjMsImV4cCI6MjA2Mjc1MDkyM30.fJAXPGUKaXyK1BgNHJx_M-MM7pswqusZtSK2Ji2KQZQ"

// Función para crear el cliente de Supabase
export function createClient() {
  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
}

// Cliente singleton
let supabaseClientInstance: ReturnType<typeof createSupabaseClient<Database>> | null = null

export function getSupabaseClient() {
  if (!supabaseClientInstance) {
    supabaseClientInstance = createClient()
  }
  return supabaseClientInstance
}

// Exportar cliente por defecto
export const supabase = getSupabaseClient()
