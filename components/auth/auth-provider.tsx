"use client"

import type React from "react"

import { AuthProvider as SupabaseAuthProvider } from "@/lib/supabase/auth"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SupabaseAuthProvider>{children}</SupabaseAuthProvider>
}
