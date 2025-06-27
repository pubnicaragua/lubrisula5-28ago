// Configuración centralizada de Supabase
export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
}

// Validar configuración
export function validateSupabaseConfig() {
  const errors: string[] = []

  if (!supabaseConfig.url) {
    errors.push("NEXT_PUBLIC_SUPABASE_URL no está definido")
  }

  if (!supabaseConfig.anonKey) {
    errors.push("NEXT_PUBLIC_SUPABASE_ANON_KEY no está definido")
  }

  if (!supabaseConfig.serviceRoleKey) {
    errors.push("SUPABASE_SERVICE_ROLE_KEY no está definido")
  }

  if (errors.length > 0) {
    throw new Error(`Configuración de Supabase incompleta:\n${errors.join("\n")}`)
  }

  return true
}

// Verificar configuración al importar
if (typeof window === "undefined") {
  // Solo validar en el servidor
  try {
    validateSupabaseConfig()
  } catch (error) {
    console.error("Error de configuración de Supabase:", error)
  }
}
