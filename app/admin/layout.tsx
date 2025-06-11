import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import type React from "react"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabaseClient = createServerSupabaseClient()

  // Get session server-side
  const {
    data: { session },
  } = await supabaseClient.auth.getSession()

  if (!session) {
    redirect("/auth/login")
  }

  // Get user roles
  const { data: roles } = await supabaseClient
    .from("roles_usuario")
    .select("rol_id")
    .eq("user_id", session.user.id)

  const { data: rolesInfo } = await supabaseClient
    .from("roles")
    .select("nombre")
    .in("id", roles?.map((r) => r.rol_id) || [])

  const userRoles = rolesInfo?.map((r) => r.nombre.toLowerCase()) || []

  // Check if user has admin or superadmin role
  if (!userRoles.includes("admin") && !userRoles.includes("superadmin")) {
    redirect("/dashboard")
  }

  return <>{children}</>
}
