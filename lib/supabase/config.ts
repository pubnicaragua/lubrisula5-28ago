import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wcyvgqbtaimkguaslhom.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjeXZncWJ0YWlta2d1YXNsaG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNzQ5MjMsImV4cCI6MjA2Mjc1MDkyM30.fJAXPGUKaXyK1BgNHJx_M-MM7pswqusZtSK2Ji2KQZQ"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
