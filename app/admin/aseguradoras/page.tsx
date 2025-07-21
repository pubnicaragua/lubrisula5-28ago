// import { createServerSupabaseClient } from "@/lib/supabase/server"
"use client"
import { redirect } from "next/navigation"
import { AseguradorasPage } from "@/components/aseguradoras/aseguradoras-page"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import ASEGURADORA_SERVICE, { AseguradoraType } from "@/services/ASEGURADORA_SERVICES.service"
import { useEffect, useState } from "react"
export const dynamic = "force-dynamic"


// async function fetchAseguradoras() {

//   const supabaseClient = createServerComponentClient({ cookies })

//   // Verificar si el usuario está autenticado
//   const {
//     data: { session },
//   } = await supabaseClient.auth.getSession()
//   if (!session) {
//     redirect("/auth/login")
//   }

//   // Verificar si el usuario tiene rol de admin o superadmin
//   const { data: roles } = await supabaseClient.from("roles_usuario").select("rol_id").eq("user_id", session.user.id)

//   const { data: rolesInfo } = await supabaseClient
//     .from("roles")
//     .select("nombre")
//     .in("id", roles?.map((r) => r.rol_id) || [])

//   const userRoles = rolesInfo?.map((r) => r.nombre) || []
//   console.log(userRoles)
//   if (!userRoles.includes("admin") && !userRoles.includes("SuperAdmin")) {
//     redirect("/dashboard")
//   }

//   // try {
//   //   // Obtener aseguradoras con información de clientes y flotas relacionados
//   //   const { data, error } = await supabaseClient
//   //     .from("aseguradoras")
//   //     .select(`
//   //       *,
//   //       clientes:cliente_id(*),
//   //       flotas:flota_id(*)
//   //     `)
//   //     .order("created_at", { ascending: false })
//   //   console.log("Aseguradoras obtenidas:", data)


//   //   if (error) {
//   //     console.error("Error al obtener aseguradoras:", error.message)
//   //     return { aseguradoras: [], error: error.message }
//   //   }

//   //   return { aseguradoras: data || [], error: null }
//   // } catch (error) {
//   //   console.error("Error al obtener aseguradoras:", error)
//   //   return { aseguradoras: [], error: "Error al obtener aseguradoras" }
//   // }

// }

export default async function AdminAseguradorasPage() {

    const [State_Aseguradoras, SetState_Aseguradoras] = useState<AseguradoraType[]>([])
  // const { aseguradoras, error } = await fetchAseguradoras()

  const Fn_GET_ASEGURADORAS = async () => {
    const res: AseguradoraType[] = await ASEGURADORA_SERVICE.GET_ASEGURADORAS()
    SetState_Aseguradoras(res)

  }
  useEffect(() => {
    Fn_GET_ASEGURADORAS()
  }, [])

  return (
    <div className="container mx-auto h-full overflow-auto">
      <AseguradorasPage aseguradoras={State_Aseguradoras} error={null} />
    </div>
  )
}
