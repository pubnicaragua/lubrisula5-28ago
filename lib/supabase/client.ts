import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// Verificar que las variables de entorno estén definidas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL no está definido")
}

if (!supabaseAnonKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY no está definido")
}

// Función para crear el cliente de Supabase
export function createClient() {
  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
}
export function createAdmin() {
  return createSupabaseClient<Database>(supabaseUrl, supabaseRoleKey)
}

// Cliente singleton
let supabaseClientInstance: ReturnType<typeof createSupabaseClient<Database>> | null = null

export function getSupabaseClient() {
  if (!supabaseClientInstance) {
    supabaseClientInstance = createClient()
  }
  return supabaseClientInstance
}
export function getSupabaseAdmin() {
  if (!supabaseClientInstance) {
    supabaseClientInstance = createAdmin()
  }
  return supabaseClientInstance
}

// Exportar cliente por defecto
export const supabase = getSupabaseClient()

// Exportar también como supabaseClient para compatibilidad
export const supabaseClient = supabase

// Exportar por defecto
export default supabase
