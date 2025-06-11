import { createClient } from "@supabase/supabase-js" // createClient se importa de @supabase/supabase-js
import type { Database } from "./database.types"

// Verificar que las variables de entorno estén definidas
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL no está definido")
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY no está definido")
}

// Crear cliente de Supabase con el rol de servicio para operaciones administrativas
export const supabaseAdmin = createClient<Database>(
  // supabaseAdmin es lo que se exporta
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
)
