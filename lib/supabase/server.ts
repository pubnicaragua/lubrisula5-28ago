import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "./database.types"

// Create Supabase client for server-side
export const createServerSupabaseClient = () => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
}

// Keep these exports for compatibility with existing code
export const getSupabaseServer = createServerSupabaseClient
export const createClient = createServerSupabaseClient