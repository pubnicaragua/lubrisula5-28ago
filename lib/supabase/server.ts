import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "./database.types"
import { cache } from "react"

// Crear cliente de Supabase para el lado del servidor
export const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
})

// Añadimos esta función para mantener compatibilidad con el código existente
export const getSupabaseServer = createServerSupabaseClient

// Añadimos createClient como alias para mantener compatibilidad con código que lo importa
export const createClient = createServerSupabaseClient
