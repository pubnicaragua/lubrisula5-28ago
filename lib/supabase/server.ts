// import { createServerClient } from "@supabase/ssr"
// import { cookies } from "next/headers"
// import type { Database } from "./database.types"

// export async function createClient() {
//   const cookieStore = cookies()

//   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
//   const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

//   if (!supabaseUrl) {
//     throw new Error("NEXT_PUBLIC_SUPABASE_URL no está definido")
//   }

//   if (!supabaseAnonKey) {
//     throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY no está definido")
//   }

//   return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
//     cookies: {
//       getAll() {
//         return cookieStore.getAll()
//       },
//       setAll(cookiesToSet) {
//         try {
//           cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
//         } catch {
//           // The `setAll` method was called from a Server Component.
//           // This can be ignored if you have middleware refreshing
//           // user sessions.
//         }
//       },
//     },
//   })
// }

// // Exportar función para obtener el cliente del servidor
// export async function getServerClient() {
//   return await createClient()
// }

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

// Exportar función para obtener el cliente del servidor
export async function getServerClient() {
  return await createClient()
}