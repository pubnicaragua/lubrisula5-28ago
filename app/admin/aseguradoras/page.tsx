import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AseguradorasPage } from "@/components/aseguradoras/aseguradoras-page"

export const dynamic = "force-dynamic"

async function fetchAseguradoras() {
  const supabaseClient = createServerSupabaseClient()

  // Verificar si el usuario está autenticado
  const {
    data: { session },
  } = await supabaseClient.auth.getSession()
  if (!session) {
    redirect("/auth/login")
  }

  // Verificar si el usuario tiene rol de admin o superadmin
  const { data: roles } = await supabaseClient.from("roles_usuario").select("rol_id").eq("user_id", session.user.id)

  const { data: rolesInfo } = await supabaseClient
    .from("roles")
    .select("nombre")
    .in("id", roles?.map((r) => r.rol_id) || [])

  const userRoles = rolesInfo?.map((r) => r.nombre) || []

  if (!userRoles.includes("Admin") && !userRoles.includes("SuperAdmin")) {
    redirect("/dashboard")
  }

  try {
    // Obtener aseguradoras con información de clientes y flotas relacionados
    const { data, error } = await supabaseClient
      .from("aseguradoras")
      .select(`
        *,
        clientes:cliente_id(*),
        flotas:flota_id(*)
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error al obtener aseguradoras:", error.message)
      return { aseguradoras: [], error: error.message }
    }

    return { aseguradoras: data || [], error: null }
  } catch (error) {
    console.error("Error al obtener aseguradoras:", error)
    return { aseguradoras: [], error: "Error al obtener aseguradoras" }
  }
}

export default async function AdminAseguradorasPage() {
  const { aseguradoras, error } = await fetchAseguradoras()

  return (
    <div className="container mx-auto py-10">
      <AseguradorasPage aseguradoras={aseguradoras} error={error} />
    </div>
  )
}
