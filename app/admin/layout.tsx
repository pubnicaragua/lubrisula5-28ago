// import { createServerSupabaseClient } from "@/lib/supabase/server"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { AdminNav } from "@/components/admin/admin-nav"
import { UserNav } from "@/components/user-nav"
import { ModeToggle } from "@/components/mode-toggle"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
    const supabase = createServerComponentClient({ cookies })
  // const supabase = createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  console.log(session)
  if (!session) {
    redirect('/auth/login')
  }

  // const { data: user } = await supabase
  //   .from('roles_usuario')
  //   .select('rol(nombre)')
  //   .eq('user_id', session.user.id)
  //   .single()

  console.log(session.user.user_metadata)
  const rol = session.user.user_metadata?.role
  console.log('Rol:', rol)
  if (rol !== 'admin' && rol !== 'superadmin') {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="flex items-center font-semibold">
            <h2 className="text-lg font-semibold">Taller Automotriz - Panel Admin</h2>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <ModeToggle />
            <UserNav />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div> */}
        <div className="grid grid-cols-12 gap-4 h-screen">
          <div className="col-span-12 lg:col-span-3 space-y-4 h-screen overflow-y-auto">
            <AdminNav />
          </div>
          <div className="col-span-12 lg:col-span-9 space-y-4 h-screen">{children}</div>
        </div>
      </div>  
    </div>
  )
}


// import { createServerSupabaseClient } from "@/lib/supabase/server"
// import { redirect } from "next/navigation"
// import type React from "react"

// export default async function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const supabaseClient = createServerSupabaseClient()

//   // Get session server-side
//   const {
//     data: { session },
//   } = await supabaseClient.auth.getSession()

//   if (!session) {
//     redirect("/auth/login")
//   }

//   // Get user roles
//   const { data: roles } = await supabaseClient
//     .from("roles_usuario")
//     .select("rol_id")
//     .eq("user_id", session.user.id)

//   const { data: rolesInfo } = await supabaseClient
//     .from("roles")
//     .select("nombre")
//     .in("id", roles?.map((r) => r.rol_id) || [])

//   const userRoles = rolesInfo?.map((r) => r.nombre.toLowerCase()) || []

//   // Check if user has admin or superadmin role
//   if (!userRoles.includes("admin") && !userRoles.includes("superadmin")) {
//     redirect("/dashboard")
//   }

//   return <>{children}</>
// }
