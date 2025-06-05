import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { TallerDashboard } from "@/components/taller/taller-dashboard"
import { AseguradoraDashboard } from "@/components/aseguradora/aseguradora-dashboard"
import { ClienteDashboard } from "@/components/cliente/cliente-dashboard"

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login")
  }

  // Obtener el rol del usuario
  const { data: userRoles } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id).single()

  const role = userRoles?.role || "cliente"

  // Renderizar el dashboard correspondiente según el rol
  switch (role) {
    case "admin":
      return <AdminDashboard />
    case "taller":
      return <TallerDashboard />
    case "aseguradora":
      return <AseguradoraDashboard />
    case "cliente":
    default:
      return <ClienteDashboard />
  }
}
